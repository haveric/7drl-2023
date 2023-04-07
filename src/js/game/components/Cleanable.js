import _Component from "../../engine/component/_Component";
import Arg from "../../engine/arg/Arg";

export default class Cleanable extends _Component {
    constructor(json = {}) {
        super(json, "cleanable");

        this.decreasesTo = this.addArg(new Arg("decreasesTo", ""));
        this.increasesTo = this.addArg(new Arg("increasesTo", ""));
    }

    perform() {}
}