import NoAction from "../engine/actions/NoAction";
import UnableToPerformAction from "../engine/actions/UnableToPerformAction";
import messageManager from "../engine/message/MessageManager";
import viewInfo from "./ui/ViewInfo";
import textureManager from "../engine/sprite/TextureManager";
import spriteManager from "../engine/sprite/SpriteManager";
import placeholderTexture from "../../img/placeholder.gif";
import playerTexture from "../../img/player.gif";
import scribbleTexture from "../../img/kenney/scribble.png";
import scribbleJson from "../../img/kenney/scribble.json";
import websTexture from "../../img/electronsandsuch/webs.png";
import websJson from "../../img/electronsandsuch/webs.json";
import rlTilesTexture from "../../img/rltiles/rltiles-2d-2x.png";
import rltilesJson from "../../img/rltiles/rltiles-2d-2x.json";
import mapTexture from "../../img/cron/parchment_square.png";
import MapLoader from "./map/MapLoader";
//import GameMap from "./map/tiled/GameMap";

class Engine {
    constructor() {
        this.eventHandler = null;
        this.player = null;
        //this.gameMap = null;

        this.gameMaps = new Map();
        this.playerMap = null;

        this.heroMap = null;
        this.nextMap = null;
        this.futureMap = null;
        this.shopMap = null;
        this.needsRenderUpdate = false;

        this.mapLoader = new MapLoader();
    }

    initTextures() {
        textureManager.addTexture("sprites", placeholderTexture);
        textureManager.addTexture("player", playerTexture);
        textureManager.addTexture("scribble", scribbleTexture);
        textureManager.addTexture("rltiles", rlTilesTexture);
        textureManager.addTexture("webs", websTexture);
        textureManager.addTexture("map", mapTexture);

        spriteManager.addImage("placeholder", "sprites", 0, 0);
        spriteManager.addImage("map", "map", 0, 0, 704, 704);
        textureManager.loadJson("rltiles", rltilesJson);
        textureManager.loadJson("scribble", scribbleJson);
        textureManager.loadJson("webs", websJson);
    }

    handleEvents() {
        this.processAction(this.eventHandler.handleInput());
    }

    processAction(action) {
        if (action && this.eventHandler.isPlayerTurn) {
            const performedAction = action.perform(engine.playerMap);
            if (performedAction instanceof NoAction) {
                return false;
            }

            if (performedAction instanceof UnableToPerformAction) {
                if (performedAction.reason) {
                    messageManager.text(performedAction.reason).build();
                }
                return false;
            } else {
                engine.needsRenderUpdate = true;
                engine.player.fov.compute(engine.playerMap, engine.player, 5);
                engine.player.fov.updateMap();
                viewInfo.updatePlayerDetails(this.player, this.playerMap);

                this.handleEnemyTurns();

                return true;
            }
        }
    }

    handleEnemyTurns() {
        this.eventHandler.isPlayerTurn = false;

        for (const actor of this.heroMap.actors) {
            if (actor !== this.player) {
                const ai = actor.getComponent("ai");
                if (ai) {
                    ai.perform(this.heroMap);
                }
            }
        }

        if (this.shopMap) {
            for (const actor of this.shopMap.actors) {
                if (actor !== this.player) {
                    const ai = actor.getComponent("ai");
                    if (ai) {
                        ai.perform(this.shopMap);
                    }
                }
            }
        }

        if (this.nextMap) {
            for (const actor of this.nextMap.actors) {
                if (actor !== this.player) {
                    const ai = actor.getComponent("ai");
                    if (ai) {
                        ai.perform(this.nextMap);
                    }
                }
            }
        }

        if (this.futureMap) {
            for (const actor of this.futureMap.actors) {
                if (actor !== this.player) {
                    const ai = actor.getComponent("ai");
                    if (ai) {
                        ai.perform(this.futureMap);
                    }
                }
            }
        }

        this.eventHandler.isPlayerTurn = true;
    }

    clearMaps() {
        this.player = null;
        this.gameMaps = new Map();
    }

    setHeroMap(map) {
        const previousMap = this.heroMap;
        if (previousMap === map) {
            return;
        }

        // if (previousMap) {
        //     previousMap.teardown();
        //     previousMap.removeActor(this.player);
        // }

        this.heroMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        // if (this.player && this.heroMap.actors.indexOf(this.player) === -1) {
        //     this.heroMap.actors.push(this.player);
        // }

        this.heroMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    setNextMap(map) {
        const previousMap = this.nextMap;
        if (previousMap === map) {
            return;
        }

        // if (previousMap) {
        //     previousMap.teardown();
        //     previousMap.removeActor(this.player);
        // }

        this.nextMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        // if (this.player && this.nextMap.actors.indexOf(this.player) === -1) {
        //     this.nextMap.actors.push(this.player);
        // }

        this.nextMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    setFutureMap(map) {
        const previousMap = this.futureMap;
        if (previousMap === map) {
            return;
        }

        // if (previousMap) {
        //     previousMap.teardown();
        //     previousMap.removeActor(this.player);
        // }

        this.futureMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        // if (this.player && this.futureMap.actors.indexOf(this.player) === -1) {
        //     this.futureMap.actors.push(this.player);
        // }

        this.futureMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    setShopMap(map) {
        const previousMap = this.playerMap;
        if (previousMap === map) {
            return;
        }

        if (previousMap) {
            //previousMap.teardown();
            previousMap.removeActor(this.player);
        }

        this.playerMap = map;
        this.shopMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        if (this.player && this.shopMap.actors.indexOf(this.player) === -1) {
            this.shopMap.actors.push(this.player);
            const position = this.player.getComponent("position");
            position.moveTo(5, 5);

        }

        this.shopMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }


    getMap(mapName) {
        return this.gameMaps.get(mapName);
    }

    addMap(map) {
        if (!this.gameMaps.has(map.name)) {
            this.gameMaps.set(map.name, map);
        }
    }

    draw() {
        this.heroMap.draw();
        if (this.nextMap) {
            this.nextMap.draw(0, 11);
        }

        if (this.futureMap) {
            this.futureMap.draw(11, 11);
        }


        if (this.shopMap) {
            this.shopMap.draw(22, 0);
        }
    }

    save(name) {
        const maps = [];
        for (const map of this.gameMaps.values()) {
            maps.push(map.save());
        }

        const saveJson = {
            "name": name,
            "date": new Date(),
            "playerMap": this.playerMap.name,
            "heroMap": this.heroMap.name,
            "nextMap": this.nextMap.name,
            "shopMap": this.shopMap.name,
            "maps": maps
        };

        localStorage.setItem(name, JSON.stringify(saveJson));
    }

    load(/*name*/) {
        // this.clearMaps();
        // const loadData = localStorage.getItem(name);
        // if (loadData) {
        //     const json = JSON.parse(loadData);
        //     const heroMap = json.heroMap;
        //     const nextMap = json.nextMap;
        //     const shopMap = json.shopMap;
        //     for (const map of json.maps) {
        //         const newMap = new GameMap(map.name, map.width, map.height);
        //         newMap.load(map);
        //         this.addMap(newMap);
        //
        //         for (const actor of newMap.actors) {
        //             if (actor.name === "Player") {
        //                 this.player = actor;
        //                 break;
        //             }
        //         }
        //
        //         if (newMap.name === heroMap) {
        //             this.setHeroMap(newMap);
        //         } else if (newMap.name === nextMap) {
        //             this.setNextMap(newMap);
        //         } else if (newMap.name === shopMap) {
        //             this.setShopMap(newMap);
        //         }
        //     }
        // }
    }

    isPlayer(entity) {
        return entity === this.player;
    }
}

const engine = new Engine();
export default engine;