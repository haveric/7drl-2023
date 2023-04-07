import _Interactable from "../../../engine/component/components/interactable/_Interactable";
import engine from "../../Engine";
import LootableEventHandler from "../../event/askUserEventHandler/tradeListEventHandler/LootableEventHandler";
import WaitAction from "../../../engine/actions/WaitAction";
import inventory from "../../ui/Inventory";
import Arg from "../../../engine/arg/Arg";
import ArgEntityLoader from "../../../engine/arg/ArgEntityLoader";
import sceneState from "../../../engine/SceneState";

export default class LootableInteractable extends _Interactable {
    constructor(json = {}) {
        super(json, "lootableInteractable");

        this.isLooted = this.addArg(new Arg("isLooted", true));
        this.isOpen = this.addArg(new Arg("isOpen", true));
        this.capacity = this.addArg(new Arg("capacity", 1));
        this.openSprite = this.addArg(new Arg("openSprite", ""));
        this.closedSprite = this.addArg(new Arg("closedSprite", ""));
        this.items = this.addArg(new ArgEntityLoader("items"));
    }

    interact(entityInteracted/*, gameMap*/) {
        if (engine.isPlayer(entityInteracted)) {
            engine.eventHandler = new LootableEventHandler(function() {
                return new WaitAction();
            }, engine.eventHandler, "Viewing " + this.parentEntity.name + "'s Contents", entityInteracted, this);

            const entityPosition = entityInteracted.getComponent("position");
            engine.eventHandler.render((entityPosition.x.get() * 64 * sceneState.scale) + 100, entityPosition.y.get() * 64 * sceneState.scale);
        } else if (this.parentEntity.id === "hero") {
            //
        }
    }


    addItem(itemToAdd) {
        if (!itemToAdd) {
            return false;
        }
        let success = false;

        const items = this.items.get();
        for (let i = 0; i < items.length; i++) {
            const item = items[i]?.item;
            if (item) {
                success = this.addPartialStacks(itemToAdd);
                if (success) {
                    break;
                }
            }
        }

        if (!success) {
            success = this.addFullStacks(itemToAdd);
        }

        return success;
    }

    addFullStacks(item) {
        this.clearSaveCache();

        const items = this.items.get();
        // Add full stack
        if (this.capacity.get() === -1) {
            items.push(item);
            item.parentEntity = this;
        } else {
            for (let i = 0; i < this.capacity.get(); i++) {
                if (!items[i]) {
                    items[i] = item;
                    item.parentEntity = this;
                    return true;
                }
            }
        }

        return false;
    }

    addPartialStacks(item) {
        if (item.amount <= 0) {
            return false;
        }
        this.clearSaveCache();

        const originalAmount = item.amount;
        let amountToAdd = item.amount;

        const items = this.items.get();
        let partialMax;
        if (this.capacity.get() === -1) {
            partialMax = items.length;
        } else {
            partialMax = this.capacity.get();
        }
        // Add partial stack
        for (let i = 0; i < partialMax; i++) {
            const inventoryItem = items[i];
            if (inventoryItem) {
                if (item.id === inventoryItem.id) {
                    const amountCanAdd = inventoryItem.maxStackSize - inventoryItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        inventoryItem.setAmount(inventoryItem.amount + amountToAdd);
                        return true;
                    } else {
                        inventoryItem.setAmount(inventoryItem.amount + amountCanAdd);
                        item.setAmount(item.amount - amountCanAdd);
                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        return originalAmount !== amountToAdd;
    }

    use(item, amount) {
        item.setAmount(item.amount - amount);
        if (item.amount <= 0) {
            this.remove(item);
        }

        this.clearSaveCache();
    }

    removeByIndex(index) {
        if (index > -1) {
            this.items.get().splice(index, 1, null);
        }

        this.clearSaveCache();
        engine.needsMapUpdate = true;
    }

    remove(item) {
        const index = this.items.get().indexOf(item);
        this.removeByIndex(index);
    }

    getItem(index) {
        return this.items.get()[index];
    }

    setItem(index, item) {
        this.items.get()[index] = item;
        this.clearSaveCache();
    }

    move(fromIndex, toIndex) {
        const items = this.items.get();
        if (fromIndex !== toIndex) {
            const fromItem = items[fromIndex];

            items[fromIndex] = items[toIndex];
            items[toIndex] = fromItem;

            this.clearSaveCache();
            if (engine.isPlayer(this.parentEntity)) {
                inventory.populateInventory(engine.player);
            }
        }
    }

    drop(/*item*/) {
        // if (item) {
        //     let parent = this.parentEntity;
        //     while (parent.type !== "actor") {
        //         parent = parent.parentEntity;
        //     }
        //     const parentPosition = parent.getComponent("position");
        //     engine.gameMap.addItem(item, parentPosition);
        //
        //     if (parent === engine.player) {
        //         messageManager.text("You dropped the " + item.name).build();
        //     }
        //
        //     this.remove(item);
        //     this.clearSaveCache();
        //     if (parent === engine.player) {
        //         inventory.populateInventory(engine.player);
        //     }
        // }
    }
}