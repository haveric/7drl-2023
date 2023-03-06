import _Component from "../_Component";
import ItemAction from "../../actions/itemAction/ItemAction";

export default class _Consumable extends _Component {
    constructor(args = {}) {
        super(args, "consumable");
    }

    save() {
        return super.save();
    }

    getConsumer() {
        let parent = this.parentEntity;
        while (parent && parent.type !== "actor") {
            parent = parent.parentEntity;
        }
        return parent;
    }

    getItem() {
        return this.parentEntity;
    }

    getAction() {
        return new ItemAction(this.getConsumer(), this.getItem());
    }

    activate() {
        console.error("Not Implemented");
    }

    consume() {
        const item = this.getItem();
        const parentStorage = item.parentEntity;
        if (parentStorage) {
            parentStorage.use(item, 1);
        }
    }
}