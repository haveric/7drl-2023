import _Action from "../../../engine/actions/_Action";

export default class ActionWithDirection extends _Action {
    constructor(entity, dx = 0, dy = 0) {
        super(entity);

        this.dx = dx;
        this.dy = dy;
    }

    perform(/*gameMap*/) {
        console.error("Not Implemented");
    }
}