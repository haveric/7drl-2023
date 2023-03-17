import Arg from "./Arg";

/**
 * Used when the component can contains a singular boolean,
 * so that it can be shortened to a boolean instead of an object
 *
 * Example: "component": true
 */
export default class ArgSingularBool extends Arg {
    constructor(name, defaultValue) {
        super(name, defaultValue);
    }

    save(saveJson, type) {
        if (this._value !== this._defaultValue) {
            saveJson[type] = this._value;
        }

        return saveJson;
    }

    load(argJson) {
        if (typeof argJson === "boolean") {
            this._value = argJson;
        } else if (typeof argJson === "object") {
            this._value = argJson[this._name];
        }

        this._value = this._value ?? this._defaultValue;
    }
}