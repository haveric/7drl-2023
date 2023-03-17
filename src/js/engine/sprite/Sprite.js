import sceneState from "../SceneState";
import textureManager from "./TextureManager";

export default class Sprite {
    constructor(imageName, textureName, x, y, w, h) {
        this.imageName = imageName;
        this.textureName = textureName;
        this.texture = textureManager.getTexture(textureName);
        this.x = x;
        this.y = y;
        this.w = w || 64;
        this.h = h || 64;
    }

    loadTexture() {
        if (this.texture === null) {
            this.texture = textureManager.getTexture(this.textureName);
        }

        return this.texture !== null;
    }

    drawImage(context, i, j, degrees) {
        if (degrees !== null && degrees > 0) {
            context.save();
            context.translate((i+this.w/2) * sceneState.scale, (j+this.h/2) * sceneState.scale);
            context.rotate(degrees * Math.PI / 180);

            context.drawImage(this.texture, this.x, this.y, this.w, this.h, (-this.w/2) * sceneState.scale, (-this.h/2) * sceneState.scale, this.w * sceneState.scale, this.h * sceneState.scale);

            context.restore();
        } else {
            context.drawImage(this.texture, this.x, this.y, this.w, this.h, i * sceneState.scale, j * sceneState.scale, this.w * sceneState.scale, this.h * sceneState.scale);
        }
    }
}