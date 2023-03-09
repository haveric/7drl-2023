import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../UnableToPerformAction";
import entityLoader from "../../entity/EntityLoader";

export default class CleanAction extends ActionWithDirection {
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

        const cleanableActor = gameMap.getCleanableActorAtLocation(destX, destY);
        if (cleanableActor) {
            const cleanable = cleanableActor.getComponent("cleanable");
            if (cleanable) {
                const decreasesTo = cleanable.decreasesTo;
                if (decreasesTo) {
                    const cleanablePosition = cleanableActor.getComponent("position");

                    const changedEntity = entityLoader.createFromTemplate(decreasesTo, {components: {position: {x: cleanablePosition.x, y: cleanablePosition.y}}});
                    gameMap.addActor(changedEntity);
                }

                gameMap.removeActor(cleanableActor);
            }
        } else {
            return new UnableToPerformAction(this.entity, "There's nothing to clean there!");
        }
    }
}