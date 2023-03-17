import _AI from "./_AI";
import Arg from "../../_arg/Arg";

export default class AIDead extends _AI {
    constructor(args = {}) {
        super(args, "aiDead");

        this.previousAI = this.addArg(new Arg("previousAI", ""));
    }

    perform(gameMap) { // eslint-disable-line no-unused-vars
        // Do nothing
    }
}