import _AskUserEventHandler from "../_AskUserEventHandler";
import tradeList from "../../../ui/TradeList";
import controls from "../../../controls/Controls";

export default class _TradeListEventHandler extends _AskUserEventHandler {
    constructor(previousHandler, title) {
        super(previousHandler);

        this.title = title || "<missing title>";
    }

    render(x, y) {
        tradeList.setTitle(this.title);
        tradeList.open(x, y);
    }

    setOptions(leftItems, rightItems) {
        tradeList.setOptions(leftItems, rightItems);
    }

    handleInput() {
        super.handleInput();

        if (controls.testPressed("up")) {
            tradeList.moveActiveUp();
        } else if (controls.testPressed("down")) {
            tradeList.moveActiveDown();
        } else if (controls.testPressed("left") || controls.testPressed("right")) {
            tradeList.moveActiveLeftRight();
        } else if (controls.testPressed("confirm")) {
            this.selectIndex(tradeList.getLeftActiveIndex(), tradeList.getRightActiveIndex());
        }

        return null;
    }

    selectIndex(/*leftActiveIndex, rightActiveIndex*/) {
        // Do nothing for base _TradeListEventHandler
    }

    exit() {
        tradeList.close();
        super.exit();
    }
}