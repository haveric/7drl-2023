import NoAction from "./actions/NoAction";
import UnableToPerformAction from "./actions/UnableToPerformAction";
import messageManager from "./message/MessageManager";
import viewInfo from "./ui/ViewInfo";
import TextureManager from "./sprite/TextureManager";
import SpriteManager from "./sprite/SpriteManager";
import placeholderTexture from "../img/placeholder.gif";
import playerTexture from "../img/player.gif";
import scribbleTexture from "../img/kenney/scribble.png";
import scribbleJson from "../img/kenney/scribble.json";
import websTexture from "../img/electronsandsuch/webs.png";
import websJson from "../img/electronsandsuch/webs.json";
import rlTilesTexture from "../img/rltiles/rltiles-2d-2x.png";
import rltilesJson from "../img/rltiles/rltiles-2d-2x.json";
//import GameMap from "./map/tile/GameMap";

class Engine {
    constructor() {
        this.eventHandler = null;
        this.player = null;
        //this.gameMap = null;

        this.gameMaps = new Map();
        this.playerMap = null;

        this.heroMap = null;
        this.nextMap = null;
        this.shopMap = null;
        this.needsRenderUpdate = false;

        this.textureManager = null;
        this.spriteManager = null;

        this.scale = 1;
    }

    initTextures() {
        this.textureManager = new TextureManager();
        this.textureManager.addTexture("sprites", placeholderTexture);
        this.textureManager.addTexture("player", playerTexture);
        this.textureManager.addTexture("scribble", scribbleTexture);
        this.textureManager.addTexture("rltiles", rlTilesTexture);
        this.textureManager.addTexture("webs", websTexture);

        this.spriteManager = new SpriteManager();
        this.spriteManager.addImage("placeholder", "sprites", 0, 0);
        this.textureManager.loadJson("rltiles", rltilesJson);
        this.textureManager.loadJson("scribble", scribbleJson);
        this.textureManager.loadJson("webs", websJson);

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
                viewInfo.updatePlayerDetails();

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

        for (const actor of this.shopMap.actors) {
            if (actor !== this.player) {
                const ai = actor.getComponent("ai");
                if (ai) {
                    ai.perform(this.shopMap);
                }
            }
        }

        for (const actor of this.nextMap.actors) {
            if (actor !== this.player) {
                const ai = actor.getComponent("ai");
                if (ai) {
                    ai.perform(this.nextMap);
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

        if (previousMap) {
            previousMap.teardown();
            previousMap.removeActor(this.player);
        }

        this.heroMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        if (this.player && this.heroMap.actors.indexOf(this.player) === -1) {
            this.heroMap.actors.push(this.player);
        }

        this.heroMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    setNextMap(map) {
        const previousMap = this.nextMap;
        if (previousMap === map) {
            return;
        }

        if (previousMap) {
            previousMap.teardown();
            previousMap.removeActor(this.player);
        }

        this.nextMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        if (this.player && this.nextMap.actors.indexOf(this.player) === -1) {
            this.nextMap.actors.push(this.player);
        }

        this.nextMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    setShopMap(map) {
        const previousMap = this.shopMap;
        if (previousMap === map) {
            return;
        }

        if (previousMap) {
            previousMap.teardown();
            previousMap.removeActor(this.player);
        }

        this.shopMap = map;
        this.addMap(map);
        if (previousMap) {
            previousMap.save();
        }
        map.save();
        if (this.player && this.shopMap.actors.indexOf(this.player) === -1) {
            this.shopMap.actors.push(this.player);
        }

        this.shopMap.updatePlayerUI();
        this.needsRenderUpdate = true;
    }

    addMap(map) {
        if (!this.gameMaps.has(map.name)) {
            this.gameMaps.set(map.name, map);
        }
    }

    draw() {
        this.heroMap.draw();
        this.nextMap.draw(0, 11);
        this.shopMap.draw(20, 0);
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
}

const engine = new Engine();
export default engine;