import _Component from "../../engine/component/_Component";
import Arg from "../../engine/component/_arg/Arg";

export default class Cleanable extends _Component {
    constructor(args = {}) {
        super(args, "cleanable");

        this.decreasesTo = this.addArg(new Arg("decreasesTo", ""));
        this.increasesTo = this.addArg(new Arg("increasesTo", ""));
    }

    perform() {}
}