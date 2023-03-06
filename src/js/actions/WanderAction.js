import MovementAction from "./actionWithDirection/MovementAction";
import Action from "./_Action";
import WaitAction from "./WaitAction";
import MathUtil from "../util/MathUtil";

export default class WanderAction extends Action {
    constructor(entity) {
        super(entity);
    }

    perform() {
        const x = MathUtil.randomInt(-1, 1);
        const y = MathUtil.randomInt(-1, 1);

        if (x === 0 && y === 0) {
            return new WaitAction(this.entity).perform();
        } else {
            return new MovementAction(this.entity, x, y).perform();
        }
    }
}