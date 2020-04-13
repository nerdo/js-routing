# @nerdo/routing
A general purpose routing behavior for applications and components.

Code samples here look like React code, @nerdo/routing is _not_ limited to being used with React.

The choice to use samples that look like React code is strictly _for the sake of familiarity_ since React is the industry standard JavaScript UI library at the time of this writing.

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
// app/routing.js

import { urlRouting } from '@nerdo/routing'
export const routing = urlRouting
```

Sometimes URL routing needs configuration.

For example, you may be writing a re-usable component that needs routing, but it may be part of a larger application that already has URL routing in place. Your custom component's router needs to take over routing once it is loaded.

In cases like this, call the helper function `configuredUrlRouting()` and pass it an object with the `baseUrl` set...

```js
// app/routing.js

import { configuredUrlRouting } from  '@nerdo/routing'
export const routing = configuredUrlRouting({ baseUrl: '/foo/bar' })
```

### State Routing

Another routing  use case might be a desktop application which navigates using states instead of URLs.

For scenarios like this, @nerdo/routing exports a pre-configured `stateRouting` object.

```js
// app/routing.js

import { stateRouting } from '@nerdo/routing'
export const routing = stateRouting
```

### Custom Routing

@nerdo/routing navigates via the [History API _interface_](https://developer.mozilla.org/en-US/docs/Web/API/History), but it does not presume that it will run in the a browser. Routing can be configured with whatever scheme one dreams up.

To set up custom writing, provide a navigator object that _implements_ the [History API interface](https://developer.mozilla.org/en-US/docs/Web/API/History) and a selectedRoute function which takes a navigator state and route definitions and returns the definition that matches the navigator state.

```js
// app/routing.js

import { makeRouting } from '@nerdo/routing'
import { navigator, selectedRoute } from '/app/dreamScheme'
export const routing = makeRouting({ navigator, selectedRoute })
```

## Defining Routes

When the `routing` function is called, it takes a list of routes and looks for the most specific URL match. `routing` then calls the function associated with the matched URL and returns its value.

Routes can be defined in abbreviated format (as an object) or in an expanded form (as an array).

In the abbreviated form, each object key is the route's URL path, and each value is a function that returns what the path routes to (typically a component).

Here is a simple example routing the `/` path to the `HomePage` component, and `/about` to the `AboutPage` component.

```js
// app/routes.js

import { HomePage, AboutPage } from './pages'
export const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />
}
```

Here is the same thing in the expanded array form.

```js
// app/routes.js

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
// app/routes.js

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
// app/routes.js

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

The `routing` function takes a list of routes and will try to find the most specific route that matches. When it finds the best match, it calls the function and returns its value to your code.

In most cases, the return value will be a renderable component. However, it can be whatever you want it to be - a function, a string, etc.

If no match was found, `routing` will return `null`, making it trivial to display fallback content.

```js
// app/MyApp.js

import { routing } from './routing'
import { routes } from './routes'
import { NotFoundPage } from './NotFoundPage'

const MyApp = () => routing(routes) || NotFoundPage()
```
