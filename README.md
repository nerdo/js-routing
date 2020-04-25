> TODO There seems to be no way to capture URL parameters using the regex or function matchers. Come up with a simple way to accomplish this.

# @nerdo/routing
A general purpose routing behavior for applications and components.

Code samples here look like React code, but @nerdo/routing is _not_ limited to being used with React.

Since React is the industry standard JavaScript UI library at the time of this writing, the choice to use samples that look like it is strictly _for the sake of familiarity_.

## Table of Contents

* [Goals](#goals)
* [Routing Scenarios](#routing-scenarios)
  * [URL Routing](#url-routing)
  * [State Routing](#state-routing)
  * [Custom Routing](#custom-routing)
* [Defining Routes](#defining-routes)
  * [Abbreviated (Object) Form](#abbreviated-object-form)
  * [Expanded (Array) Form](#expanded-array-form)
* [Applying Routing](#applying-routing)
  * [Nested Routing](#nested-routing)
  * [Passing Additional Data to Routes](#passing-additional-data-to-routes)
* [Navigation](#navigation)
  * [Interceptors](#interceptors)

## Goals
* Test driven.
* Framework agnostic.
* Environment agnostic.

@nerdo/routing is heavily inspired by [React Hook Router](https://github.com/Paratron/hookrouter), but aspires to abstract routing behavior beyond React and the web browser.

## Routing Scenarios

**URL Routing** is the most common routing use case, but it is not the only kind of routing that can take place with @nerdo/routing.

> Aside from this section, this guide uses **URL Routing** to explain @nerdo/routing concepts. For details on how other scenarios differ, please refer to [the full API documentation](#full-api-documentation).

### URL Routing
URL routing and navigation take place in the web browser using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API).

@nerdo/routing exports a pre-configured `urlRouting` object for this scenario.

```js
// routing.js
import { urlRouting } from '@nerdo/routing'
export default urlRouting
```

Sometimes, URL routing needs configuration.

For example, the component you are writing could be a re-usable component that is substantial enough to have its own routing, but might be used in a larger application that already has URL routing in place. Your custom component's router needs to respect the base URL that it is loaded on.

By default, the base URL will be set to the current URL, but if that needs to be changed, you can call the helper function `configuredUrlRouting(...)` and pass it an object with `baseUrl` set.

```js
// routing.js
import { configuredUrlRouting } from  '@nerdo/routing'
export default configuredUrlRouting({ baseUrl: '/foo/bar' })
```

### State Routing

Another routing  use case might be a desktop application which navigates using states instead of URLs.

@nerdo/routing exports a pre-configured `stateRouting` object for scenarios like this.

```js
// routing.js
import { stateRouting } from '@nerdo/routing'
export default stateRouting
```

### Custom Routing

@nerdo/routing navigates via the [History API interface](https://developer.mozilla.org/en-US/docs/Web/API/History), but it does not presume that it will run in the a browser. Routing can be configured with whatever scheme one dreams up.

To set up custom writing, call `makeRouting(...)` and pass it an object with the properties:
* `navigator` - an object that implements the [History API interface](https://developer.mozilla.org/en-US/docs/Web/API/History).
* `getSelectedRoute(navigatorState, routes)` - a function that takes a navigator state and route definitions as arguments. It should return the definition that matches the navigator state or null if no match was found.

```js
// routing.js
import { makeRouting } from '@nerdo/routing'
import { navigator, getSelectedRoute } from './dreamScheme'
export default makeRouting({ navigator, getSelectedRoute })
```

## Defining Routes

When routing is applied, the `applyRouting(...)` function takes a list of routes and looks for the most specific URL match. `applyRouting(...)` then calls the route function associated with the matched URL and returns its value.

### Abbreviated (Object) Form

Routes can be defined in abbreviated format as an object, or in an expanded form as an array.

In the abbreviated form, each object key is the route's URL path identifier, and each value is the route function. The route function returns what the path identifier routes to.

Typically, the route function will return a renderable component, but you can return anything you need: a string, a number, an object, a function, etc.

> Returning functions is especially useful when dealing with [Nested Routing](#nested-routing) or [Passing Additional Data to Routes](#passing-additional-data-to-routes).

Here is a simple example routing the `/` path identifier to the `<HomePage />` component, and the `/about` path identifier to the `<AboutPage />` component.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />
}
```

### Expanded (Array) Form

In expanded array form, each item in the array is an object. Each object defines the path identifier using the `id` key and the route using the `route` key.

Here are the same routes as above in expanded array form:

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        id: '/',
        route: () => <HomePage />
    },
    {
        id: '/about',
        route: () => <AboutPage />
    }
]
```

The abbreviated form is more concise, but limited. The expanded array form allows for matching the path identifer using a regular expression or a function.

The following demonstrates a simple function matcher routing the path identifier `/` to the `<HomePage />` component, and a regular expression routing both `/info` and `/about` path identifiers to the `<AboutPage />` component.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        id: () => p => p === '/',
        route: () => <HomePage />
    },
    [
        id: /^\/(?:info|about)/,
        route: () => <AboutPage />
    ]
]
```

Routes can also define required path parameters and/or query string parmaters.

Here's an example with both:

```js
// routes.js
import { DocumentSearchPage } from './pages'
export const routes = [
    {
        id: '/documents/:folder?find',
        route: ({ folder, find }, { page }) => <DocumentSearchPage folder={folder} query={find} page={page} />
    }
]
```

The `:` in the path identifier starts the definition of a named dynamic parameter.

In this case, `:folder` is a dynamic parameter. It gets passed to the `route(...)` function as the `folder` property of its first argument. In other words, if the URL is `/documents/reports?query=summary`, the `folder` variable will capture the value "reports" from the URL. It will also have captured `summary` as the `find` query parameter.

It's important to note that if the `find` parameter is not part of the URL (e.g. `/documents/reports`), this route will **NOT** match.

**Query parameters defined in the path identifier are REQUIRED**.

To use an optional query string parameter, simply use it as a property on the 2nd route argument.

In the example, the query string parameter `page` is an optional parameter. _All_ query string parameters (including required ones) are passed to the `route(...)` function's second argument as object properties.

## Applying Routing

The `applyRouting(...)` function takes a list of routes and will try to find the most specific route that matches. When it finds the best match, it calls the function and returns its value to your code.

If no match was found, `applyRouting(...)` will return `null`, making it trivial to display fallback content.

```js
// App.js
import { applyRouting } from './routing'
import { routes } from './routes'
import { NotFoundPage } from './pages'

const App = () => applyRouting(routes) || <NotFoundPage />
```

### Nested Routing

You may "nest" routes. This allows you to have parent routes that partially match a URL, and child routes which route to path identifiers relative to the parent or "nest" path identifier.

When defining routes in abbreviated form, end the identifier with an asterisks (`*`) to mark it as a nest.

```js
// App.js
import { applyRouting } from './routing'
import { HomePage, ProductPage, NotFoundPage } from './pages'

const routes = {
    '/': () => <HomePage />,
    '/product/:productSlug*': ({ productSlug }) => <ProductPage productSlug={productSlug} />
]

const App = () => applyRouting(routes) || <NotFoundPage />
```

When defining the routes in expanded array form, the `{ nest: true }` property defines the route as a nest.

Here's the same thing as above in expanded form:

```js
// App.js
import { applyRouting } from './routing'
import { HomePage, ProductPage, NotFoundPage } from './pages'

const routes = [
  {
    id: '/',
    route: () => <HomePage />
  },
  {
    id: '/product/:productSlug',
    nest: true,
    route: ({ productSlug }) => <ProductPage productSlug={productSlug} />
  }
]

const App = () => applyRouting(routes) || <NotFoundPage />
```

The `/product/:productSlug` route is a _**nest**_.

It will match URLs that begin with that path identifier and those that have more path components. Defining it as a nest allows paths like `/product/super-sponge/details` and `/product/super-sponge/buy` to match.

Continuing this example, consider a `<ProductPage />` component that looked something like this:

```js
// ProductPage.js
import { applyRouting } from './routing'
import { ProductDetails, ProductPurchase, ProductSummary } from './components'

const childRoutes = [
    {
        id: '/details',
        route: () => (productSlug) => <ProductDetails productSlug={productSlug} />
    },
    {
        id: '/buy',
        route: () => (productSlug) => <ProductPurchase productSlug={productSlug} />
    }
]

const ProductPage = ({ productSlug }) => {
    const renderComponent = applyRouting(childRoutes) || () => <ProductSummary productSlug={productSlug} />
    return renderComponent(productSlug)
}
```

Two child path identifers, `/details`, and `/buy` route to `<ProductDetails />` and `<ProductPurchase />` respectively.

However, they don't route _directly_ to the components. They route to functions which takes the `productSlug` as an argument and return the component.

Since the return value of `applyRouting(...)` is a function, it must be called with the `productSlug` argument to "unwrap" and return the component.

The fallback component, `<ProductSummary />`, is wrapped in a function, but it is slightly different from those defined in ithe `childRoutes` object. The fallback route is defined inside of the `<ProductPage />` component where it has access to its `productSlug` parameter, so it uses `productSlug` within its scope instead of using its argument.

> One might be tempted to move the definition of the `childRoutes` within `<ProductPage />`, but this would mean that `childRoutes` would get re-defined each time the `<ProductPage />` component renders. That would be inefficient and could lead to poor performance.

### Passing Additional Data to Routes

In the previous example, the `productSlug` was passed to child components. This would presumably be used to look up and load the product information, but since all of the components seem to need that information, it would make more sense to load it in the `<ProductPage />` component and pass the `product` object to the components instead.

This can be accomplished in the same way as we are passing the `productSlug`. Instead of defining each route as a function of the `productSlug`, they can be defined as functions of the `product` object.

The refactored code might look something like this:

```js
// ProductPage.js
import { applyRouting } from './routing'
import { ProductDetails, ProductPurchase, ProductSummary, Loading } from './components'

const childRoutes = [
    {
        id: '/details',
        route: () => (product) => <ProductDetails product={product} />
    },
    {
        id: '/buy',
        route: () => (product) => <ProductPurchase product={product} />
    }
]

const ProductPage = ({ productSlug }) => {
    const [product, isLoadingProduct] = useProduct(productSlug)

    if (isLoadingProduct) {
        return <Loading />
    }

    const renderComponent = applyRouting(childRoutes) || () => <ProductSummary product={product} />
    return renderComponent(product)
}
```

## Navigation

Once routes have been set up, the `navigate()` function can be used to send users to them.

The function has the signature `navigate(id, [replace], [params])`.

  * `id` - The absolute or relative identifier to navigate to.
  * `[replace]` - Optional: A boolean which will replace the current state in navigation history if set to `true`; it defaults to `false`.
  * `[params]` - Optional: An object of parameters to pass to the route. They will be encoded as query string params in URL routing; it defaults to `{}`.

For example, if this is the `<HomePage />` component, the following would navigate to the `<AboutPage />` component when the button is clicked:

```js
// HomePage.js
import { applyRouting, navigate } from './routing'
import { AboutPage } from './pages'

const routes = [
    {
        id: '/about',
        route: () => <AboutPage />
    }
]

const HomePage = () => {
    return applyRouting(routes) || <button onClick={() => navigate('/about')}>About</button>
}
```

### Interceptors

There are times where it is necessary to listen for navigation events and manipulate it to perform various tasks.

A simple use case for an interceptor is redirection. For example, a path identifier which used to route to a page may no longer exist, and you want to redirect users who have the old link to a new location.

You can use the `addInterceptor()` function to accomplish this. The `addInterceptor()` function takes a callback function as its argument, and returns a function which will remove the interceptor when called.

The callback function will receive two arguments - `from` and `to`. These are `NavigationTarget` objects which represent the current and next or target routes respectively.

`NavigationTarget` objects have the following properties:

  * `id` - The identifier that the object represents. This could be absolute or relative.
  * `[replace]` - Optional: Whether the target replaces the state in history; defaults to `false`.
  * `[relativeTo]` - Present if `id` is relative: The identifier that `id` is relative to. This will always be absolute.
  * `[params]` - Optional: An object with parameters for the route; defaults to `{}`.

It should return the path or a `NavigationTarget` object that the router should navigate to, or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will resolve to either.

Here's what a simple redirection interceptor might look like:

```js
// redirectInterceptor.js
import { addInterceptor } from './routing'

export const removeRedirectInterceptor = addInterceptor((from, to) => {
    if (to.id === '/old-path-identifier') {
        return '/new-path-identifier'
    }
    return to
})
```

You could have a more generic redirection interceptor that defines several redirects that looks like this:

```js
// redirectInterceptor.js
import { addInterceptor } from './routing'

// redirects could be defined in another file and imported here...
const redirects = {
    '/old-path-identifier': '/new-path-identifier',
    '/info': '/about',
    '/foo': {
        id: '/bar',
        params: {
            q: 'hello'
        }
    }
}

export const removeRedirectInterceptor = addInterceptor((from, to) => redirects[from.id] || to
```
