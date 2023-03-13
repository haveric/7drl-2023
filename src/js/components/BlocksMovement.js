import _Component from "./_Component";
import ArgSingularBool from "./_arg/ArgSingularBool";

export default class BlocksMovement extends _Component {
    constructor(args = {}) {
        super(args, "blocksMovement");

        // Whether the entity prevents movement
        this.blocksMovement = this.addArg(new ArgSingularBool("blocksMovement", false));
    }

    onEntityDeath() {
        this.blocksMovement.set(false);
    }
}