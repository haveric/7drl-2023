import ArgRandomBetween from "./ArgRandomBetween";

export default class ArgMinMaxRandomBetween extends ArgRandomBetween {
    constructor(name, defaultValue) {
        super(name, defaultValue);

        this.min = this._defaultValue;
        this.max = this._defaultValue;
    }

    save(saveJson, type) {
        if (this.min === this.max) {
            if (this.min !== this._defaultValue) {
                saveJson[type] = this.min;
            }
        } else {
            saveJson[type] = this.min + "," + this.max;
        }
    }

    load(argJson) {
        const item = argJson[this._name];
        if (item) {
            if (typeof item === "string") {
                const split = item.split(",");
                this.min = this.parseRandIntBetween(split[0]);

                if (split.length > 1) {
                    this.max = this.parseRandIntBetween(split[1]);
                } else {
                    this.max = this.min;
                }
            } else {
                this.min = item;
                this.max = this.min;
            }
        }

        this.min = this.min ?? this._defaultValue;
        this.max = this.max ?? this.min;
    }
}