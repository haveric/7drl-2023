import MovementAction from "./actionWithDirection/MovementAction";
import _Action from "../../engine/actions/_Action";
import WaitAction from "../../engine/actions/WaitAction";
import MathUtil from "../../engine/util/MathUtil";

export default class WanderAction extends _Action {
    constructor(entity) {
        super(entity);
    }

    perform(gameMap) {
        const x = MathUtil.randomInt(-1, 1);
        const y = MathUtil.randomInt(-1, 1);

        if (x === 0 && y === 0) {
            return new WaitAction(this.entity).perform(gameMap);
        } else {
            return new MovementAction(this.entity, x, y).perform(gameMap);
        }
    }
}