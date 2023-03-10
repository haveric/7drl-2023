import _Component from "../_Component";

export default class _Interactable extends _Component {
    constructor(args = {}, type) {
        super(args, "interactable", type);
    }

    save() {
        return super.save();
    }

    interact() {}
}