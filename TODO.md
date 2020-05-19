* Update NavigationHistory to take an object that implements the History API
* Pass in window.history by default in makeUrlRouter
* ??? Listen to popstate event from NavigationHistory?? Not sure if necessary...
* Set up addNavigationInterceptor to call history.addNavigationInterceptor
* ??? Maybe move jest/* into @nerdo/js-utils and add it as a dev dependency?
