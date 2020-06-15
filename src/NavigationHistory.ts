import EventEmitter from 'events'

export class NavigationHistory {
  constructor(target, historyApi) {
    if (typeof target === 'undefined' || typeof target.id === 'undefined') {
      throw new Error('NavigationHistory requires the target.id as an argument')
    }

    this.initialize(target, historyApi)
  }

  initialize(target, historyApi) {
    this.current = target
    this.targets = [this.current]
    this.historyApi = historyApi
    this.events = new EventEmitter()
  }

  replace(target) {
    this.current = target
    this.targets[this.targets.length - 1] = this.current
    if (this.historyApi) {
      this.historyApi.replaceState(target, '', target.id)
    }
    this.events.emit('replace', this.current)
    this.events.emit('navigation', this.current)
  }

  push(target) {
    this.current = target
    this.targets.push(this.current)
    if (this.historyApi) {
      this.historyApi.pushState(target, '', target.id)
    }
    this.events.emit('push', this.current)
    this.events.emit('navigation', this.current)
  }
}
