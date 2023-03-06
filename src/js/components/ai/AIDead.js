import _AI from "./_AI";

export default class AIDead extends _AI {
    constructor(args = {}) {
        super(args, "aiDead");

        this.previousAI = "";

        if (this.hasComponent()) {
            this.previousAI = this.loadArg("previousAI", "");
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            aiDead: {}
        };

        saveJson.aiDead.previousAI = this.previousAI;

        this.cachedSave = saveJson;
        return saveJson;
    }

    perform() {}
}