import Sprite from "./Sprite";

export default class SpriteManager {
    constructor() {
        this.sprites = [];
        this.spritesPreloaded = false;
    }

    addImage(imageName, textureName, x, y, w, h) {
        this.sprites.push(new Sprite(imageName, textureName, x, y, w, h));
    }

    getImage(imgName) {
        const length = this.sprites.length;
        for (let i = 0; i < length; i++) {
            if (this.sprites[i].imageName === imgName) {
                return this.sprites[i];
            }
        }
        return null;
    }

    preloadSprites() {
        if (!this.spritesPreloaded) {
            const numSprites = this.sprites.length;
            let numLoaded = 0;

            this.sprites.forEach(function(sprite) {
                if (sprite.loadTexture()) {
                    numLoaded ++;
                }
            });

            if (numLoaded === numSprites) {
                this.spritesPreloaded = true;
            }
        }

        return this.spritesPreloaded;
    }
}