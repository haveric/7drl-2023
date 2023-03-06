import _Action from "../_Action";
import engine from "../../Engine";

export default class ItemAction extends _Action {
    /**
     *
     * @param entity
     * @param item
     * @param x
     * @param y
     */
    constructor(entity, item, x, y) {
        super(entity);

        this.item = item;
        this.x = x;
        this.y = y;
    }

    perform() {
        const consumable = this.item.getComponent("consumable");
        if (consumable) {
            return consumable.activate(this, this.x, this.y);
        }
    }

    getTargetActor() {
        return engine.gameMap.getAliveActorAtLocation(this.x, this.y);
    }
}