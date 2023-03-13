import _Component from "../_Component";
import EquipmentType from "./EquipmentType";
import engine from "../../Engine";
import messageConsole from "../../ui/MessageConsole";
import inventory from "../../ui/Inventory";
import Arg from "../_arg/Arg";
import ArgEntityLoader from "../_arg/ArgEntityLoader";
import ArgRandomBetween from "../_arg/ArgRandomBetween";
import ArgMinMaxRandomBetween from "../_arg/ArgMinMaxRandomBetween";

export default class Equippable extends _Component {
    constructor(args = {}) {
        super(args, "equippable");

        this.slot = this.addArg(new Arg("slot", EquipmentType.MAIN_HAND));
        this.damage = this.addArg(new ArgMinMaxRandomBetween("damage", 0));
        this.defense = this.addArg(new ArgRandomBetween("defense", 0));
        this.health = this.addArg(new ArgRandomBetween("health", 0));

        this.maxStorage = this.addArg(new ArgRandomBetween("maxStorage", 0));
        this.storage = this.addArg(new ArgEntityLoader("storage"));
    }

    getDescription() {
        let description = "<span class='item__details-line'>Type: <span style='color: #fff;'>" + this.slot.get() + "</span></span>";

        if (this.damage.min !== 0 || this.damage.max !== 0) {
            description += "<span class='item__details-line'>Damage: <span style='color: #f00;'>";
            if (this.damage.min === this.damage.max) {
                description += this.damage.min;
            } else {
                description += this.damage.min + " - " + this.damage.max;
            }
            description += "</span></span>";
        }

        if (this.defense.get() !== 0) {
            description += "<span class='item__details-line'>Defense: <span style='color: #fff;'>" + this.defense.get() + "</span></span>";
        }

        if (this.health.get() !== 0) {
            description += "<span class='item__details-line'>Health: <span style='color: #fff;'>+" + this.health.get() + "</span></span>";
        }

        if (this.maxStorage.get() === -1) {
            description += "<span class='item__details-line'>Storage: <span style='color: #fff;'>Unlimited</span></span>";
        } else if (this.maxStorage.get() > 0) {
            description += "<span class='item__details-line'>Storage: <span style='color: #fff;'>" + this.maxStorage.get() + "</span></span>";
        }

        return description;
    }

    addFullStacks(item) {
        this.clearSaveCache();

        const items = this.storage.get();
        // Add full stack
        if (this.maxStorage.get() === -1) {
            items.push(item);
            item.parentEntity = this;
        } else {
            for (let i = 0; i < this.maxStorage.get(); i++) {
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

        const items = this.storage.get();
        let partialMax;
        if (this.maxStorage.get() === -1) {
            partialMax = items.length;
        } else {
            partialMax = this.maxStorage.get();
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
            this.storage.get().splice(index, 1, null);
        }

        this.clearSaveCache();
        engine.needsMapUpdate = true;
    }

    remove(item) {
        const index = this.storage.get().indexOf(item);
        this.removeByIndex(index);
    }

    getItem(index) {
        return this.storage.get()[index];
    }

    setItem(index, item) {
        this.storage.get()[index] = item;
        this.clearSaveCache();
    }

    move(fromIndex, toIndex) {
        const items = this.storage.get();
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

    drop(item) {
        if (item) {
            let parent = this.parentEntity;
            while (parent.type !== "actor") {
                parent = parent.parentEntity;
            }
            const parentPosition = parent.getComponent("position");
            engine.gameMap.addItem(item, parentPosition);

            if (parent === engine.player) {
                messageConsole.text("You dropped the " + item.name).build();
            }

            this.remove(item);
            this.clearSaveCache();
            if (parent === engine.player) {
                inventory.populateInventory(engine.player);
            }
        }
    }
}