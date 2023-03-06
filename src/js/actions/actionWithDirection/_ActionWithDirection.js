import _Action from "../_Action";

export default class ActionWithDirection extends _Action {
    constructor(entity, dx = 0, dy = 0) {
        super(entity);

        this.dx = dx;
        this.dy = dy;
    }

    perform() {
        console.error("Not Implemented");
    }
}