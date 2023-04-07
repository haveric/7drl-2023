import _Action from "../../../engine/actions/_Action";

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

    /**
     * @returns {_Action}
     */
    perform(gameMap) { // eslint-disable-line no-unused-vars
        const consumable = this.item.getComponent("consumable");
        if (consumable) {
            return consumable.activate(this, this.x, this.y);
        }
    }

    getTargetActor(gameMap) {
        return gameMap.getAliveActorAtLocation(this.x, this.y);
    }
}