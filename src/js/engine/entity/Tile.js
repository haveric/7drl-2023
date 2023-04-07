import _Entity from "./_Entity";

export default class Tile extends _Entity {
    constructor(json = {}) {
        json.type = "tile";
        super(json);
    }

    clone() {
        return new Tile(this.save());
    }

    isWall() {
        return this.getComponent("blocksMovement")?.blocksMovement.get();
    }
}