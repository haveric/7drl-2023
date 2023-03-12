import GameMap from "./GameMap";
import entityLoader from "../../entity/EntityLoader";
import MathUtil from "../../util/MathUtil";
//import MapGeneration from "../mapGeneration/MapGeneration";
import RectangularRoom from "./room/RectangularRoom";

export default class BasicDungeon extends GameMap {
    constructor(width, height, args = {}) {
        const level = args.level || 1;
        const name = "basic-dungeon-" + level;
        const displayName = "Dungeon Level " + level;
        super(name, displayName, width, height);

        this.maxRooms = args.maxRooms || 1;
        this.roomMinSize = args.roomMinSize || 8;
        this.roomMaxSize = args.roomMaxSize || 8;
        this.level = level;

        this.minTilesByFloor = [
            {level: 1, amount: 2},
            {level: 4, amount: 3},
            {level: 7, amount: 4}
        ];
        this.maxTilesByFloor = [
            {level: 1, amount: 4},
            {level: 4, amount: 6},
            {level: 7, amount: 8}
        ];
        this.minMonstersByFloor = [
            {level: 1, amount: 0},
            {level: 4, amount: 1},
            {level: 7, amount: 2}
        ];
        this.maxMonstersByFloor = [
            {level: 1, amount: 2},
            {level: 4, amount: 3},
            {level: 7, amount: 4}
        ];
        this.minItemsByFloor = [
            {level: 1, amount: 0},
            {level: 4, amount: 1},
            {level: 6, amount: 2}
        ];
        this.maxItemsByFloor = [
            {level: 1, amount: 2},
            {level: 4, amount: 3},
            {level: 6, amount: 5}
        ];
    }

    getFloorAmount(weights) {
        let amount = 0;
        for (const weight of weights) {
            if (weight.level > this.level) {
                break;
            }

            amount = weight.amount;
        }

        return amount;
    }

    save() {
        // if (engine.gameMap !== this && this.saveCache) {
        //     return this.saveCache;
        // }

        const saveJson = super.save();
        if (this.level !== 1) {
            saveJson.level = this.level;
        }

        this.saveCache = saveJson;
        return saveJson;
    }

    create(previousMapName, stairsInteractable) {
        super.create();

        //const floorEntity = entityLoader.createFromTemplate("floor", {components: {position: {x: 0, y: 0}}});
        const wallEntity = entityLoader.createFromTemplate("wall", {components: {position: {x: 0, y: 0}}});
        // Pre-fill with floor and walls
        for (let j = 0; j < this.height; j++) {
            for (let i = 0; i < this.width; i++) {
                const floor = wallEntity.clone();
                floor.getComponent("position").moveTo(i, j);
                this.tiles[i][j] = floor;
            }
        }

        const rooms = [];
        for (let i = 0; i < this.maxRooms; i++) {
            const roomWidth = MathUtil.randomInt(this.roomMinSize, this.roomMaxSize);
            const roomHeight = MathUtil.randomInt(this.roomMinSize, this.roomMaxSize);

            let x = 10 * i + 1;
            let y = 1;

            if (i >= (this.maxRooms / 2)) {
                y = 11;
                x -= 30;
            }

            const newRoom = new RectangularRoom(x, y, roomWidth, roomHeight);
            let intersectsOtherRoom = false;
            for (const room of rooms) {
                if (newRoom.intersects(room)) {
                    intersectsOtherRoom = true;
                    break;
                }
            }

            if (intersectsOtherRoom) {
                continue;
            }

            newRoom.createRoom(this);

            if (rooms.length === 0) {
                const centerX = newRoom.getCenterX();

                if (stairsInteractable) {
                    stairsInteractable.setPosition(centerX, 0);
                }

                this.tiles[centerX][0] = entityLoader.createFromTemplate("stairs_up", {components: {position: {x: centerX, y: 0}}});

                const stairsDownX = MathUtil.randomInt(newRoom.x1 + 2, newRoom.x2 - 2);
                const stairsDownY = MathUtil.randomInt(newRoom.y1 + 2, newRoom.y2 - 2);
                this.tiles[stairsDownX][stairsDownY] = entityLoader.createFromTemplate("stairs_down", {components: {position: {x: stairsDownX, y: stairsDownY}, stairsInteractable: {generator: "basic-dungeon"}}});

                let trapDoorX = stairsDownX;
                let trapDoorY = stairsDownY;

                while (trapDoorX === stairsDownX && trapDoorY === stairsDownY) {
                    trapDoorX = MathUtil.randomInt(newRoom.x1 + 2, newRoom.x2 - 2);
                    trapDoorY = MathUtil.randomInt(newRoom.y1 + 2, newRoom.y2 - 2);

                    if (trapDoorX !== stairsDownX || trapDoorY !== stairsDownY) {
                        this.tiles[trapDoorX][trapDoorY] = entityLoader.createFromTemplate("trap_door", {components: {position: {x: trapDoorX, y: trapDoorY}, trapDoorInteractable: {generator: "shop"}}});
                    }
                }
                // if (engine.player) {
                //     const playerPosition = engine.player.getComponent("position");
                //     if (playerPosition) {
                //         this.tiles[centerX][centerY] = entityLoader.createFromTemplate("stairs_north", {components: {position: {x: centerX, y: centerY}, stairsInteractable: {map: previousMapName, x: playerPosition.x, y: playerPosition.y}}});
                //     }
                // } else {
                //     this.tiles[centerX][centerY] = entityLoader.createFromTemplate("stairs_north", {components: {position: {x: centerX, y: centerY}, stairsInteractable: {map: "town", x: 31, y: 31}}});
                // }
            } else {
                //const lastRoom = rooms[rooms.length - 1];
                //MapGeneration.tunnelBetween(this, lastRoom.getCenterX(), lastRoom.getCenterY(), newRoom.getCenterX(), newRoom.getCenterY());
            }

            rooms.push(newRoom);
        }

        // const lastRoom = rooms[rooms.length - 1];
        // const lastRoomCenterX = lastRoom.getCenterX();
        // const lastRoomCenterY = lastRoom.getCenterY();
        //this.tiles[lastRoomCenterX][lastRoomCenterY] = entityLoader.createFromTemplate("stairs_north", {components: {position: {x: lastRoomCenterX, y: lastRoomCenterY}, stairsInteractable: {generator: "basic-dungeon"}}});

        for (const room of rooms) {
            room.placeTiles(this, "basic-dungeon", this.level, this.getFloorAmount(this.minTilesByFloor), this.getFloorAmount(this.maxTilesByFloor));
            room.placeEntities(this, "basic-dungeon", this.level, this.getFloorAmount(this.minMonstersByFloor), this.getFloorAmount(this.maxMonstersByFloor));
            room.placeItems(this, "basic-dungeon", this.level, this.getFloorAmount(this.minItemsByFloor), this.getFloorAmount(this.maxItemsByFloor));
        }
    }
}