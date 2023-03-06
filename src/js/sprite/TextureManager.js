import Texture from "./Texture";

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
}