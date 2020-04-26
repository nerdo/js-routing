export class NavigationHistory {
  constructor(target) {
    if (typeof target.id === 'undefined') {
      throw new Error('NavigationHistory requires the target.id as an argument')
    }

    this.initialize = this.initialize.bind(this)
    this.replace = this.replace.bind(this)
    this.push = this.push.bind(this)

    this.initialize(target)
  }

  initialize(target) {
    this.current = target
    this.targets = [this.current]
  }

  replace(target) {
    this.current = target
    this.targets[this.targets.length - 1] = this.current
  }

  push(target) {
    this.current = target
    this.targets.push(this.current)
  }
}
