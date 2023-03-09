import _Action from "./_Action";

export default class NoAction extends _Action {
    constructor(entity) {
        super(entity);
    }

    perform(/*gameMap*/) {
        return this;
    }
}