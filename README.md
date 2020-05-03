# @nerdo/routing
A general purpose routing behavior for applications and components.

Code samples here look like React code, but @nerdo/routing is _not_ limited to being used with React.

Since React is the industry standard JavaScript UI library at the time of this writing, the choice to use samples that look like it is strictly _for the sake of familiarity_.

# Table of Contents

* [Goals](#goals)
* [Introduction](#introduction)
* [Routing Scenarios](#routing-scenarios)
  * [URL Routing](#url-routing)
  * [State Routing](#state-routing)
  * [Custom Routing](#custom-routing)
* [Defining Routes](#defining-routes)
  * [Abbreviated (Object) Form](#abbreviated-object-form)
  * [Expanded (Array) Form](#expanded-array-form)
* [Applying Routing](#applying-routing)
  * [Nested Routing](#nested-routing)
    * [Route Precedence](#route-precedence)
  * [Passing Additional Data to Routes](#passing-additional-data-to-routes)
* [Navigation](#navigation)
  * [Interceptors](#interceptors)
    * [NavigationTarget](#navigationtarget)

# Goals

* Reliability.
  * Test driven.
* Flexibility.
  * Framework agnostic.
  * Environment agnostic.

# Introduction

@nerdo/routing is heavily inspired by [React Hook Router](https://github.com/Paratron/hookrouter), but aspires to abstract routing behavior beyond React and the web browser.

In an effort to stay as agnostic as possible, some of the wording in the documentation may seem a little odd. Some of it may be accidental, but for the most part it is deliberate.

The most notable so-called oddity is the choice to use the word **identifier** where others would simply say URL or path (or in the case of [State Routing](#state-routing), the state name).

@nerdo/routing views these all as *identifiers of the thing you wish to route to*.

If it helps to understand the documentation better, simply think "URL" or "path" whenever you see the term identifier or id.

That said, the documentation is written using the [URL Routing](#url-routing) use case to explain @nerdo/routing concepts. For details on how other scenarios differ, please refer to [the full API documentation](#full-api-documentation).

# Routing Scenarios

**URL Routing** is the most common routing use case, but it is not the only kind of routing that can take place with @nerdo/routing.

## URL Routing
The `makeUrlRouter(...)` function returns a router pre-configured for this scenario.

```js
// router.js
import { makeUrlRouter } from '@nerdo/routing'
export default makeUrlRouter()
```

`makeUrlRouter(...)` takes an object with configuration options. It may contain these properties:

* `basePath` - The base path to use when matching URL paths and navigating; defaults to the path of the URL at the time `makeUrlRouter(...)` is called.

```js
// router.js
import { makeUrlRouter } from  '@nerdo/routing'
export default makeUrlRouter({ basePath: '/foo/bar' })
```

## State Routing

Another routing use case might be a desktop application which navigates using states instead of URLs.

The `makeStateRouter(...)` function returns a pre-configured router for scenarios like this.

```js
// router.js
import { makeStateRouter } from '@nerdo/routing'
export default makeStateRouter()
```

## Custom Routing

To set up custom writing, call `makeRouter(...)` and pass it an object with the properties:

* `history` - An object that implements the [NavigationHistory](#navigation-history-interface), which **optionally** _interacts_ with the [History API interface](https://developer.mozilla.org/en-US/docs/Web/API/History).
* `makeNavigationTarget(input)` - A function that converts the `input` into a [NavigationTarget](#navigationtarget).
* `getSelectedRoute(navigatorState, routes)` - a function that takes a navigator state and route definitions as arguments. It should return the definition that matches the navigator state or null if no match was found.

```js
// router.js
import { makeRouter } from '@nerdo/routing'
import { history, makeNavigationTarget, getSelectedRoute } from './dreamScheme'
export default makeRouter({ history, makeNavigationTarget, getSelectedRoute })
```

# Defining Routes

When routing is applied, the `applyRouting(...)` function takes a list of routes and looks for the most specific URL match. `applyRouting(...)` then calls the `action(...)` function associated with the matched URL and returns its value.

## Abbreviated (Object) Form

Routes can be defined in abbreviated form as an object, or in an expanded form as an array.

In the abbreviated form, each object key is the route's identifier, and each value is the `action(...)` function. The `action(...)` function returns what the identifier routes to.

Typically, the `action(...)` function will return a renderable component, but you can return anything you need: a string, a number, an object, a function, etc.

> Returning functions is especially useful when dealing with [Nested Routing](#nested-routing) or [Passing Additional Data to Routes](#passing-additional-data-to-routes).

Here is a simple example routing the `/` identifier to the `<HomePage />` component, and the `/about` identifier to the `<AboutPage />` component.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />
}
```

Routes can also define required path parameters and/or query string parmaters.

Here's an example with both:

```js
// routes.js
import { DocumentSearchPage } from './pages'
export const routes = {
    '/documents/:folder?find': ({ folder, find }, { page }) => <DocumentSearchPage folder={folder} query={find} page={page} />
}
```

The `:` in the identifier starts the definition of a named dynamic parameter. The name of the parameter will include all characters until the following `/` or `?`.

In this case, `:folder` is a dynamic parameter. It gets passed to the `action(...)` function as the `folder` property of its first argument. In other words, if the URL is `/documents/reports?query=summary`, the `folder` variable will capture the value "reports" from the URL. It will also have captured `summary` as the `find` query parameter.

It's important to note that if the `find` parameter is not part of the URL (e.g. `/documents/reports`), this route will **NOT** match.

**Query parameters defined in the identifier are REQUIRED**.

To use an optional query string parameter, simply use it as a property on the 2nd `action(...)` argument.

In the example, the query string parameter `page` is an optional parameter. _All_ query string parameters (including required ones) are passed to the `action(...)` function's second argument as object properties.

Abbreviated object form is convenient and concise, but it is intended for the simplest of use cases.

Defining routes using the expanded array form opens up the full @nerdo/routing feature set to your application.

## Expanded (Array) Form

In expanded array form, each route definition is an object in the array. Each object defines the identifier using the `id` key and the `action(...)` function using the `action` key.

Here are simple home and about page routes in expanded array form:

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        id: '/',
        action: () => <HomePage />
    },
    {
        id: '/about',
        action: () => <AboutPage />
    }
]
```

The example above doesn't seem to offer any advantage over the abbreviated form, but it allows for more advanced route definitions that can use regular expressions and functions to match the identifier.

The following demonstrates a simple function matcher routing the identifier `/` to the `<HomePage />` component, and a regular expression routing both `/info` and `/about` identifiers to the `<AboutPage />` component.

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        id: (id) => id === '/',
        action: () => <HomePage />
    },
    [
        id: /^\/(?:info|about)$/,
        action: () => <AboutPage />
    ]
]
```

> ![Note!](assets/OOjs_UI_icon_alert-warning.svg) Matching routes with a function or regular expression introduces the dilemma of [Route Precedence](#route-precedence). Review the explanation of what route precedence is and how @nerdo/routing handles it for a clear understanding of how routing will work.

When matching identifiers this way, you may also provide a `getParameters(...)` function to parse dynamic parameters. If `id` is a regular expression, `getParameters(...)` will receive the identifier it matched on as the first argument, and an array of capture groups from the regular expression as the second argument. If `id` is a function, the second argument will be an empty array.

The function is free to parse the navigation state in any way, but it must return an object containing a map of the dynamic parameters.

Here's a more complex example demonstrating `getParameters(...)`:

```js
// routes.js
import { HomePage, AboutPage } from './pages'
export const routes = [
    {
        id: (id) => id === '/' || id === '/home',
        getParameters: (id) => ({ actualPath: id }),
        action: () => <HomePage />
    },
    {
        id: /^\/(?:info|about)(\/?.*)$/,
        getParameters: (id, captureGroups) => ({ subPath: captureGroups[0] }),
        action: () => <AboutPage />
    }
]
```

The first route matches the identifiers `/` and `/home`. Its `getParameters(...)` function sets the dynamic parameter named `actualPath` to the URL it matched on.

The second route matches identifiers starting with `/info` and `/about` which contain one more path component and it captures that path component. Its `getParameters(...)` function sets the dynamic parameter named `subPath` to the captured path component.

`getParameters(...)` can also be defined if the identifier is a string. In this scenario, the default dynamic parameter parsing rules are not used and your implementation of `getParameters(...)` is entirely responsible for parsing them out of the navigation state.

# Applying Routing

The `applyRouting(...)` function takes a list of routes and will try to find the most specific route that matches. When it finds the best match, it calls the function and returns its value to your code.

If no match was found, `applyRouting(...)` will return `null`, making it trivial to display fallback content.

```js
// App.js
import { applyRouting } from './router'
import { routes } from './routes'
import { NotFoundPage } from './pages'

const App = () => applyRouting(routes) || <NotFoundPage />
```

## Nested Routing

You may "nest" routes. This allows you to have parent routes that partially match an idenntifier, and child routes which route relative to the parent or "nest" identifier.

Nests must be defined using expanded array form by adding the `{ isNest: true }` property.

Here's an example.

```js
// App.js
import { applyRouting } from './router'
import { HomePage, ProductPage, NotFoundPage } from './pages'

const routes = [
  {
    id: '/',
    action: () => <HomePage />
  },
  {
    id: '/product/:productSlug',
    isNest: true,
    action: ({ productSlug }) => <ProductPage productSlug={productSlug} />
  }
]

const App = () => applyRouting(routes) || <NotFoundPage />
```

The `/product/:productSlug` route is a **nest**.

It will match URLs that begin with that identifier **and those that have more path components**. Defining it as a nest allows `/product/super-sponge/details` and `/product/super-sponge/buy` and the like to match.

Continuing this example, consider a `<ProductPage />` component that looked something like this:

```js
// ProductPage.js
import { applyRouting } from './router'
import { ProductDetails, ProductPurchase, ProductSummary } from './components'

const childRoutes = [
    {
        id: '/details',
        action: () => (productSlug) => <ProductDetails productSlug={productSlug} />
    },
    {
        id: '/buy',
        action: () => (productSlug) => <ProductPurchase productSlug={productSlug} />
    }
]

const ProductPage = ({ productSlug }) => {
    const renderComponent = applyRouting(childRoutes) || () => <ProductSummary productSlug={productSlug} />
    return renderComponent(productSlug)
}
```

Two child identifers, `/details`, and `/buy` route to `<ProductDetails />` and `<ProductPurchase />` respectively.

However, they don't route _directly_ to the components. They route to functions which takes the `productSlug` as an argument and return the component.

Since the return value of `applyRouting(...)` is a function, it must be called with the `productSlug` argument to "unwrap" and return the component.

The fallback component, `<ProductSummary />`, is wrapped in a function, but it is slightly different from those defined in ithe `childRoutes` object. The fallback route is defined inside of the `<ProductPage />` component where it has access to its `productSlug` parameter, so it uses `productSlug` within its scope instead of using its argument.

> One might be tempted to move the definition of the `childRoutes` within `<ProductPage />`, but this would mean that `childRoutes` would get re-defined each time the `<ProductPage />` component renders. That would be inefficient and could lead to poor performance.

### Route Precedence

The concept of nested routes (along with regular expression and function matching routes) raises an important question: what happens when multiple routes are a valid match?

The answer is simple: route definitions are evaluated in the order they are defined and **the first match takes precedence**.

This makes behavior deterministic and fixing any mismatches is trivial.

Consider this example.

```js
// RoutePrecedence.js
import { applyRouting } from './router'
import { HomePage, ProductPage, SpecialProductPage, NotFoundPage } from './pages'

const routes = [
  {
    id: '/',
    action: () => <HomePage />
  },
  {
    id: '/product/:productSlug',
    isNest: true,
    action: ({ productSlug }) => <ProductPage productSlug={productSlug} />
  },
  {
    id: '/product/special-product',
    action: () => <SpecialProductPage />
  }
]

const App = () => applyRouting(routes) || <NotFoundPage />
]
```

The route identified by `/product/special-product` is unreachable. The nest `/product/:productSlug` will always match when the identifier is `/product/special-product` because it precedes `/product/:productSlug` in the array.

To fix this, move the definition for `/product/special-product` before the definition for `/product/:productSlug`.

## Passing Additional Data to Routes

In the [Nested Routing](#nested-routing) example, the `productSlug` was passed to child components. This would presumably be used to look up and load the product information, but since all of the components seem to need that information, it would make more sense to load it in the `<ProductPage />` component and pass the `product` object to the components instead.

This can be accomplished in the same way as we are passing the `productSlug`. Instead of defining each route as a function of the `productSlug`, they can be defined as functions of the `product` object.

The refactored code might look something like this:

```js
// ProductPage.js
import { applyRouting } from './router'
import { ProductDetails, ProductPurchase, ProductSummary, Loading } from './components'

const childRoutes = [
    {
        id: '/details',
        action: () => (product) => <ProductDetails product={product} />
    },
    {
        id: '/buy',
        action: () => (product) => <ProductPurchase product={product} />
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

# Navigation

Once routes have been set up, the `navigate()` function can be used to send users to them.

The function has the signature `navigate(id, [replace], [params], [state])`.

  * `id` - The absolute or relative identifier to navigate to.
  * `[replace]` - Optional: A boolean which will replace the current state in navigation history if set to `true`; it defaults to `false`.
  * `[params]` - Optional: An object of parameters to pass to the `action(...)`. These parameters are intended to be publicly visible (e.g. query string params); it defaults to `{}`.
  * `[state]` - Optional: An object of state to pass to the `action(...)`. These parameters are intended to be **hidden** and not immediately visible to the user. `state` can end up in history, but should not be exposed to the user in an obvious place like the query string; it defaults to `{}`.

For example, if this is the `<HomePage />` component, the following would navigate to the `<AboutPage />` component when the button is clicked:

```js
// HomePage.js
import { applyRouting, navigate } from './router'
import { AboutPage } from './pages'

const routes = [
    {
        id: '/about',
        action: () => <AboutPage />
    }
]

const HomePage = () => {
    return applyRouting(routes) || <button onClick={() => navigate('/about')}>About</button>
}
```

## Interceptors

There are times where it is necessary to listen for navigation events and manipulate it to perform various tasks.

A simple use case for an interceptor is redirection. For example, a URL which used to route to a page may no longer exist, and you want to redirect users who try to visit the old page to a new location.

You can use the `addInterceptor()` function to accomplish this. The `addInterceptor()` function takes a callback function as its argument, and returns a function which will remove the interceptor when called.

The callback function will receive two arguments - `from` and `to`. These are `NavigationTarget` objects which represent the current and next or target routes respectively.

### NavigationTarget

  * `id` - The identifier that the object represents. This could be absolute or relative.
  * `[params]` - Optional: An object with parameters for the `action(...)`; defaults to `{}`.
  * `[state]` - Optional: An object with state for the `action(...)`; defaults to `{}`.
  * `[replace]` - Optional: Whether the target replaces the state in history; defaults to `false`.
  * `[relativeTo]` - Present if `id` is relative: The identifier that `id` is relative to. This will always be absolute.

It should return the path or a `NavigationTarget` object that the router should navigate to, or a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that will resolve to either.

Here's what a simple redirection interceptor might look like:

```js
// redirectInterceptor.js
import { addInterceptor } from './router'

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
import { addInterceptor } from './router'

// redirects could be defined in another file and imported here...
const redirects = {
    '/old-path-identifier': '/new-path-identifier',
    '/info': '/about',
    '/foo': {
        id: '/bar',
        params: {
            q: 'hello'
        },
        state: {
            data: someObject
        }
    }
}

export const removeRedirectInterceptor = addInterceptor((from, to) => redirects[from.id] || to)
```
