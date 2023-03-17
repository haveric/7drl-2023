import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../../../engine/actions/UnableToPerformAction";

export default class MovementAction extends ActionWithDirection {
    constructor(entity, dx = 0, dy = 0) {
        super(entity, dx, dy);
    }

    perform(gameMap) {
        const position = this.entity.getComponent("position");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const destX = position.x.get() + this.dx;
        const destY = position.y.get() + this.dy;

        if (!gameMap.isInBounds(destX, destY)) {
            return new UnableToPerformAction(this.entity, "Location is outside the map!");
        }

        const tileAction = this.tryMoveTo(gameMap, destX, destY);
        if (!(tileAction instanceof UnableToPerformAction)) {
            position.move(this.dx, this.dy);
        }

        return tileAction;
    }

    tryMoveTo(gameMap, destX, destY) {
        const blockingActor = gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new UnableToPerformAction(this.entity, "There's something in the way!");
        }

        const tile = gameMap.tiles[destX][destY];
        if (tile) {
            if (tile.getComponent("blocksMovement")?.blocksMovement.get()) {
                return new UnableToPerformAction(this.entity, "There's a " + tile.name + " in the way!");
            }
        }

        return this;
    }
}