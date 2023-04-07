export default class _Component {
    constructor(json = {}, baseType, type) {
        this.json = json;
        this.args = [];
        this.baseType = baseType || "component";
        this.type = type || this.baseType;
        this.parentEntity = json.parentEntity;

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
        return this.json.components && this.json.components[this.type] !== undefined;
    }

    getComponent() {
        return this.json.components[this.type];
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