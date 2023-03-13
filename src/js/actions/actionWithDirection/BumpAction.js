import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../UnableToPerformAction";
import MovementAction from "./MovementAction";
import MeleeAction from "./MeleeAction";
import CleanAction from "./CleanAction";
import InteractAtAction from "./InteractAtAction";

export default class BumpAction extends ActionWithDirection {
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

        const blockingActor = gameMap.getBlockingActorAtLocation(destX, destY);
        if (blockingActor) {
            return new MeleeAction(this.entity, this.dx, this.dy).perform(gameMap);
        }

        const cleanableActor = gameMap.getCleanableActorAtLocation(destX, destY);
        if (cleanableActor) {
            return new CleanAction(this.entity, this.dx, this.dy).perform(gameMap);
        }

        const tileX = gameMap.tiles[destX];
        if (tileX) {
            const tileXY = tileX[destY];
            if (tileXY) {
                const interactable = tileXY.getComponent("interactable");
                if (interactable) {
                    if (interactable.type !== "stairsInteractable" && interactable.type !== "trapDoorInteractable") {
                        return new InteractAtAction(this.entity, this.dx, this.dy).perform(gameMap);
                    }
                }
            }
            return new MovementAction(this.entity, this.dx, this.dy).perform(gameMap);
        } else {
            return new UnableToPerformAction(this.entity, "Nowhere to move.");
        }
    }
}