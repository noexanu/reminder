export default class Router {
  #STRATEGY;

  setStrategy(strategy) {
    this.#STRATEGY = strategy;
  }

  executeStrategy(ctx, session) {
    this.#STRATEGY.execute(ctx, session);
  }

  setAndExecute(strategy, ctx, session) {
    this.setStrategy(strategy);
    this.executeStrategy(ctx, session);
  }
}
