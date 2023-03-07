import ArrayUtil from "../../util/ArrayUtil";
import entityLoader from "../../entity/EntityLoader";
import engine from "../../Engine";
import Fov from "../../components/Fov";
// import details from "../../ui/Details";
import Actor from "../../entity/Actor";
import Item from "../../entity/Item";
import details from "../../ui/Details";

export default class GameMap {
    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;

        this.timeout = null;
        this.saveCache = null;

        this.init();
    }

    init() {
        this.tiles = ArrayUtil.create2dArray(this.width);
        this.actors = [];
        this.items = [];
    }

    create() {}

    teardown() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        engine.player.fov.teardown();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const tile = this.tiles[i][j];
                if (tile) {
                    tile.callEvent("onMapTeardown");
                }
            }
        }

        for (const actor of this.actors) {
            actor.callEvent("onMapTeardown");
        }

        for (const item of this.items) {
            item.callEvent("onMapTeardown");
        }
    }

    removeEntity(entity) {
        if (entity instanceof Actor) {
            this.removeActor(entity);
        } else if (entity instanceof Item) {
            this.removeItem(entity);
        }
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    /**
     *
     * @param item
     * @param groundPosition
     * @returns {boolean} true if item added <br/>
     *                    false if item merged and item is deleted
     */
    addItem(item, groundPosition) {
        const itemPosition = item.getComponent("position");
        if (!groundPosition) {
            groundPosition = itemPosition;
        }

        let amountToAdd = item.amount;
        for (const mapItem of this.items) {
            if (mapItem.id === item.id) {
                const position = mapItem.getComponent("position");
                if (position && groundPosition.isSamePosition(position)) {
                    if (mapItem.maxStackSize === -1) {
                        mapItem.setAmount(mapItem.amount + item.amount);
                        itemPosition.teardown();
                        return false;
                    }

                    const amountCanAdd = mapItem.maxStackSize - mapItem.amount;
                    if (amountCanAdd >= amountToAdd) {
                        mapItem.setAmount(mapItem.amount + amountToAdd);
                        itemPosition.teardown();
                        return false;
                    } else {
                        mapItem.setAmount(mapItem.amount + amountCanAdd);
                        item.setAmount(item.amount - amountCanAdd);

                        amountToAdd -= amountCanAdd;
                    }
                }
            }
        }

        if (amountToAdd > 0) {
            item.setAmount(amountToAdd);

            itemPosition.moveTo(groundPosition.x, groundPosition.y);
            item.parent = null;
            this.items.push(item);
            itemPosition.setVisible();
            return true;
        } else {
            itemPosition.teardown();
            return false;
        }
    }

    removeActor(actor) {
        const index = this.actors.indexOf(actor);
        if (index > -1) {
            this.actors.splice(index, 1);
        }
    }

    addActor(actor) {
        this.actors.push(actor);
    }

    save() {
        if (engine.gameMap !== this && this.saveCache) {
            return this.saveCache;
        }

        const saveData = {
            name: this.name,
            width: this.width,
            height: this.height
        };

        saveData["tiles"] = {};
        const tileArray = [];
        const letterArray = [];
        let key = "";
        let charCode = 65;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const tile = this.tiles[i][j];
                if (tile) {
                    const tileJson = JSON.stringify(tile.save());
                    const index = tileArray.indexOf(tileJson);
                    if (index > -1) {
                        key += letterArray[index];
                    } else {
                        tileArray.push(tileJson);
                        letterArray.push(String.fromCharCode(charCode));
                        key += String.fromCharCode(charCode);

                        charCode++;
                    }
                } else {
                    key += " ";
                }
            }
        }

        saveData["tiles"] = {};
        saveData["tiles"]["key"] = key;
        saveData["tiles"]["map"] = {};

        for (let i = 0; i < tileArray.length; i++) {
            saveData["tiles"]["map"][letterArray[i]] = tileArray[i];
        }

        const actorJson = [];
        for (const actor of this.actors) {
            actorJson.push(JSON.stringify(actor.save()));
        }
        saveData["actors"] = actorJson;

        const itemJson = [];
        for (const item of this.items) {
            itemJson.push(JSON.stringify(item.save()));
        }
        saveData["items"] = itemJson;

        this.saveCache = saveData;
        return saveData;
    }

    load(json) {
        const tiles = json.tiles;

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                const index = i*this.height + j;
                const tile = tiles[index];

                if (tile) {
                    tiles[i][j] = entityLoader.create(tile, {components: {position: {x: i, y: j}}});
                }
            }
        }

        const actors = json.actors;
        for (const actor of actors) {
            const createdActor = entityLoader.create(actor);
            this.addActor(createdActor);
        }

        const items = json.items;
        for (const item of items) {
            const createdItem = entityLoader.create(item);
            this.items.push(createdItem);
        }
    }

    isInBounds(x, y) {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    revealFromPosition(x, y, radius, delay = 25) {
        const self = this;
        const minX = Math.max(0, x - radius);
        const maxX = Math.min(engine.gameMap.width, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(engine.gameMap.height, y + radius);

        if (delay === 0) {
            self._revealGradually(minX, maxX, minY, maxY, x, y, 1, radius, delay);
        } else {
            self.timeout = setTimeout(function () {
                self._revealGradually(minX, maxX, minY, maxY, x, y, 1, radius, delay);
            }, delay);
        }
    }

    _revealGradually(minX, maxX, minY, maxY, x, y, radius, maxRadius, delay) {
        const self = this;
        self.timeout = null;

        if (radius <= maxRadius) {
            self.timeout = setTimeout(function () {
                self._revealGradually(minX, maxX, minY, maxY, x, y, radius + 1, maxRadius, delay);
            }, delay);
        }

        const xRadiusMin = x - radius;
        const xRadiusMax = x + radius;
        const yRadiusMin = y - radius;
        const yRadiusMax = y + radius;
        for (let i = xRadiusMin; i <= xRadiusMax; i++) {
            const xIsEdge = i === xRadiusMin || i === xRadiusMax;
            for (let j = yRadiusMin; j <= yRadiusMax; j++) {
                if (xIsEdge || j === yRadiusMin || j === yRadiusMax) {
                    this._revealAtPosition(i, j);
                    engine.needsMapUpdate = true;
                }
            }
        }

        if (xRadiusMin <= minX && xRadiusMax >= maxX && yRadiusMin <= minY && yRadiusMax >= maxY) {
            return true;
        }

        return true;
    }

    _revealAtPosition(x, y) {
        const tileX = this.tiles[1][x];
        if (tileX) {
            const tile = this.tiles[1][x][y];
            if (tile) {
                const position = tile.getComponent("position");
                if (position) {
                    const fov = tile.getComponent("fov");
                    if (!fov) {
                        tile.setComponent(new Fov({components: {fov: {explored: true, visible: false}}}));
                    }
                }
            }
        }
    }

    getAliveActorAtLocation(x, y) {
        let aliveActor = null;
        for (const actor of this.actors) {
            if (actor.isAlive()) {
                const position = actor.getComponent("position");
                if (position && x === position.x && y === position.y) {
                    aliveActor = actor;
                    break;
                }
            }
        }

        return aliveActor;
    }

    getBlockingActorAtLocation(x, y) {
        let blockingActor = null;
        for (const actor of this.actors) {
            const position = actor.getComponent("position");
            if (position && x === position.x && y === position.y) {
                const component = actor.getComponent("blocksMovement");
                if (component && component.blocksMovement) {
                    blockingActor = actor;
                    break;
                }
            }
        }

        return blockingActor;
    }

    getCleanableActorAtLocation(x, y) {
        let cleanableActor = null;
        for (const actor of this.actors) {
            const position = actor.getComponent("position");
            if (position && x === position.x && y === position.y) {
                const component = actor.getComponent("cleanable");
                if (component) {
                    cleanableActor = actor;
                    break;
                }
            }
        }

        return cleanableActor;
    }

    addPlayer(x, y) {
        if (!engine.player) {
            engine.player = entityLoader.createFromTemplate("player");
        }

        this.addActor(engine.player);

        const playerPosition = engine.player.getComponent("position");
        playerPosition.moveTo(x, y);

        this.updatePlayerUI();
    }

    updatePlayerUI() {
        details.updatePlayerDetails();
    }

    draw() {
        const tiles = engine.gameMap.tiles;

        for (let i = 0; i < tiles.length; i++) {
            const tileX = tiles[i];
            for (let j = 0; j < tileX.length; j++) {
                const tile = tileX[j];
                if (tile) {
                    tile.draw();
                }
            }
        }

        for (const item of engine.gameMap.items) {
            item.draw();
        }

        for (const actor of engine.gameMap.actors) {
            actor.draw();
        }

        // const fov = engine.player.fov;
        // // for (const tile of fov.visibleTiles) {
        // //     tile.draw();
        // // }
        //
        // for (const actor of fov.visibleActors) {
        //     if (actor) {
        //         actor.draw();
        //     }
        // }
        //
        // for (const item of fov.visibleItems) {
        //     if (item) {
        //         item.draw();
        //     }
        // }
    }
}