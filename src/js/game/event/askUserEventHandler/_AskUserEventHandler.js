import _EventHandler from "../../../engine/eventHandler/_EventHandler";
import engine from "../../Engine";
import controls from "../../../engine/controls/Controls";

export default class _AskUserEventHandler extends _EventHandler {
    constructor(previousHandler) {
        super();

        this.previousHandler = previousHandler;
    }

    handleInput() {
        if (controls.testPressed("escape")) {
            this.exit();
        }

        return null;
    }

    onLeftClick() {
        this.exit();
    }

    exit() {
        engine.eventHandler = this.previousHandler;
    }
}