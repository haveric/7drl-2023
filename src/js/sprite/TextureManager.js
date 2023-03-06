import Texture from "./Texture";
import engine from "../Engine";

export default class TextureManager {
    constructor() {
        this.textures = [];
    }

    addTexture(name, src) {
        const self = this;
        const image = new Image();

        image.onload = function () {
            self.textures.push(new Texture(name, image));
        };
        image.src = src;
    }

    getTexture(textureName) {
        const length = this.textures.length;
        for (let i = 0; i < length; i++) {
            if (this.textures[i].name === textureName) {
                return this.textures[i].image;
            }
        }
        return null;
    }

    loadJson(textureName, json) {
        const tileSize = json.tileSize;
        const name = json.name;
        const width = json.width;
        const tiles = json.tiles;

        let row = 0;
        let col = 0;
        for (const tile of tiles) {
            engine.spriteManager.addImage(name + "_" + tile, textureName, col * tileSize, row * tileSize);

            col ++;
            if (col >= width) {
                col -= width;
                row ++;
            }
        }
    }
}