# @nerdo/routing
A general purpose routing behavior for applications and components.

Examples in this documentation may use code that look like React, but that is strictly for demonstration/familiarity purposes.

@nerdo/routing is not limited to being used with React or any particular UI framework.

## Goals
* Test driven.
* Framework agnostic.
* Environment agnostic.

@nerdo/routing is heavily inspired by [React Hook Router](https://github.com/Paratron/hookrouter).

## Routing Scenarios

### URL Routing
The most common routing use case is URL routing and navigating via the web browser [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API).

@nerdo/routing exports a pre-configured `urlRouting` object for this scenario.

```js
// app/routing.js

import { urlRouting } from '@nerdo/routing'
export const routing = urlRouting
```

Sometimes URL routing needs configuration.

For example, you may be writing a re-usable component that needs routing, but it may be part of a larger application that already has URL routing in place. Your custom component's router needs to take over routing once it is loaded.

In this case, call the helper function `configuredUrlRouting()` and pass it an object with the `baseUrl` set...

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

When the `routing` function is called, it takes a list of routes and looks for the most specific match. When it finds it, `routing` calls the function associated with the route and returns its value.

Routes can be defined in abbreviated format (as an object) or in an expanded form (as an array).

In the abbreviated form, each object key is the route's URL path and each value is a function that returns what the path routes to (typically a component).

For example...

```js
// app/routes.js

import { HomePage } from './HomePage'
import { AboutPage } from './AboutPage'

export const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />
}
```

Here is the same thing in the expanded array form.

```js
// app/routes.js

import { HomePage } from './HomePage'
import { AboutPage } from './AboutPage'

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

Using the expanded array form, you can match the path using a regular expression or function.

The following a simple function matcher to route to the `HomePage` component and a regular expression to route both `/info` and `/about` to the `AboutPage` component and demonstrates a simple function matcher.

```js
// app/routes.js

import { HomePage } from './HomePage'
import { AboutPage } from './AboutPage'

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

import { AboutPage } from './AboutPage'

export const routes = {
    '/documents/:folder?find': ({ folder, find }, { page }) => <DocumentSearch folder={folder} query={find} page={page} />
}
```

The section `:folder` is a dynamic URL parameter that gets passed to the `route` function, so if the URL is `/documents/reports?query=fish`, the `folder` variable will have the captured value `reports` from the URL. It will also have captured `fish` as the `find` query parameter.

It's important to note that if the `find` parameter is not part of the URL (e.g. `/documents/reports`), this route will **NOT** match. Query parameters defined in the path are required.

All query string parameters (including required ones) are passed to the `route` function as its second parameter as an object. In the example, the `page` query string parameter is optional.

### Performing Routing

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

Consider an example where the task is to create a web-based video streaming application called FooTube and you've chosen to use @nerdo/routing.

Using the provided URL routing, you may end up with a set of routes that looks like this:

```js
// app/routes.js

import { useState, useContext, useEffect } from 'some-ui-lib'
import { HomePage } from './HomePage'
import { VideoPage } from './VideoPage'
import { CurrentUserContext } from './CurrentUserContext'

export const routes = {
    '/': () => HomePage(),
    '/video/:videoId': ({videoId}) => VideoPage({videoId}),
    '/video/:videoId/edit': ({videoId}) => {
        const user = useContext(CurrentUserContext)
        const [userCanEdit, setUserCanEdit] = useState(null)

        useEffect(async () => {
            setUserCanEdit(await user.canEditVideo(videoId))
        })

        if (userCanEdit === null) {
            return VideoPage({videoId, isLoading: true})
        } else if (userCanEdit) {
            return VideoPage({videoId, isEditing: true})
        }

        return VideoPage({videoId, isUnauthorized: true})
    }
}
```

This sets up three routes.

`/` routes to the `HomePage` component.

`/video/:videoId` is routed to the `VideoPage` component. It has a named URL parameter embedded, `videoId`. URL parameters
