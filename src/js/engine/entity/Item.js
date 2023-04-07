import _Entity from "./_Entity";
import Arg from "../arg/Arg";

export default class Item extends _Entity {
    constructor(json = {}) {
        json.type = "item";
        super(json);

        this.amount = this.addArg(new Arg("amount", 1));
        this.maxStackSize = this.addArg(new Arg("maxStackSize", 1));
    }

    clone() {
        return new Item(this.save());
    }

    setAmount(amount) {
        this.amount.set(amount);
    }
}