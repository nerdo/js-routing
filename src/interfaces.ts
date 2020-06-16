type RouteId = string

export interface AbbreviatedRoutes {
  [propName: string]: string
}

export interface RouteIdFunction {
  (): any
}

export interface RouteAction {
  (): any
}

export interface Route {
  id: RouteId | RouteIdFunction | RegExp
  action: RouteAction
}

export interface ExpandedRoutes {
  [index: number]: Route
}

export interface RouteParams {
  [propName: string]: any
}

export interface NavigationTarget {
  input?: string
  id: RouteId,
  params?: RouteParams
  state?: RouteParams
}

export interface HistoryApi {
  pushState(state: NavigationTarget, title: string, id?: RouteId)
  replaceState(state: NavigationTarget, title: string, id?: RouteId)
}
