* Allow navigate to force navigation or skip it if the target has not changed (default)
* ??? Listen to popstate event from NavigationHistory?? Not sure if necessary...
* Set up addNavigationInterceptor to call history.addNavigationInterceptor
* ??? Maybe move jest/* into @nerdo/js-utils and add it as a dev dependency?
* Feedback
  * Dennis
    * https://github.com/blikblum/slick-router
  * Adam
    * A way to "tag" where you want URLs to be relative to during navigation. For example, when in a nest, the `navigate` function acts relative to its nest. There is no way to make an exception to navigate relative to some other path. But if we have a `makeRouterNavigationFunction` function, it could capture the state at that point-in-time and that function can be used to navigate as if it were called when `makeRouterNavigationFunction` was called. This also solves the issue of creating a `Link` component. Each time `Link` gets rendered, it would basically call `makeRouterNavigationFunction` and call that function when clicked.
