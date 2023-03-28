import _Interactable from "../../../engine/component/components/interactable/_Interactable";
import engine from "../../Engine";
import StairsSelectEventHandler from "../../event/askUserEventHandler/selectListEventHandler/StairsSelectEventHandler";
import WaitAction from "../../../engine/actions/WaitAction";
import BasicDungeon from "../../map/tiled/BasicDungeon";
import messageManager from "../../message/MessageManager";
import Arg from "../../../engine/component/_arg/Arg";
import sceneState from "../../../engine/SceneState";

export default class StairsInteractable extends _Interactable {
    constructor(args = {}) {
        super(args, "stairsInteractable");

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

    interact(entityInteracted, gameMap) {
        if (engine.isPlayer(entityInteracted)) {
            const playerLevel = gameMap.level;
            const nextLevel = engine.nextMap.level;
            const futureLevel = engine.futureMap.level;

            let createNextMap = false;
            let mapToUpdate;
            if (playerLevel < nextLevel) {
                mapToUpdate = engine.nextMap;
            } else if (playerLevel < futureLevel) {
                mapToUpdate = engine.futureMap;
                createNextMap = true;
            }

            if (mapToUpdate.explored) {
                mapToUpdate.explored = true;
                engine.needsRenderUpdate = true;
                mapToUpdate.addActor(engine.player);
                gameMap.removeActor(engine.player);
                engine.playerMap = mapToUpdate;
                const position = engine.player.getComponent("position");
                position.moveTo(5, 0);

                if (createNextMap) {
                    engine.setNextMap(engine.futureMap);
                    const futureMap = new BasicDungeon(11, 11, {level: futureLevel + 1});
                    engine.setFutureMap(futureMap);
                    futureMap.create();
                }
                return new WaitAction();
            } else {
                engine.eventHandler = new StairsSelectEventHandler(function(index) {
                    mapToUpdate.explored = true;
                    engine.needsRenderUpdate = true;

                    if (index === 0) {
                        return new WaitAction();
                    } else {
                        if (createNextMap) {
                            engine.setNextMap(engine.futureMap);
                            const futureMap = new BasicDungeon(11, 11, {level: futureLevel + 1});
                            engine.setFutureMap(futureMap);
                            futureMap.create();
                        }

                        mapToUpdate.addActor(engine.player);
                        gameMap.removeActor(engine.player);
                        engine.playerMap = mapToUpdate;
                        const position = engine.player.getComponent("position");
                        position.moveTo(5, 0);
                        return new WaitAction();
                    }
                }, engine.eventHandler);

                const entityPosition = entityInteracted.getComponent("position");
                engine.eventHandler.render((entityPosition.x.get() * 64 * sceneState.scale) + 100, entityPosition.y.get() * 64 * sceneState.scale);
            }
        } else {
            const nextLevel = gameMap.level + 1;
            const nextMapName = (this.generator.get() || this.map.get()) + "-" + nextLevel.toString();
            const nextMap = engine.getMap(nextMapName);
            if (!nextMap || nextLevel > engine.playerMap.level) {
                messageManager.text("The hero has gotten too far ahead.").build();
                // TODO: Game Over
            } else {
                gameMap.removeActor(entityInteracted);
                engine.heroMap = nextMap;
                nextMap.explored = true;
                engine.needsRenderUpdate = true;
                nextMap.addActor(entityInteracted);
                const entityPosition = entityInteracted.getComponent("position");
                entityPosition.moveTo(5, 0);

                if (nextMap === engine.nextMap) {
                    engine.nextMap = engine.futureMap;
                    const futureMap = new BasicDungeon(11, 11, {level: engine.futureMap.level + 1});
                    engine.setFutureMap(futureMap);
                    futureMap.create();
                }
            }
        }

        // if (this.map.get()) {
        //     // const entity = this.parentEntity;
        //     // const position = entity.getComponent("position");
        //     // position.moveTo(this.x.get(), this.y.get());
        //     //
        //     // if (engine.isPlayer(entityInteracted)) {
        //     //     engine.eventHandler = new StairsSelectEventHandler(engine.eventHandler);
        //     //     engine.eventHandler.render((this.x.get() * 64 * sceneState.scale) + 100, this.y.get() * 64 * sceneState.scale);
        //     // } else {
        //     //     //
        //     // }
        // } else if (this.generator.get()) {
        //     const args = {};
        //     if (engine.heroMap.level) {
        //         args.level = engine.heroMap.level + 1;
        //     }
        //     const newMap = engine.mapLoader.loadMap(this.generator.get(), args);
        //     newMap.create();
        //     newMap.explored = true;
        //
        //     engine.setNextMap(newMap, this);
        //
        //     this.setMap(newMap.name);
        //     this.setGenerator(null);
        // }
    }
}