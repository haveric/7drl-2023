export default class Arg {
    #parentComponentOrEntity;
    _name;
    _defaultValue;
    _value;

    constructor(name, defaultValue) {
        this._name = name;
        this._defaultValue = defaultValue;
    }

    setParentComponentOrEntity(component) {
        this.#parentComponentOrEntity = component;
    }

    getParentComponentOrEntity() {
        return this.#parentComponentOrEntity;
    }

    save(saveJson, type) {
        if (this._value !== this._defaultValue) {
            if (type === undefined) {
                saveJson[this._name] = this._value;
            } else {
                saveJson[type][this._name] = this._value;
            }
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
        this.#parentComponentOrEntity.clearSaveCache();
    }
}