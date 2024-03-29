import _ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../../../engine/actions/UnableToPerformAction";
import entityLoader from "../../../engine/entity/EntityLoader";

export default class CleanAction extends _ActionWithDirection {
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

        const cleanableActor = gameMap.getCleanableActorAtLocation(destX, destY);
        if (cleanableActor) {
            const cleanable = cleanableActor.getComponent("cleanable");
            if (cleanable) {
                const decreasesTo = cleanable.decreasesTo.get();
                if (decreasesTo) {
                    const cleanablePosition = cleanableActor.getComponent("position");

                    const changedEntity = entityLoader.createFromTemplate(decreasesTo, {components: {position: {x: cleanablePosition.x.get(), y: cleanablePosition.y.get()}}});
                    gameMap.addActor(changedEntity);
                }

                gameMap.removeActor(cleanableActor);
            }
        } else {
            return new UnableToPerformAction(this.entity, "There's nothing to clean there!");
        }
    }
}