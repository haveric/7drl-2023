import BasicDungeon from "./tiled/BasicDungeon";
import Shop from "./tiled/Shop";

export default class MapLoader {
    constructor() {}

    loadMap(mapType, args = {}) {
        switch(mapType) {
            case "basic-dungeon":
                return new BasicDungeon(11, 11, args);
            case "shop":
                return new Shop(11, 11, args);
            default:
                return null;
        }
    }
}