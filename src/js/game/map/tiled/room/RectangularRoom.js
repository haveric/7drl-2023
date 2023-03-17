import Room from "./_Room";
import MathUtil from "../../../../engine/util/MathUtil";
import entityLoader from "../../../../engine/entity/EntityLoader";
import chanceLoader from "../../mapGeneration/ChanceLoader";

export default class RectangularRoom extends Room {
    constructor(x, y, width, height) {
        super();
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
        this.width = width;
        this.height = height;
    }

    getCenterX() {
        return Math.round((this.x1 + this.x2) / 2);
    }

    getCenterY() {
        return Math.round((this.y1 + this.y2) / 2);
    }

    intersects(otherRoom) {
        return this.x1 <= otherRoom.x2
            && this.x2 >= otherRoom.x1
            && this.y1 <= otherRoom.y2
            && this.y2 >= otherRoom.y1;
    }

    createRoom(gameMap) {
        const left = Math.max(0, this.x1);
        const right = Math.min(gameMap.width, this.x2 + 1);
        const top = Math.max(0, this.y1);
        const bottom = Math.min(gameMap.height, this.y2 + 1);

        const floorEntity = entityLoader.createFromTemplate("floor", {components: {position: {x: 0, y: 0}}});
        const floorEntityCenter = entityLoader.createFromTemplate("floor_center", {components: {position: {x: 0, y: 0}}});
        const floorEntityCracked = entityLoader.createFromTemplate("floor_cracked", {components: {position: {x: 0, y: 0}}});
        const wallEntity = entityLoader.createFromTemplate("wall", {components: {position: {x: 0, y: 0}}});
        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                let floor;
                const rand = Math.random();
                if (rand < .06) {
                    floor = floorEntityCracked.clone();
                } else if (rand < .1) {
                    floor = floorEntityCenter.clone();
                } else {
                    floor = floorEntity.clone();
                }
                floor.getComponent("position").moveTo(i, j);
                gameMap.tiles[i][j] = floor;

                const isVerticalEdge = (i === this.x1 || i === this.x2) && j >= this.y1 && j <= this.y2;
                const isHorizontalEdge = (j === this.y1 || j === this.y2) && i >= this.x1 && i <= this.x2;
                const wallTile = gameMap.tiles[i][j];
                if (isHorizontalEdge || isVerticalEdge) {
                    if (!wallTile) {
                        const wall = wallEntity.clone();
                        wall.getComponent("position").moveTo(i, j);
                        gameMap.tiles[i][j] = wall;
                    }
                }
            }
        }
    }

    placeTiles(gameMap, name, level, min, max) {
        const numTiles = MathUtil.randomInt(min, max);
        for (let i = 0; i < numTiles; i++) {
            const x = MathUtil.randomInt(this.x1 + 1, this.x2 - 1);
            const y = MathUtil.randomInt(this.y1 + 1, this.y2 - 1);

            const blockingActor = gameMap.getBlockingActorAtLocation(x, y);
            if (!blockingActor) {
                const position = {components: {position: {x: x, y: y}}};

                const tiledId = chanceLoader.getTileForLevel(name, level);
                gameMap.tiles[x][y] = entityLoader.createFromTemplate(tiledId, position);
            }
        }
    }

    placeEntities(gameMap, name, level, min, max) {
        const numMonsters = MathUtil.randomInt(min, max);
        for (let i = 0; i < numMonsters; i++) {
            const x = MathUtil.randomInt(this.x1 + 1, this.x2 - 1);
            const y = MathUtil.randomInt(this.y1 + 1, this.y2 - 1);

            const blockingActor = gameMap.getBlockingActorAtLocation(x, y);
            if (!blockingActor) {
                const position = {components: {position: {x: x, y: y}}};

                const actorId = chanceLoader.getActorForLevel(name, level);
                const actor = entityLoader.createFromTemplate(actorId, position);

                gameMap.addActor(actor);
            }
        }
    }

    placeItems(gameMap, name, level, maxItems) {
        const numItems = MathUtil.randomInt(0, maxItems);
        for (let i = 0; i < numItems; i++) {
            const x = MathUtil.randomInt(this.x1 + 1, this.x2 - 1);
            const y = MathUtil.randomInt(this.y1 + 1, this.y2 - 1);

            const position = {components: {position: {x: x, y: y}}};
            const itemId = chanceLoader.getItemForLevel(name, level);
            const item = entityLoader.createFromTemplate(itemId, position);

            gameMap.items.push(item);
        }
        //
        // const numGoldItems = MathUtil.randomInt(0, maxItems);
        // for (let i = 0; i < numGoldItems; i++) {
        //     const x = MathUtil.randomInt(this.x1 + 1, this.x2 -1);
        //     const y = MathUtil.randomInt(this.y1 + 1, this.y2 -1);
        //     const amount = MathUtil.randomInt(1, 25);
        //
        //     const position = {amount: amount, components: {position: {x: x, y: y}}};
        //     const item = entityLoader.createFromTemplate("gold", position);
        //
        //     engine.gameMap.items.push(item);
        // }
    }
}