import { NavigationHistory } from './NavigationHistory'

export type RouteId = string

export type RouteActionResult = any

export interface AnyFunction {
  (): any
}

export interface RouteAction {
  (routeParams: Params, stateParams: Params): RouteActionResult
}

export interface AbbreviatedRoutes {
  [propName: string]: RouteAction
}

export interface RouteIdFunction {
  (id): any
}

export interface GetParameters {
  (history: NavigationHistory, baseId: RouteId, matches: string[]): Params
}

export interface GetSelectedRoute {
  (routes: ExpandedRoutes, relativeToId: RouteId, currentParams: Params, parentId?: RouteId): (Route | null)
}

export interface GetParentId {
  (selected: Route, history: NavigationHistory, currentBaseId: RouteId): RouteId
}

export interface GetParamsFromRoute {
  (route: Route, history: NavigationHistory, baseId: RouteId): Params
}

export interface Route {
  id: RouteId | RouteIdFunction | RegExp
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

export interface RouteTransaction {
  (actionResult: RouteActionResult): RouteActionResult
}

export interface ApplyRouting {
  (routes: ExpandedRoutes | AbbreviatedRoutes, transaction?: RouteTransaction | boolean): RouteActionResult
}

export interface GetRouteId {
  (): RouteId
}

export interface AddNavigationInterceptor {
  (): any
}

export interface PopStateHandler {
  (event: PopStateEvent): any
}

export interface RouterDestructFunction {
  (): any
}

export interface Router {
  lastSelectedRoute: Route | undefined
  parentIds: RouteId[]
  currentBaseId: RouteId
  commits: AnyFunction[]
  history: NavigationHistory
  popStateHandler?: PopStateHandler
  makeRouterNavigationFunction: MakeRouterNavigationFunction
  makeNavigationTarget: MakeNavigationTarget
  getSelectedRoute: GetSelectedRoute
  getParamsFromRoute: GetParamsFromRoute
  getParentId: GetParentId
  applyRouting: ApplyRouting
  navigate: NavigationFunction
  getInitialBaseId: GetRouteId
  getCurrentBaseId: GetRouteId
  getNestedBaseId: GetRouteId
  popParentIds: AnyFunction
  commitRouting: AnyFunction
  addNavigationInterceptor: AddNavigationInterceptor
  destruct: RouterDestructFunction
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

export interface MakePopStateHandlerFunction {
  (router: Router): PopStateHandler
}

export interface MakeUrlRouterArgs {
  history?: (() => NavigationHistory) | NavigationHistory
  makeRouterNavigationFunction?: MakeRouterNavigationFunction
  makeNavigationTarget?: MakeNavigationTarget
  makePopStateHandler?: MakePopStateHandlerFunction
  getSelectedRoute?: GetSelectedRoute
  getParamsFromRoute?: GetParamsFromRoute
  getParentId?: GetParentId
  baseId?: RouteId
}

export interface MakeUrlRouterFunction {
  (configuration?: MakeUrlRouterArgs): Router
}
