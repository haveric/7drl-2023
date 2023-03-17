import _Action from "../../engine/actions/_Action";
import UnableToPerformAction from "../../engine/actions/UnableToPerformAction";
import NoAction from "../../engine/actions/NoAction";

export default class InteractAction extends _Action {
    constructor(entity) {
        super(entity);
    }

    perform(gameMap) {
        const position = this.entity.getComponent("position");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const tile = gameMap.tiles[position.x.get()][position.y.get()];
        if (tile) {
            const interactable = tile.getComponent("interactable");
            if (interactable) {
                interactable.interact(this.entity);
                return new NoAction(this.entity);
            }
        }

        return new UnableToPerformAction(this.entity, "There is nothing to interact with here.");
    }
}