export default class Arg {
    #parentComponent;
    _name;
    _defaultValue;
    _value;

    constructor(name, defaultValue) {
        this._name = name;
        this._defaultValue = defaultValue;
    }

    setParentComponent(component) {
        this.#parentComponent = component;
    }

    getParentComponent() {
        return this.#parentComponent;
    }

    save(saveJson, type) {
        if (this._value !== this._defaultValue) {
            saveJson[type][this._name] = this._value;
        }

        return saveJson;
    }

    load(argJson) {
        this._value = argJson[this._name] ?? this._defaultValue;
    }

    get() {
        return this._value;
    }

    set(value) {
        this._value = value;
        this.#parentComponent.clearSaveCache();
    }
}