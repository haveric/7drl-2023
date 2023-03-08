import engine from "../Engine";

export default class Sprite {
    constructor(imageName, textureName, x, y, w, h) {
        this.imageName = imageName;
        this.textureName = textureName;
        this.texture = engine.textureManager.getTexture(textureName);
        this.x = x;
        this.y = y;
        this.w = w || 64;
        this.h = h || 64;
    }

    loadTexture() {
        if (this.texture === null) {
            this.texture = engine.textureManager.getTexture(this.textureName);
        }

        return this.texture !== null;
    }

    drawImage(context, i, j, degrees) {
        if (degrees !== null && degrees > 0) {
            context.save();
            context.translate(i+this.w/2, j+this.h/2);
            context.rotate(degrees * Math.PI / 180);

            context.drawImage(this.texture, this.x, this.y, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);

            context.restore();
        } else {
            context.drawImage(this.texture, this.x, this.y, this.w, this.h, i * engine.xScale, j * engine.yScale, this.w * engine.xScale, this.h * engine.yScale);
        }
    }
}