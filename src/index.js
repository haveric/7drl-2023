import "./styles/style.css";
import engine from "./js/game/Engine";
import DefaultPlayerEventHandler from "./js/game/event/DefaultPlayerEventHandler";
import messageManager from "./js/game/message/MessageManager";
import entityLoader from "./js/engine/entity/EntityLoader";
import sceneState from "./js/engine/SceneState";
import viewInfo from "./js/game/ui/ViewInfo";
import Tutorial from "./js/game/map/tiled/Tutorial";
import BasicDungeon from "./js/game/map/tiled/BasicDungeon";
import Shop from "./js/game/map/tiled/Shop";
import heroInfo from "./js/game/ui/HeroInfo";
import selectList from "./js/game/ui/SelectList";
import tradeList from "./js/game/ui/TradeList";
import playerInfo from "./js/game/ui/PlayerInfo";
import messageConsole from "./js/game/ui/MessageConsole";
import details from "./js/game/ui/Details";
import spriteManager from "./js/engine/sprite/SpriteManager";
import componentLoader from "./js/engine/component/ComponentLoader";

(function () {
    function init() {
        setupGameHtml();
        engine.clearMaps();
        engine.initTextures();
        sceneState.resizeCanvas();

        engine.setHeroMap(new Tutorial(11, 11));
        engine.setNextMap(new BasicDungeon(11, 11, {level: 2}));
        engine.setFutureMap(new BasicDungeon(11, 11, {level: 3}));
        engine.setShopMap(new Shop(11, 11));

        engine.player = entityLoader.createFromTemplate("player", {components: {position: {x: 0, y: 0}}});

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

        engine.heroMap.create();
        engine.nextMap.create();
        engine.futureMap.create();
        engine.shopMap.create();

        engine.playerMap = engine.heroMap;

        engine.eventHandler = new DefaultPlayerEventHandler();

        // const playerFighter = engine.player.getComponent("fighter");
        // playerFighter.updateUI();

        viewInfo.updatePlayerDetails(engine.player, engine.playerMap);
        messageManager.text("Welcome to the dungeon.").build();

        engine.needsRenderUpdate = true;
        const playerPosition = engine.player.getComponent("position");
        engine.heroMap.revealFromPosition(playerPosition.x.get(), playerPosition.y.get(), 20, 0);
        engine.player.fov.compute(engine.playerMap, playerPosition.x.get(), playerPosition.y.get(), 5);
        engine.player.fov.updateMap();


        window.requestAnimationFrame(update);
    }

    function setupGameHtml() {
        heroInfo.open();
        heroInfo.appendTo(sceneState.gameDom);

        selectList.appendTo(sceneState.gameDom);
        tradeList.appendTo(sceneState.gameDom);

        playerInfo.open();
        viewInfo.open();
        messageConsole.open();
        details.open();

        playerInfo.appendTo(details.dom);
        viewInfo.appendTo(details.dom);
        messageConsole.appendTo(details.dom);
        details.appendTo(sceneState.gameDom);
    }

    function update() {
        engine.handleEvents();

        if (spriteManager.preloadSprites()) {
            if (engine.needsRenderUpdate || sceneState.needsRenderUpdate) {
                render();

                engine.needsRenderUpdate = false;
                sceneState.needsRenderUpdate = false;
            }
        }

        window.requestAnimationFrame(update);
    }

    function render() {
        sceneState.clearAll();
        engine.draw();
    }

    let componentsLoaded = false;
    function preloadComponents() {
        const components = require.context("/src/js/game/components", true, /\.js$/, "eager");
        let numToLoad = components.keys().length;
        let numLoaded = 0;
        components.keys().forEach(filePath => {
            if (filePath.indexOf("_") !== -1) {
                numToLoad --;

                if (numLoaded === numToLoad) {
                    componentsLoaded = true;
                }
                return;
            }
            components(filePath).then(module => {
                const constructor = module.default;

                // Skip frozen objects (such as enums)
                if (constructor.constructor.isFrozen) {
                    numLoaded ++;
                    return;
                }

                componentLoader.load(new constructor());

                numLoaded ++;
                if (numLoaded === numToLoad) {
                    componentsLoaded = true;
                }
            });
        });
    }

    componentLoader.preloadComponents();
    preloadComponents();

    const preloadEntities = window.setInterval(() => {
        if (componentsLoaded && componentLoader.componentsLoaded && sceneState.renderer.componentsLoaded && entityLoader.isLoaded()) {
            clearInterval(preloadEntities);
            init();
        }
    }, 0);
}());