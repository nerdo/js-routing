import * as exports from './index'

describe('exports', () => {
  it('should export the expected code', () => {
    expect(exports.getExpandedRoutes).toBeDefined()
    expect(exports.getParentPath).toBeDefined()
    expect(exports.getPathRelativeTo).toBeDefined()
    expect(exports.getJoinedPath).toBeDefined()
    expect(exports.getPathParts).toBeDefined()
    expect(exports.getSelectedUrlRoute).toBeDefined()
    expect(exports.getUrlParamsFromRoute).toBeDefined()
    expect(exports.makeRouter).toBeDefined()
    expect(exports.makeUrlNavigationTarget).toBeDefined()
    expect(exports.makeUrlRouter).toBeDefined()
    expect(exports.NavigationHistory).toBeDefined()
    expect(exports.objectFromQueryString).toBeDefined()
    expect(exports.RoutingError).toBeDefined()
  })
})
