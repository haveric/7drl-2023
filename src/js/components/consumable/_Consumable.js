import _Component from "../_Component";
import ItemAction from "../../actions/itemAction/ItemAction";

export default class _Consumable extends _Component {
    constructor(args = {}, type) {
        super(args, "consumable", type);
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

    activate(action) { // eslint-disable-line no-unused-vars
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