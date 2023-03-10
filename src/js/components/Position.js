import _Component from "./_Component";

export default class Position extends _Component {
    constructor(args = {}) {
        super(args, "position");

        this.x = 0;
        this.y = 0;

        if (this.hasComponent()) {
            this.x = this.loadArg("x", 0);
            this.y = this.loadArg("y", 0);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            position: {}
        };

        saveJson.position.x = this.x;
        saveJson.position.y = this.y;

        this.cachedSave = saveJson;
        return saveJson;
    }

    moveTo(newX, newY) {
        this.x = newX;
        this.y = newY;

        this.clearSaveCache();
    }

    move(xOffset, yOffset) {
        this.x += xOffset;
        this.y += yOffset;

        this.clearSaveCache();
    }

    setX(newX) {
        this.x = newX;
        this.clearSaveCache();
    }

    setY(newY) {
        this.y = newY;
        this.clearSaveCache();
    }

    distanceTo(position) {
        const dx = Math.abs(position.x - this.x);
        const dy = Math.abs(position.y - this.y);

        return Math.max(dx, dy);
    }
}