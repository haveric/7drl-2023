import MathUtil from "../util/MathUtil";

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

    loadArgRandIntBetween(name) {
        const value = this.args.components[this.type][name];
        return this.parseRandIntBetween(value);
    }

    parseRandIntBetween(value) {
        if (typeof value === "string") {
            const split = value.trim().split("-");
            if (split.length > 1) {
                return MathUtil.randomInt(parseInt(split[0].trim()), parseInt(split[1].trim()));
            } else {
                return parseInt(split[0].trim());
            }
        } else {
            return value;
        }
    }
}