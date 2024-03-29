import entityLoader from "../../../engine/entity/EntityLoader";

export default class MapGeneration {
    static floorEntity = entityLoader.createFromTemplate("floor", {components: {position: {x: 0, y: 0}}});
    static wallEntity = entityLoader.createFromTemplate("wall", {components: {position: {x: 0, y: 0}}});

    constructor() {}

    static tunnelBetween(gameMap, x1, y1, x2, y2) {
        let cornerX;
        let cornerY;
        if (Math.random() < 0.5) {
            cornerX = x2;
            cornerY = y1;
        } else {
            cornerX = x1;
            cornerY = y2;
        }

        this.bresenham(gameMap, x1, y1, cornerX, cornerY);
        this.bresenham(gameMap, cornerX, cornerY, x2, y2);
    }

    static bresenham(gameMap, x1, y1, x2, y2) {
        if (x1 === x2) {
            if (y1 === y2) {
                return;
            }

            let startY = y1;
            let endY = y2;
            if (y1 > y2) {
                startY = y2;
                endY = y1;
            }
            for (let i = x1 - 1; i <= x1 + 1; i++) {
                for (let j = startY; j <= endY; j++) {
                    this.bresenhamCreateTiles(gameMap, i === x1, i, j);
                }
            }
        } else {
            let startX = x1;
            let endX = x2;
            if (x1 > x2) {
                startX = x2;
                endX = x1;
            }

            for (let j = y1 - 1; j <= y1 + 1; j++) {
                for (let i = startX; i <= endX; i++) {
                    this.bresenhamCreateTiles(gameMap, j === y1, i, j);
                }
            }
        }
    }


    static bresenhamCreateTiles(gameMap, createWall, i, j) {
        if (createWall) {
            const wallTile = gameMap.tiles[i][j];
            if (wallTile) {
                if (wallTile.getComponent("blocksMovement")?.blocksMovement.get()) {
                    gameMap.tiles[i][j] = null;
                }
            }
        } else {
            const floorTile = gameMap.tiles[i][j];
            if (!floorTile) {
                const wall = this.wallEntity.clone();
                wall.getComponent("position").moveTo(i, j);
                gameMap.tiles[i][j] = wall;
            }
        }

        const floor = this.floorEntity.clone();
        floor.getComponent("position").moveTo(i, j);
        gameMap.tiles[i][j] = floor;
    }
}