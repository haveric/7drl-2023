import "./styles/style.css";
import engine from "./js/Engine";
import DefaultPlayerEventHandler from "./js/event/DefaultPlayerEventHandler";
import messageManager from "./js/message/MessageManager";
import entityLoader from "./js/entity/EntityLoader";
import sceneState from "./js/SceneState";
import viewInfo from "./js/ui/ViewInfo";
import Tutorial from "./js/map/tile/Tutorial";

(function () {
    function init() {
        engine.gameMap = new Tutorial(11, 11);
        engine.initTextures();
        engine.player = entityLoader.createFromTemplate("player", {components: {position: {x: 0, y: 0}}});

        engine.gameMap.create();

        // const playerPosition = engine.player.getComponent("position");
        // let foundPlace = false;
        // while(!foundPlace) {
        //     const playerRow = Math.floor(Math.random() * (engine.gameMap.height - 4)) + 2;
        //     const playerCol = Math.floor(Math.random() * (engine.gameMap.width - 4)) + 2;
        //     console.log("Row: " + playerRow + ", Col: " + playerCol);
        //     const tileX = engine.gameMap.tiles[playerRow];
        //     if (tileX) {
        //         console.log(tileX);
        //         const tile = tileX[playerCol];
        //
        //         if (!tile.isWall()) {
        //             playerPosition.moveTo(playerRow, playerCol);
        //             foundPlace = true;
        //         }
        //     }
        // }
        engine.gameMap.actors.push(engine.player);

        engine.eventHandler = new DefaultPlayerEventHandler();

        // const playerFighter = engine.player.getComponent("fighter");
        // playerFighter.updateUI();

        viewInfo.updatePlayerDetails();
        messageManager.text("Welcome to the dungeon.").build();

        engine.needsRenderUpdate = true;
        const playerPosition = engine.player.getComponent("position");
        engine.gameMap.revealFromPosition(playerPosition.x, playerPosition.y, 100, 0);
        engine.player.fov.compute(playerPosition.x, playerPosition.y, 5);
        engine.player.fov.updateMap();


        window.requestAnimationFrame(update);
    }

    function update() {
        engine.handleEvents();

        if (engine.spriteManager.preloadSprites()) {
            if (engine.needsRenderUpdate) {
                render();

                engine.needsRenderUpdate = false;
            }
        }

        window.requestAnimationFrame(update);
    }

    function render() {
        sceneState.clearAll();
        engine.gameMap.draw();
    }

    init();
}());