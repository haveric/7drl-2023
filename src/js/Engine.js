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

class Engine {
    constructor() {
        this.eventHandler = null;
        this.player = null;
        this.gameMap = null;
        this.needsRenderUpdate = false;

        this.textureManager = null;
        this.spriteManager = null;

        this.xScale = 1;
        this.yScale = 1;
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
            const performedAction = action.perform();
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
                engine.player.fov.compute(engine.player, 5);
                engine.player.fov.updateMap();
                viewInfo.updatePlayerDetails();

                this.handleEnemyTurns();

                return true;
            }
        }
    }

    handleEnemyTurns() {
        this.eventHandler.isPlayerTurn = false;

        for (const actor of this.gameMap.actors) {
            if (actor !== this.player) {
                const ai = actor.getComponent("ai");
                if (ai) {
                    ai.perform();
                }
            }
        }

        this.eventHandler.isPlayerTurn = true;
    }
}

const engine = new Engine();
export default engine;