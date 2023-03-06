import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../UnableToPerformAction";
import engine from "../../Engine";
import MovementAction from "./MovementAction";
import MeleeAction from "./MeleeAction";

export default class BumpAction extends ActionWithDirection {
    constructor(entity, dx = 0, dy = 0) {
        super(entity, dx, dy);
    }

    perform() {
        const position = this.entity.getComponent("position");
        if (!position) {
            return new UnableToPerformAction(this.entity, "Entity doesn't have a position.");
        }

        const destX = position.x + this.dx;
        const destY = position.y + this.dy;

        const blockingActor = engine.gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new MeleeAction(this.entity, this.dx, this.dy).perform();
        } else {
            const tileX = engine.gameMap.tiles[destX];
            if (tileX) {
                // const tileXY = tileX[destY];
                // if (tileXY) {
                //     // TODO: Open or other actions
                // }
                return new MovementAction(this.entity, this.dx, this.dy).perform();
            } else {
                return new UnableToPerformAction(this.entity, "Nowhere to move.");
            }
        }
    }
}