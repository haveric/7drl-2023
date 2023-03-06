import _Entity from "./_Entity";

export default class Tile extends _Entity {
    constructor(args = {}) {
        args.type = "tile";
        super(args);
    }

    clone() {
        return new Tile(this.save());
    }

    save() {
        return super.save();
    }

    isWall() {
        return this.getComponent("blocksMovement")?.blocksMovement;
    }
}