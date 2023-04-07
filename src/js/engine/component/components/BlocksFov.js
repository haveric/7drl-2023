import _Component from "../_Component";
import ArgSingularBool from "../../arg/ArgSingularBool";

export default class BlocksFov extends _Component {
    constructor(json = {}) {
        super(json, "blocksFov");

        this.blocksFov = this.addArg(new ArgSingularBool("blocksFov", false));
    }
}