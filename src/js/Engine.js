import NoAction from "./actions/NoAction";
import UnableToPerformAction from "./actions/UnableToPerformAction";
import messageManager from "./message/MessageManager";
import viewInfo from "./ui/ViewInfo";
import TextureManager from "./sprite/TextureManager";
import SpriteManager from "./sprite/SpriteManager";
import placeholderTexture from "../img/placeholder.gif";
import playerTexture from "../img/player.gif";
import scribbleTexture from "../img/kenney/scribble.png";
import rlTilesTexture from "../img/rltiles/rltiles-2d-2x.png";

class Engine {
    constructor() {
        this.eventHandler = null;
        this.player = null;
        this.gameMap = null;
        this.needsRenderUpdate = false;

        this.textureManager = null;
        this.spriteManager = null;
    }

    initTextures() {
        this.textureManager = new TextureManager();
        this.textureManager.addTexture("sprites", placeholderTexture);
        this.textureManager.addTexture("player", playerTexture);
        this.textureManager.addTexture("scribble", scribbleTexture);
        this.textureManager.addTexture("rltiles", rlTilesTexture);

        this.spriteManager = new SpriteManager();
        this.spriteManager.addImage("placeholder", "sprites", 0, 0);
        this.spriteManager.addImage("floor", "scribble", 0, 0);
        this.spriteManager.addImage("wall", "scribble", 128, 0);
        this.spriteManager.addImage("stairs", "scribble", 448, 256);
        this.spriteManager.addImage("player", "scribble", 0, 512);
        this.spriteManager.addImage("rat", "rltiles", 320, 640);
        this.spriteManager.addImage("potion_red", "rltiles", 640, 2688);
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