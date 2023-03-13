import _Component from "./_Component";
import ArgSingularBool from "./_arg/ArgSingularBool";

export default class BlocksFov extends _Component {
    constructor(args = {}) {
        super(args, "blocksFov");

        this.blocksFov = this.addArg(new ArgSingularBool("blocksFov", false));
    }
}