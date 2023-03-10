import _SelectListEventHandler from "./_SelectListEventHandler";
import engine from "../../../Engine";

export default class StairsSelectEventHandler extends _SelectListEventHandler {
    constructor(callback, previousHandler) {
        const title = "Peek or go down stairs?";
        const options = [
            "Peek down",
            "Go down"
        ];

        super(previousHandler, title, options);
        this.callback = callback;
    }

    selectIndex(index) {
        engine.processAction(this.callback(index));
        this.exit();
    }
}