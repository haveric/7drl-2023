import Arg from "./Arg";
import entityLoader from "../entity/EntityLoader";

export default class ArgEntityLoader extends Arg {
    constructor(name, defaultValue) {
        super(name, defaultValue ?? []);
    }

    save(saveJson, type) {
        const entityJson = [];
        if (this._value) {
            for (const entity of this._value) {
                if (entity) {
                    entityJson.push(JSON.stringify(entity.save()));
                }
            }
        }

        saveJson[type][this._name] = entityJson;
    }

    load(argJson) {
        const array = this._defaultValue;
        const entities = argJson[this._name];
        if (entities) {
            for (const entity of entities) {
                if (entity === null) {
                    array.push(entity);
                } else {
                    let newEntity;
                    if (entity.load) {
                        newEntity = entityLoader.createFromTemplate(entity.load, entity);
                    } else {
                        newEntity = entityLoader.create(entity);
                    }
                    newEntity.parentEntity = this.getParentComponentOrEntity();
                    array.push(newEntity);
                }
            }
        }

        this._value = array;
    }
}