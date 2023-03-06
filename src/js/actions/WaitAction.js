import _Action from "./_Action";

export default class WaitAction extends _Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        return this;
    }
}