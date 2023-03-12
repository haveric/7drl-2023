import UnableToPerformAction from "../UnableToPerformAction";
import NoAction from "../NoAction";
import _ActionWithDirection from "./_ActionWithDirection";

export default class InteractAtAction extends _ActionWithDirection {
    constructor(entity, dx = 0, dy = 0) {
        super(entity, dx, dy);
    }

    perform(gameMap) {
        const position = this.entity.getComponent("position");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;

        const tile = gameMap.tiles[destX][destY];
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