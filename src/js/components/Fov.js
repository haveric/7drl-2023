import _Component from "./_Component";

export default class Fov extends _Component {
    constructor(args) {
        super(args, "fov");

        this.explored = false;
        this.visible = false;

        if (this.hasComponent()) {
            this.explored = this.loadArg("explored", false);
            this.visible = this.loadArg("visible", false);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            fov: {}
        };

        if (this.explored !== false) {
            saveJson.fov.explored = this.explored;
        }

        if (this.visible !== false) {
            saveJson.fov.visible = this.visible;
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    setExplored(explored) {
        this.explored = explored;
        this.clearSaveCache();
    }

    setVisible(visible) {
        this.visible = visible;
    }
}