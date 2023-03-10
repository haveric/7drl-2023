import _Interactable from "./_Interactable";
import engine from "../../Engine";
import StairsSelectEventHandler from "../../event/askUserEventHandler/selectListEventHandler/StairsSelectEventHandler";
import WaitAction from "../../actions/WaitAction";
import BasicDungeon from "../../map/tile/BasicDungeon";
import messageManager from "../../message/MessageManager";

export default class StairsInteractable extends _Interactable {
    constructor(args = {}) {
        super(args, "stairsInteractable");

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
            "stairsInteractable": {}
        };

        if (this.map) {
            saveJson.stairsInteractable.map = this.map;
        }

        if (this.x !== null) {
            saveJson.stairsInteractable.x = this.x;
        }

        if (this.y !== null) {
            saveJson.stairsInteractable.y = this.y;
        }

        if (this.generator !== null) {
            saveJson.stairsInteractable.generator = this.generator;
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

    interact(entityInteracted) {
        if (engine.isPlayer(entityInteracted)) {
            const playerLevel = engine.playerMap.level;
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
                engine.playerMap.removeActor(engine.player);
                engine.playerMap = mapToUpdate;
                const position = engine.player.getComponent("position");
                position.moveTo(5, 0);

                if (createNextMap) {
                    engine.setNextMap(engine.futureMap);
                    engine.setFutureMap(new BasicDungeon(11, 11, {level: futureLevel + 1}));
                    engine.futureMap.create();
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
                            engine.setFutureMap(new BasicDungeon(11, 11, {level: futureLevel + 1}));
                            engine.futureMap.create();
                        }

                        mapToUpdate.addActor(engine.player);
                        engine.playerMap.removeActor(engine.player);
                        engine.playerMap = mapToUpdate;
                        const position = engine.player.getComponent("position");
                        position.moveTo(5, 0);
                        return new WaitAction();
                    }
                }, engine.eventHandler);
                engine.eventHandler.render((this.x * 64 * engine.scale) + 100, this.y * 64 * engine.scale);
            }
        } else {
            const nextLevel = engine.heroMap.level + 1;
            const nextMapName = (this.generator || this.map) + "-" + nextLevel.toString();
            const nextMap = engine.getMap(nextMapName);
            if (!nextMap || nextLevel > engine.playerMap.level) {
                messageManager.text("The hero has gotten too far ahead.").build();
                // TODO: Game Over
            } else {
                engine.heroMap.removeActor(entityInteracted);
                engine.heroMap = nextMap;
                engine.heroMap.explored = true;
                engine.needsRenderUpdate = true;
                engine.heroMap.addActor(entityInteracted);
                const entityPosition = entityInteracted.getComponent("position");
                entityPosition.moveTo(5, 0);

                if (engine.heroMap === engine.nextMap) {
                    engine.nextMap = engine.futureMap;
                    engine.setFutureMap(new BasicDungeon(11, 11, {level: engine.futureMap.level + 1}));
                    engine.futureMap.create();
                }
            }
        }

        // if (this.map) {
        //     // const entity = this.parentEntity;
        //     // const position = entity.getComponent("position");
        //     // position.x = this.x;
        //     // position.y = this.y;
        //     //
        //     // if (engine.isPlayer(entityInteracted)) {
        //     //     engine.eventHandler = new StairsSelectEventHandler(engine.eventHandler);
        //     //     engine.eventHandler.render((this.x * 64 * engine.scale) + 100, this.y * 64 * engine.scale);
        //     // } else {
        //     //     //
        //     // }
        // } else if (this.generator) {
        //     const args = {};
        //     if (engine.heroMap.level) {
        //         args.level = engine.heroMap.level + 1;
        //     }
        //     const newMap = engine.mapLoader.loadMap(this.generator, args);
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