import _AI from "./_AI";
import Arg from "../../../arg/Arg";

export default class AIDead extends _AI {
    constructor(json = {}) {
        super(json, "aiDead");

        this.previousAI = this.addArg(new Arg("previousAI", ""));
    }

    perform(gameMap) { // eslint-disable-line no-unused-vars
        // Do nothing
    }
}