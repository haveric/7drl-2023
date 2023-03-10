import _Interactable from "./_Interactable";
import engine from "../../Engine";

export default class TrapDoorInteractable extends _Interactable {
    constructor(args = {}) {
        super(args, "trapDoorInteractable");

        this.map = null;
        this.x = null;
        this.y = null;
        this.generator = null;

        if (this.hasComponent()) {
            this.map = this.loadArg("map", null);
            this.x = this.loadArg("x", null);
            this.y = this.loadArg("y", null);
            this.generator = this.loadArg("generator", null);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            "trapDoorInteractable": {}
        };

        if (this.map) {
            saveJson.trapDoorInteractable.map = this.map;
        }

        if (this.x !== null) {
            saveJson.trapDoorInteractable.x = this.x;
        }

        if (this.y !== null) {
            saveJson.trapDoorInteractable.y = this.y;
        }

        if (this.generator !== null) {
            saveJson.trapDoorInteractable.generator = this.generator;
        }

        this.cachedSave = saveJson;

        return saveJson;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.clearSaveCache();
    }

    setMap(map) {
        this.map = map;
        this.clearSaveCache();
    }

    setGenerator(generator) {
        this.generator = generator;
        this.clearSaveCache();
    }

    interact(/*entityInteracted*/) {
        if (this.map) {
            // const entity = this.parentEntity;
            // const position = entity.getComponent("position");
            // position.x = this.x;
            // position.y = this.y;
            //
            // if (engine.isPlayer(entityInteracted)) {
            //     engine.eventHandler = new StairsSelectEventHandler(engine.eventHandler);
            //     engine.eventHandler.render((this.x * 64 * engine.scale) + 100, this.y * 64 * engine.scale);
            // } else {
            //     //
            // }
        } else if (this.generator) {
            const args = {};
            if (engine.playerMap.level) {
                args.level = engine.playerMap.level;
            }
            const newMap = engine.mapLoader.loadMap(this.generator, args);
            newMap.create();
            newMap.explored = true;

            engine.setShopMap(newMap, this);

            this.setMap(newMap.name);
            this.setGenerator(null);
        }
    }
}