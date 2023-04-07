import _Component from "../../_Component";

export default class _AI extends _Component {
    constructor(json = {}, type) {
        super(json, "ai", type);
    }

    save() {
        return super.save();
    }

    perform(gameMap) { // eslint-disable-line no-unused-vars
        console.error("Not Implemented");
    }
}