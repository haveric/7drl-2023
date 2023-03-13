import _Component from "./_Component";
import Arg from "./_arg/Arg";

export default class Cleanable extends _Component {
    constructor(args = {}) {
        super(args, "cleanable");

        this.decreasesTo = this.addArg(new Arg("decreasesTo", ""));
        this.increasesTo = this.addArg(new Arg("increasesTo", ""));
    }

    perform() {}
}