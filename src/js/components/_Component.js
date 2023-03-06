import engine from "../Engine";

export default class _Component {
    constructor(args = {}, baseType, type) {
        this.args = args;
        this.baseType = baseType || "component";
        this.type = type || this.baseType;
        this.parentEntity = args.parentEntity;

        this.cachedSave = null;
    }

    clearSaveCache() {
        this.cachedSave = null;
        this.parentEntity?.clearSaveCache();
    }

    save() {
        return null;
    }

    hasComponent() {
        return this.args.components && this.args.components[this.type] !== undefined;
    }

    isPlayer() {
        return this.parentEntity === engine.player;
    }

    saveBoolean(arg, defaultValue) {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {};
        if (arg !== defaultValue) {
            saveJson[this.type] = arg;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    loadBooleanOrObject(name) {
        const type = typeof this.args.components[this.type];
        if (type === "boolean") {
            return this.args.components[this.type];
        } else if (type === "object") {
            return this.args.components[this.type][name];
        }
    }

    loadArg(name, defaultValue) {
        return this.args.components[this.type][name] || defaultValue;
    }

    loadArgArray(name) {
        const array = [];
        const items = this.args.components[this.type][name].split(",");
        for (const item of items) {
            array.push(item.trim());
        }

        return array;
    }
}