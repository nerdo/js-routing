# @nerdo/routing
A general purpose routing behavior for applications and components.

Code samples here look like React code, @nerdo/routing is _not_ limited to being used with React.

The choice to use samples that look like React code is strictly _for the sake of familiarity_ since React is the industry standard JavaScript UI library at the time of this writing.

## Table of Contents

* [Goals](#goals)
* [Routing Scenarios](#routing-scenarios)
  * [URL Routing](#url-routing)
  * [State Routing](#state-routing)
  * [Custom Routing](#custom-routing)
* [Defining Routes](#defining-routes)
* [Applying Routing](#applying-routing)
  * [Nested Routing](#nested-routing)

## Goals
* Test driven.
* Framework agnostic.
* Environment agnostic.

@nerdo/routing is heavily inspired by [React Hook Router](https://github.com/Paratron/hookrouter).

## Routing Scenarios

**URL Routing** is the most common routing use case, but it is not the only kind of routing that can take place with @nerdo/routing.

With the exception of this section, this guide focuses on **URL Routing**. For details on how other scenarios differ, please refer to the full API documentation.

### URL Routing
URL routing and navigation take place in the web browser using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API).

@nerdo/routing exports a pre-configured `urlRouting` object for this scenario.

```js
// routing.js
import { urlRouting } from '@nerdo/routing'
export default urlRouting
```

Sometimes URL routing needs configuration.

For example, you may be writing a re-usable component that needs routing, but it may be part of a larger application that already has URL routing in place. Your custom component's router needs to take over routing once it is loaded.

In cases like this, call the helper function `configuredUrlRouting()` and pass it an object with the `baseUrl` set...

```js
// routing.js
import { configuredUrlRouting } from  '@nerdo/routing'
export default configuredUrlRouting({ baseUrl: '/foo/bar' })
```

### State Routing

Another routing  use case might be a desktop application which navigates using states instead of URLs.

For scenarios like this, @nerdo/routing exports a pre-configured `stateRouting` object.

```js
// routing.js
import { stateRouting } from '@nerdo/routing'
export default stateRouting
```

### Custom Routing

@nerdo/routing navigates via the [History API _interface_](https://developer.mozilla.org/en-US/docs/Web/API/History), but it does not presume that it will run in the a browser. Routing can be configured with whatever scheme one dreams up.

To set up custom writing, provide a navigator object that _implements_ the [History API interface](https://developer.mozilla.org/en-US/docs/Web/API/History) and a selectedRoute function which takes a navigator state and route definitions and returns the definition that matches the navigator state.

```js
// routing.js
import { makeRouting } from '@nerdo/routing'
import { navigator, selectedRoute } from '/dreamScheme'
export default makeRouting({ navigator, selectedRoute })
```

## Defining Routes

When the routing is applied, the `applyRouting` function takes a list of routes and looks for the most specific URL match. `applyRouting` then calls the function associated with the matched URL and returns its value.

Routes can be defined in abbreviated format (as an object) or in an expanded form (as an array).

In the abbreviated form, each object key is the route's URL path, and each value is a function that returns what the path routes to.

Typically, the route function will return a component, but you can return anything you need: a string, a number, an object, a function, etc. Returning functions is especially useful when dealing with [Nested Routing](#nested-routing).

Here is a simple example routing the `/` path to the `HomePage` component, and `/about` to the `AboutPage` component.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />
}
```

Here is the same thing in the expanded array form.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        path: '/',
        route: () => <HomePage />
    },
    {
        path: '/about',
        route: () => <AboutPage />
    }
]
```

Using the expanded array form, you can match the path using a regular expression or a function.

The following a simple function matcher to route to the `HomePage` component and a regular expression to route both `/info` and `/about` to the `AboutPage` component and demonstrates a simple function matcher.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        path: () => p => p === '/',
        route: () => <HomePage />
    },
    [
        path: /^\/(?:info|about)/,
        route: () => <AboutPage />
    ]
]
```

Routes can also define both path and query string parmaters that need to be present in order for the route to match.

Here's an example with both:

```js
// routes.js
import { DocumentSearchPage } from './pages'
export const routes = [
    {
        path: '/documents/:folder?find',
        route: ({ folder, find }, { page }) => <DocumentSearchPage folder={folder} query={find} page={page} />
    }
]
```

The section `:folder` is a dynamic URL parameter that gets passed to the `route` function, so if the URL is `/documents/reports?query=summary`, the `folder` variable will have the captured value `reports` from the URL. It will also have captured `summary` as the `find` query parameter.

It's important to note that if the `find` parameter is not part of the URL (e.g. `/documents/reports`), this route will **NOT** match. Query parameters defined in the path are required.

The query string parameter `page` is an optional parameter. _All_ query string parameters (including required ones) are passed to the `route` function as properties on an object to its _second parameter_.

## Applying Routing

The `applyRouting` function takes a list of routes and will try to find the most specific route that matches. When it finds the best match, it calls the function and returns its value to your code.

In most cases, the return value will be a renderable component. However, it can be whatever you want it to be - a function, a string, etc.

If no match was found, `applyRouting` will return `null`, making it trivial to display fallback content.

```js
// App.js
import { applyRouting } from './routing'
import { routes } from './routes'
import { NotFoundPage } from './pages'

const App = () => applyRouting(routes) || NotFoundPage()
```

### Nested Routing

You may "nest" routes. This allows you to have parent routes that partially match a URL, and child routes which route using relative paths.

When defining the routes in expanded array form, the `{ nest: true }` property defines the route as a nest. You may also end the route with an asterisk `*` in both expanded array and abbreviated object forms, but the `{ nest: true }` form is preferred.

```js
// App.js
import { applyRouting } from './routing'
import { HomePage, DocumentPage, NotFoundPage } from './pages'

const routes = [
  {
    path: '/',
    route: () => <HomePage />
  },
  {
    path: '/document/:documentId', // '/document/:documentId*' is the same as { nest: true }
    nest: true,
    route: ({ documentId }) => <DocumentPage documentId={documentId} />
  }
]

const App = () => applyRouting(routes) || <NotFoundPage />
```

The `/document/:documentId` route is a _**nest**_.

It will match URLs that begin with that path and have more path components. Defining it as a nest allows paths like `/document/123/download` and `/document/123/edit` to match where it would fail to match otherwise.

Continuing this example, consider a `<DocumentPage />` component that looked something like this:

```js
// DocumentPage.js
import { applyRouting } from './routing'
import { DocumentViewer, DocumentDownload, DocumentEditor } from './components'

const childRoutes = [
    {
        path: '/download',
        route: () => (documentId) => <DocumentDownload documentId={documentId} />
    },
    {
        path: '/edit',
        route: () => (documentId) => <DocumentEditor documentId={documentId} />
    }
]

const DocumentPage = ({ documentId }) => {
    const renderComponent = applyRouting(childRoutes) || () => <DocumentViewer documentId={documentId} />
    return renderComponent(documentId)
}
```

Two child paths, `/download`, and `/edit` are defined that route to `<DocumentDownload />` and `<DocumentEditor />` respectively.

However, they don't route to the components _directly_. They route to a function which takes the `documentId` as a parameter and return the component.

Since the return value of `applyRouting` is a function, it isn't returned directly. The function gets assigned to the `renderComponent` variable and we call it, passing `documentId` as its argument.

Note that the fallback component `<DocumentViewer />` is also wrapped in a function, but it is slightly different from the routes. Unlike the routes that are defined outside the component, `documentId` is defined as an argument to `DocumentPage`, so it doesn't need the `documentId` parameter. It ignores the argument, but will receive the same value as either of the routes would.

One might be tempted to move the definition of the `childRoutes` within the component definition, but this would mean that it would get re-defined each time `DocumentPage` is called.
