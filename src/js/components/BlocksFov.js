import _Component from "./_Component";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        super(args, "blocksFov");

        this.blocksFov = false;

        if (this.hasComponent()) {
            this.blocksFov = this.loadBooleanOrObject("blocksFov");
        }
    }

    save() {
        return this.saveBoolean(this.blocksFov, false);
    }

}