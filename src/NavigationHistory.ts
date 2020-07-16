import { NavigationTarget, HistoryApi } from './interfaces'
import { EventEmitter } from 'events'

export class NavigationHistory {
  public current: NavigationTarget
  public targets: NavigationTarget[]
  public historyApi: HistoryApi
  public events: any

  constructor(target: NavigationTarget, historyApi: HistoryApi = void 0) {
    if (typeof target === 'undefined' || typeof target.id === 'undefined') {
      throw new Error('NavigationHistory requires the target.id as an argument')
    }

    this.initialize(target, historyApi)
  }

  initialize(target: NavigationTarget, historyApi: HistoryApi) {
    this.current = target
    this.targets = [this.current]
    this.historyApi = historyApi
    this.events = new EventEmitter()
  }

  replace(target: NavigationTarget) {
    this.current = target
    this.targets[this.targets.length - 1] = this.current
    if (this.historyApi) {
      this.historyApi.replaceState(target, '', target.id)
    }
    this.events.emit('replace', this.current)
    this.navigate(this.current)
  }

  push(target: NavigationTarget) {
    this.current = target
    this.targets.push(this.current)
    if (this.historyApi) {
      this.historyApi.pushState(target, '', target.id)
    }
    this.events.emit('push', this.current)
    this.navigate(this.current)
  }

  navigate(target: NavigationTarget) {
    this.events.emit('navigation', target)
  }
}
