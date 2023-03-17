import _Action from "./_Action";

export default class UnableToPerformAction extends _Action {
    constructor(entity, reason) {
        super(entity);

        this.reason = reason;
    }

    perform(gameMap) { // eslint-disable-line no-unused-vars
        return this;
    }
}