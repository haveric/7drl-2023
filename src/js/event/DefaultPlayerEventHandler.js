import _EventHandler from "./_EventHandler";
import controls from "../controls/Controls";
import BumpAction from "../actions/actionWithDirection/BumpAction";
import engine from "../Engine";
import WaitAction from "../actions/WaitAction";
// import HexUtil from "../util/HexUtil";
// import viewInfo from "../ui/ViewInfo";

export default class DefaultPlayerEventHandler extends _EventHandler {
    constructor() {
        super();
    }

    teardown() {
        super.teardown();
    }

    handleInput() {
        let action = null;

        if (this.isPlayerTurn && engine.player.isAlive()) {
            if (controls.testPressed("up")) {
                action = new BumpAction(engine.player, 0, -1);
            } else if (controls.testPressed("down")) {
                action = new BumpAction(engine.player, 0, 1);
            } else if (controls.testPressed("left")) {
                action = new BumpAction(engine.player, -1, 0);
            } else if (controls.testPressed("right")) {
                action = new BumpAction(engine.player, 1, 0);
            } else if (controls.testPressed("nw")) {
                action = new BumpAction(engine.player, -1, -1);
            } else if (controls.testPressed("ne")) {
                action = new BumpAction(engine.player, 1, -1);
            } else if (controls.testPressed("sw")) {
                action = new BumpAction(engine.player, -1, 1);
            } else if (controls.testPressed("se")) {
                action = new BumpAction(engine.player, 1, 1);
            } else if (controls.testPressed("wait")) {
                action = new WaitAction(engine.player);
            }
        }

        return action;
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // const hex = HexUtil.pixelToHex(this.mouse);
        // const tile = engine.gameMap.getTileFromHexCoords(hex.q, hex.r);
        // if (tile) {
        //     if (this.targetedTile !== tile) {
        //         for (const pathTile of this.pathTiles) {
        //             pathTile.highlighted = false;
        //         }
        //         if (this.targetedTile) {
        //             this.targetedTile.highlighted = false;
        //         }
        //
        //         tile.highlighted = true;
        //         this.targetedTile = tile;
        //
        //         const tileFov = tile.getComponent("fov");
        //         if (tileFov && tileFov.visible) {
        //             const costGraph = engine.player.fov.getCostGraph();
        //             const playerHex = engine.player.getComponent("hex");
        //             const tileHex = tile.getComponent("hex");
        //             const path = engine.player.fov.getPath(costGraph, playerHex, tileHex);
        //             for (const pathNode of path) {
        //                 const newRow = pathNode.row + engine.player.fov.left;
        //                 const newCol = pathNode.col + engine.player.fov.top;
        //
        //                 const pathNodeTile = engine.gameMap.getTileFromArrayCoords(newRow, newCol);
        //                 pathNodeTile.highlighted = true;
        //                 this.pathTiles.push(pathNodeTile);
        //             }
        //         }
        //
        //         viewInfo.updatePositionDetails(tile);
        //     }
        // }

        engine.needsRenderUpdate = true;
    }
}