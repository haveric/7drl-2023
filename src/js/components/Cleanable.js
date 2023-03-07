import _Component from "./_Component";

export default class Cleanable extends _Component {
    constructor(args = {}) {
        super(args, "cleanable");

        this.decreasesTo = "";
        this.increasesTo = "";

        if (this.hasComponent()) {
            this.decreasesTo = this.loadArg("decreasesTo", "");
            this.increasesTo = this.loadArg("increasesTo", "");
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            cleanable: {}
        };

        saveJson.cleanable.decreasesTo = this.decreasesTo;
        saveJson.cleanable.increasesTo = this.increasesTo;

        this.cachedSave = saveJson;
        return saveJson;
    }

    perform() {}
}