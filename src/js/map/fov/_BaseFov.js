import engine from "../../Engine";
import Fov from "../../components/Fov";

export default class BaseFov {
    constructor() {
        this.previousVisibleTiles = [];
        this.visibleTiles = [];
        this.visibleActors = [];
        this.visibleItems = [];
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
    }

    teardown() {
        this.previousVisibleTiles = [];
        this.visibleTiles = [];
        this.visibleActors = [];
        this.visibleItems = [];
    }

    compute(x, y, radius) {
        this.previousVisibleTiles = this.visibleTiles;
        this.visibleTiles = [];
        this.visibleActors = [];
        this.visibleItems = [];

        this.left = Math.max(0, x - radius);
        this.right = Math.min(engine.gameMap.width, x + radius + 1);
        this.top = Math.max(0, y - radius);
        this.bottom = Math.min(engine.gameMap.height, y + radius + 1);
    }

    addVisibleTile(tile) {
        if (this.visibleTiles.indexOf(tile) === -1) {
            this.visibleTiles.push(tile);
        }
    }

    addVisibleActor(object) {
        if (this.visibleActors.indexOf(object) === -1) {
            this.visibleActors.push(object);
        }
    }

    addVisibleItem(object) {
        if (this.visibleItems.indexOf(object) === -1) {
            this.visibleItems.push(object);
        }
    }
    //
    // remove(object) {
    //     const newIndex = this.newObjects.indexOf(object);
    //     if (newIndex > -1) {
    //         this.newObjects.splice(newIndex, 1);
    //     }
    //
    //     const oldIndex = this.oldObjects.indexOf(object);
    //     if (oldIndex > -1) {
    //         this.oldObjects.splice(oldIndex, 1);
    //     }
    //
    //     this.removeVisible(object);
    // }
    //
    // removeVisible(object) {
    //     const visibleIndex = this.visibleObjects.indexOf(object);
    //     if (visibleIndex > -1 ) {
    //         this.visibleObjects.splice(visibleIndex, 1);
    //     }
    //
    //     const visibleItemsIndex = this.visibleItems.indexOf(object);
    //     if (visibleItemsIndex > -1) {
    //         this.visibleItems.splice(visibleItemsIndex, 1);
    //     }
    //
    //     const previousVisibleItemsIndex = this.previousVisibleObjects.indexOf(object);
    //     if (previousVisibleItemsIndex > -1) {
    //         this.previousVisibleObjects.splice(previousVisibleItemsIndex, 1);
    //     }
    // }

    exploreTile(x, y) {
        const tileArrayX =  engine.gameMap.tiles[x];
        if (tileArrayX) {
            const tile = tileArrayX[y];

            if (tile) {
                this.addVisibleTile(tile);
            }
        }

        for (const actor of engine.gameMap.actors) {
            const positionalObject = actor.getComponent("position");
            if (positionalObject) {
                if (positionalObject.x === x && positionalObject.y === y) {
                    this.addVisibleActor(actor);
                }
            }
        }

        for (const item of engine.gameMap.items) {
            const positionalObject = item.getComponent("position");
            if (positionalObject) {
                if (positionalObject.x === x && positionalObject.y === y) {
                    this.addVisibleItem(item);
                }
            }
        }
    }

    updateMap() {
        for (const tile of this.previousVisibleTiles) {
            const fov = tile.getComponent("fov");
            if (fov) {
                fov.setVisible(false);
            }
        }

        for (const tile of this.visibleTiles) {
            const fov = tile.getComponent("fov");
            if (fov) {
                fov.setExplored(true);
                fov.setVisible(true);
            } else {
                tile.setComponent(new Fov({components: {fov: {explored: true, visible: true}}}));
            }
        }
    }
}