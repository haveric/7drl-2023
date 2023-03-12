import _Component from "./_Component";
import entityLoader from "../entity/EntityLoader";
import engine from "../Engine";
import inventory from "../ui/Inventory";

export default class Inventory extends _Component {
    constructor(args = {}) {
        super(args, "inventory");

        this.capacity = 3;
        this.items = [];

        if (this.hasComponent()) {
            this.capacity = this.loadArg("capacity", 3);

            const inventory = args.components.inventory;
            if (inventory.items !== undefined) {
                for (let i = 0; i < inventory.items.length; i++) {
                    const item = inventory.items[i];
                    if (item !== null) {
                        if (item.load !== undefined) {
                            this.items[i] = entityLoader.createFromTemplate(item.load, item);
                        } else {
                            this.items[i] = entityLoader.create(item);
                        }
                        this.items[i].parentEntity = this;
                    }
                }
            }
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            inventory: {}
        };

        if (this.capacity !== 3) {
            saveJson.inventory.capacity = this.capacity;
        }

        const itemJson = [];
        for (const item of this.items) {
            if (item) {
                itemJson.push(JSON.stringify(item.save()));
            }
        }

        saveJson.inventory.items = itemJson;

        this.cachedSave = saveJson;
        return saveJson;
    }

    addItem(itemToAdd) {
        if (!itemToAdd) {
            return false;
        }
        let success = false;

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i]?.item;
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
        console.log("Item: ", item);
        this.clearSaveCache();

        // Add full stack
        if (this.capacity === -1) {
            this.items.push(item);
            item.parentEntity = this;
        } else {
            for (let i = 0; i < this.capacity; i++) {
                if (!this.items[i]) {
                    this.items[i] = item;
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

        let partialMax;
        if (this.capacity === -1) {
            partialMax = this.items.length;
        } else {
            partialMax = this.capacity;
        }
        // Add partial stack
        for (let i = 0; i < partialMax; i++) {
            const inventoryItem = this.items[i];
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
            this.items.splice(index, 1, null);
        }

        this.clearSaveCache();
        engine.needsMapUpdate = true;
    }

    remove(item) {
        const index = this.items.indexOf(item);
        this.removeByIndex(index);
    }

    getItem(index) {
        return this.items[index];
    }

    setItem(index, item) {
        this.items[index] = item;
        this.clearSaveCache();
    }

    move(fromIndex, toIndex) {
        if (fromIndex !== toIndex) {
            const fromItem = this.items[fromIndex];

            this.items[fromIndex] = this.items[toIndex];
            this.items[toIndex] = fromItem;

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