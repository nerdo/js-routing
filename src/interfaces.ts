import { NavigationHistory } from './NavigationHistory'

export type RouteId = string
export type RouteActionResult = any
export interface AnyFunc {
  (): any
}

export interface AbbreviatedRoutes {
  [propName: string]: string
}

export interface RouteIdFunction {
  (): any
}

export interface RouteAction {
  (): RouteActionResult
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

export interface NavigationFunction {
  (id: RouteId, replace?: boolean, params?: RouteParams, state?: RouteParams): PromiseLike<void>
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
  getSelectedRoute: any;
  getParamsFromRoute: any;
  getParentId: any;
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
  makeNavigationTarget: any;
  getSelectedRoute: any;
  getParamsFromRoute: any;
  getParentId: any;
  baseId: RouteId
}

export interface MakeRouterFunction {
  (configuration: RouterConfiguration): Router
}
