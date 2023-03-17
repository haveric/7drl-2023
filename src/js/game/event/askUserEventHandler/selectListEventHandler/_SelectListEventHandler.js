import _AskUserEventHandler from "../_AskUserEventHandler";
import selectList from "../../../ui/SelectList";
import controls from "../../../../engine/controls/Controls";

export default class _SelectListEventHandler extends _AskUserEventHandler {
    constructor(previousHandler, title, options) {
        super(previousHandler);

        this.title = title || "<missing title>";
        this.options = options || [];
    }

    render(x, y) {
        selectList.setTitle(this.title);
        selectList.setOptions(this.options);
        selectList.open(x, y);
    }

    handleInput() {
        super.handleInput();

        if (controls.testPressed("up")) {
            selectList.moveActiveUp();
        } else if (controls.testPressed("down")) {
            selectList.moveActiveDown();
        } else if (controls.testPressed("confirm")) {
            this.selectIndex(selectList.getActiveIndex());
        }

        return null;
    }

    selectIndex(/*index*/) {
        // Do nothing for base _SelectListEventHandler
    }

    exit() {
        selectList.close();
        super.exit();
    }
}