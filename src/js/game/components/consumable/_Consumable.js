import _Component from "../../../engine/component/_Component";
import ItemAction from "../../actions/itemAction/ItemAction";

export default class _Consumable extends _Component {
    constructor(json = {}, type) {
        super(json, "consumable", type);
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