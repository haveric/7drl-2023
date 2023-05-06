import ActionWithDirection from "./_ActionWithDirection";
import UnableToPerformAction from "../../../engine/actions/UnableToPerformAction";
import engine from "../../Engine";
import messageManager from "../../../engine/message/MessageManager";

export default class MeleeAction extends ActionWithDirection {
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
            const entityFighter = this.entity.getComponent("fighter");
            const blockingFighter = blockingActor.getComponent("fighter");
            if (entityFighter && blockingFighter) {
                let name;
                let plural;
                if (engine.isPlayer(this.entity)) {
                    name = "You";
                    plural = "";
                } else {
                    name = this.entity.name.get();
                    plural = "s";
                }

                let blockingName;
                let attackColor;
                if (blockingActor === engine.player) {
                    blockingName = "You";
                    attackColor = "#C00";
                } else {
                    blockingName = blockingActor.name;
                    attackColor = "#999";
                }

                const description = name + " attack" + plural + " " + blockingName;

                const damage = entityFighter.getDamage() - blockingFighter.getBlockedDamage();
                if (damage > 0) {
                    messageManager.text(description + " for " + damage + " hit points.", attackColor).build();
                    blockingFighter.takeDamage(damage);
                } else {
                    messageManager.text(description + ", but does no damage.", attackColor).build();
                }

                this.entity.callEvent("onMeleeAttack", blockingActor);
            }
        } else {
            return new UnableToPerformAction(this.entity, "There's nothing to attack there!");
        }
    }
}