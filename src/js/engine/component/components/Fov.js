import _Component from "../_Component";
import Arg from "../_arg/Arg";

export default class Fov extends _Component {
    constructor(args) {
        super(args, "fov");

        this.explored = this.addArg(new Arg("explored", false));
        this.visible = this.addArg(new Arg("visible", false));
    }

    isExplored() {
        return this.explored.get();
    }

    setExplored(explored) {
        this.explored.set(explored);
    }

    isVisible() {
        return this.visible.get();
    }

    setVisible(visible) {
        this.visible.set(visible);
    }
}