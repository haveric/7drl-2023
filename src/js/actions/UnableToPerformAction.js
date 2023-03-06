import _Action from "./_Action";

export default class UnableToPerformAction extends _Action {
    constructor(entity, reason) {
        super(entity);

        this.reason = reason;
    }

    perform() {
        return this;
    }
}