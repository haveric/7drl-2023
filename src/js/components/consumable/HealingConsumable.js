import _Consumable from "./_Consumable";
import UnableToPerformAction from "../../actions/UnableToPerformAction";
import messageManager from "../../message/MessageManager";

export default class HealingConsumable extends _Consumable {
    constructor(args = {}) {
        super(args, "healingConsumable");

        this.amount = 0;

        if (this.hasComponent()) {
            this.loadArg("amount", 0);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "healingConsumable": {
                amount: this.amount
            }
        };

        this.cachedSave = saveJson;
        return saveJson;
    }

    /**
     *
     * @param {ItemAction} action
     */
    activate(action) {
        const consumer = action.entity;
        const fighter = consumer.getComponent("fighter");
        if (fighter) {
            const amountHealed = fighter.heal(this.amount);

            if (amountHealed > 0) {
                this.consume();
                if (this.isPlayer()) {
                    messageManager.text("You consume the " + this.parentEntity.name + ", and recover " + amountHealed + " HP!").build();
                }
                return this;
            } else {
                return new UnableToPerformAction(action.entity, "Your health is already full");
            }
        }
    }

    getDescription() {
        return "<span class='item__details-line'>Recovers <span style='color: #c00;'>" + this.amount + "</span> health</span>";
    }
}