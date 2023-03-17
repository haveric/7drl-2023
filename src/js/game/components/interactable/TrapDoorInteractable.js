import _Interactable from "../../../engine/component/components/interactable/_Interactable";
import engine from "../../Engine";
import Arg from "../../../engine/component/_arg/Arg";

export default class TrapDoorInteractable extends _Interactable {
    constructor(args = {}) {
        super(args, "trapDoorInteractable");

        this.map = this.addArg(new Arg("map", null));
        this.x = this.addArg(new Arg("x", null));
        this.y = this.addArg(new Arg("y", null));
        this.generator = this.addArg(new Arg("generator", null));
    }

    setPosition(x, y) {
        this.x.set(x);
        this.y.set(y);
    }

    setMap(map) {
        this.map.set(map);
    }

    setGenerator(generator) {
        this.generator.set(generator);
    }

    interact(/*entityInteracted*/) {
        if (this.map.get()) {
            // const entity = this.parentEntity;
            // const position = entity.getComponent("position");
            // position.x = this.x;
            // position.y = this.y;
            //
            // if (engine.isPlayer(entityInteracted)) {
            //     engine.eventHandler = new StairsSelectEventHandler(engine.eventHandler);
            //     engine.eventHandler.render((this.x * 64 * sceneState.scale) + 100, this.y * 64 * sceneState.scale);
            // } else {
            //     //
            // }
        } else if (this.generator.get()) {
            const args = {};
            if (engine.playerMap.level) {
                args.level = engine.playerMap.level;
            }
            const newMap = engine.mapLoader.loadMap(this.generator.get(), args);
            newMap.create();
            newMap.explored = true;

            engine.setShopMap(newMap, this);

            this.setMap(newMap.name);
            this.setGenerator(null);
        }
    }
}