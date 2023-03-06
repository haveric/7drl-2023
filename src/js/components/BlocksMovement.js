import _Component from "./_Component";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        super(args, "blocksMovement");

        // Whether the entity prevents movement
        this.blocksMovement = false;

        if (this.hasComponent()) {
            this.blocksMovement = this.loadBooleanOrObject("blocksMovement");
        }
    }

    save() {
        return this.saveBoolean(this.blocksMovement, false);
    }

    onEntityDeath() {
        this.blocksMovement = false;

        this.clearSaveCache();
    }
}