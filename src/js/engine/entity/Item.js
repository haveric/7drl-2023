import _Entity from "./_Entity";

export default class Item extends _Entity {
    constructor(json = {}) {
        json.type = "item";
        super(json);

        this.amount = this.loadArg("amount", 1);
        this.maxStackSize = this.loadArg("maxStackSize", 1);
    }

    save() {
        const saveJson = super.save();

        if (this.amount !== 1) {
            saveJson.amount = this.amount;
        }

        if (this.maxStackSize !== 1) {
            saveJson.maxStackSize = this.maxStackSize;
        }

        return saveJson;
    }

    clone() {
        return new Item(this.save());
    }


    setAmount(amount) {
        this.amount = amount;
        this.clearSaveCache();
    }
}