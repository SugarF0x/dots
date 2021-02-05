module.exports = function (moduleOptions) {
  if (this.options.dev || this.options._start) {
    this.addServerMiddleware('~/api')
  }
}
