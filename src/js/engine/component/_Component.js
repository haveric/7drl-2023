export default class _Component {
    constructor(rawArgs = {}, baseType, type) {
        this.rawArgs = rawArgs;
        this.args = [];
        this.baseType = baseType || "component";
        this.type = type || this.baseType;
        this.parentEntity = rawArgs.parentEntity;

        this.cachedSave = null;
    }

    clearSaveCache() {
        this.cachedSave = null;
        this.parentEntity?.clearSaveCache();
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {};
        saveJson[this.type] = {};

        for (const arg of this.args) {
            arg.save(saveJson, this.type);
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    hasComponent() {
        return this.rawArgs.components && this.rawArgs.components[this.type] !== undefined;
    }

    getComponent() {
        return this.rawArgs.components[this.type];
    }

    addArg(arg) {
        arg.setParentComponent(this);
        this.args.push(arg);

        if (this.hasComponent()) {
            arg.load(this.getComponent());
        }

        return arg;
    }
}