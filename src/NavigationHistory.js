export class NavigationHistory {
  constructor(target, historyApi) {
    if (typeof target === 'undefined' || typeof target.id === 'undefined') {
      throw new Error('NavigationHistory requires the target.id as an argument')
    }

    this.initialize = this.initialize.bind(this)
    this.replace = this.replace.bind(this)
    this.push = this.push.bind(this)

    this.initialize(target, historyApi)
  }

  initialize(target, historyApi) {
    this.current = target
    this.targets = [this.current]
    this.historyApi = historyApi
  }

  replace(target) {
    this.current = target
    this.targets[this.targets.length - 1] = this.current
    if (this.historyApi) {
      this.historyApi.replaceState(target, '', target.id)
    }
  }

  push(target) {
    this.current = target
    this.targets.push(this.current)
    if (this.historyApi) {
      this.historyApi.pushState(target, '', target.id)
    }
  }
}
