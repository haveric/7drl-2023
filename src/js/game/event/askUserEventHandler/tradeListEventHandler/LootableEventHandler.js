import _TradeListEventHandler from "./_TradeListEventHandler";
import tradeList from "../../../ui/TradeList";

export default class LootableEventHandler extends _TradeListEventHandler {
    constructor(callback, previousHandler, title, entityInteracted, lootableInteractable) {
        super(previousHandler, title);

        this.callback = callback;
        this.entityInteracted = entityInteracted;
        this.lootableInteractable = lootableInteractable;

        this.updateTradeOptions();
    }

    updateTradeOptions() {
        const playerInventory = this.entityInteracted.getComponent("inventory");
        const playerInventoryWithEmpties = [];
        const playerItems = playerInventory.items.get();
        for (const item of playerItems) {
            playerInventoryWithEmpties.push(item);
        }
        while (playerInventoryWithEmpties.length < playerInventory.capacity.get()) {
            playerInventoryWithEmpties.push(null);
        }

        const lootableItemsWithEmpties = [];
        const lootableItems = this.lootableInteractable.items.get();
        for (const item of lootableItems) {
            lootableItemsWithEmpties.push(item);
        }
        while(lootableItemsWithEmpties.length < this.lootableInteractable.capacity.get()) {
            lootableItemsWithEmpties.push(null);
        }

        tradeList.setOptions(playerInventoryWithEmpties, lootableItemsWithEmpties);
    }

    selectIndex(leftActiveIndex, rightActiveIndex) {
        const entityInventory = this.entityInteracted.getComponent("inventory");

        if (leftActiveIndex > -1) {
            const itemToMove = entityInventory.getItem(leftActiveIndex);
            if (this.lootableInteractable.addItem(itemToMove)) {
                entityInventory.removeByIndex(leftActiveIndex);
            }

            this.updateTradeOptions();
        } else if (rightActiveIndex > -1) {
            const itemToMove = this.lootableInteractable.getItem(rightActiveIndex);
            if (entityInventory.addItem(itemToMove)) {
                this.lootableInteractable.removeByIndex(rightActiveIndex);
            }

            this.updateTradeOptions();
        }
    }
}