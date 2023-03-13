import Arg from "./Arg";
import MathUtil from "../../util/MathUtil";

export default class ArgRandomBetween extends Arg {
    constructor(name, defaultValue) {
        super(name, defaultValue);
    }

    load(argJson) {
        this._value = this.parseRandIntBetween(argJson[this._name]);
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