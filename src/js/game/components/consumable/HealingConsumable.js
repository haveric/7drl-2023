import _Consumable from "./_Consumable";
import UnableToPerformAction from "../../../engine/actions/UnableToPerformAction";
import messageManager from "../../../engine/message/MessageManager";
import Arg from "../../../engine/arg/Arg";

export default class HealingConsumable extends _Consumable {
    constructor(json = {}) {
        super(json, "healingConsumable");

        this.amount = this.addArg(new Arg("amount", 0));
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;
        const fighter = consumer.getComponent("fighter");
        if (fighter) {
            const amountHealed = fighter.heal(this.amount.get());

            if (amountHealed > 0) {
                this.consume();
                if (this.isPlayer()) {
                    messageManager.text("You consume the " + this.parentEntity.name.get() + ", and recover " + amountHealed + " HP!").build();
                }
                return this;
            } else {
                return new UnableToPerformAction(action.entity, "Your health is already full");
            }
        }
    }

    getDescription() {
        return "<span class='item__details-line'>Recovers <span style='color: #c00;'>" + this.amount.get() + "</span> health</span>";
    }
}