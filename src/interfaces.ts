import { NavigationHistory } from './NavigationHistory'

export type RouteId = string

export type RouteActionResult = any

export interface AnyFunc {
  (): any
}

export interface RouteAction {
  (routeParams: Params, stateParams: Params): RouteActionResult
}

export interface AbbreviatedRoutes {
  [propName: string]: RouteAction
}

export interface RouteIdFunction {
  (): any
}

export interface GetParameters {
  (history: NavigationHistory, baseId: RouteId, matches: string[]): Params
}

export interface GetSelectedRoute {
  (routes: ExpandedRoutes, history: NavigationHistory, parentId?: RouteId): (Route|null)
}

export interface GetParentId {
  (selected: Route, history: NavigationHistory, currentBaseId: RouteId): RouteId
}

export interface GetParamsFromRoute {
  (route: Route, history: NavigationHistory, baseId: RouteId): Params
}

export interface Route {
  id: RouteId|RouteIdFunction|RegExp
  action: RouteAction
  isNest?: boolean
  getParameters?: GetParameters
  getParentId?: GetParentId
}

export interface ExpandedRoutes extends Array<Route> {
  [index: number]: Route
}

export interface Params {
  [propName: string]: any
}

export interface NavigationTarget {
  input?: string
  id: RouteId,
  params?: Params
  state?: Params
}

export interface HistoryApi {
  pushState(state: NavigationTarget, title: string, id?: RouteId)
  replaceState(state: NavigationTarget, title: string, id?: RouteId)
}

export interface NavigationFunction {
  (id: RouteId, replace?: boolean, params?: Params, state?: Params): PromiseLike<void>
}

export interface MakeNavigationTarget {
  (input: RouteId, baseId?: RouteId | undefined): NavigationTarget
}

export interface MakeRouterNavigationFunction {
  (Router): NavigationFunction
}

export interface Router {
  lastSelectedRoute: Route|undefined
  parentIds: RouteId[]
  currentBaseId: RouteId
  commits: AnyFunc[]
  history: NavigationHistory
  makeRouterNavigationFunction: MakeRouterNavigationFunction
  makeNavigationTarget: MakeNavigationTarget
  getSelectedRoute: GetSelectedRoute
  getParamsFromRoute: GetParamsFromRoute
  getParentId: GetParentId
  getInitialBaseId(): RouteId
  getCurrentBaseId(): RouteId
  getNestedBaseId(): RouteId
  applyRouting(
    routes: ExpandedRoutes,
    transaction?: ((actionResult: RouteActionResult) => RouteActionResult)|boolean
  ): RouteActionResult
  popParentIds(): void
  commitRouting(): void
  addNavigationInterceptor()
  navigate: NavigationFunction
}

export interface RouterConfiguration {
  history: NavigationHistory
  makeRouterNavigationFunction: MakeRouterNavigationFunction
  makeNavigationTarget: MakeNavigationTarget
  getSelectedRoute: GetSelectedRoute
  getParamsFromRoute: GetParamsFromRoute
  getParentId: GetParentId
  baseId: RouteId
}

export interface MakeRouterFunction {
  (configuration: RouterConfiguration): Router
}
