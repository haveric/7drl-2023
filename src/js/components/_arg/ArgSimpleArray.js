import Arg from "./Arg";

/**
 * Loads multiple values into an array, comma delimited
 *
 * Example: "component": "one, two"
 */
export default class ArgSimpleArray extends Arg {
    constructor(name, defaultValue) {
        super(name, defaultValue ?? []);
    }

    save(saveJson, type) {
        if (this._value) {
            saveJson[type][this._name] = this._value.toString();
        }
    }

    load(argJson) {
        const array = this._defaultValue;
        const items = argJson[this._name].split(",");
        for (const item of items) {
            array.push(item);
        }

        this._value = array;
    }
}