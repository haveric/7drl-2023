import _Component from "../_Component";
import ArgSingularBool from "../../arg/ArgSingularBool";

export default class BlocksMovement extends _Component {
    constructor(json = {}) {
        super(json, "blocksMovement");

        // Whether the entity prevents movement
        this.blocksMovement = this.addArg(new ArgSingularBool("blocksMovement", false));
    }

    onEntityDeath() {
        this.blocksMovement.set(false);
    }
}