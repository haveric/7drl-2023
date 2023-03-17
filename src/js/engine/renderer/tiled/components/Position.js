import _Component from "../../../component/_Component";
import Arg from "../../../component/_arg/Arg";

export default class Position extends _Component {
    constructor(args = {}) {
        super(args, "position");

        this.x = this.addArg(new Arg("x", 0));
        this.y = this.addArg(new Arg("y", 0));
    }

    moveTo(newX, newY) {
        this.x.set(newX);
        this.y.set(newY);
    }

    move(xOffset, yOffset) {
        this.x.set(this.x.get() + xOffset);
        this.y.set(this.y.get() + yOffset);
    }

    distanceTo(position) {
        const dx = Math.abs(position.x.get() - this.x.get());
        const dy = Math.abs(position.y.get() - this.y.get());

        return Math.max(dx, dy);
    }

    isAt(x, y) {
        return this.x.get() === x && this.y.get() === y;
    }

    isEqual(position) {
        return this.x.get() === position.x.get() && this.y.get() === position.y.get();
    }
}