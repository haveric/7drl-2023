import _Component from "./_Component";
import engine from "../Engine";
import inventory from "../ui/Inventory";
import Arg from "./_arg/Arg";
import ArgEntityLoader from "./_arg/ArgEntityLoader";

export default class Inventory extends _Component {
    constructor(args = {}) {
        super(args, "inventory");

        this.capacity = this.addArg(new Arg("capacity", 3));
        this.items = this.addArg(new ArgEntityLoader("items"));
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