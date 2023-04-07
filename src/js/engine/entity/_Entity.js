import Extend from "../util/Extend";
import componentLoader from "../component/ComponentLoader";
import sceneState from "../SceneState";
import spriteManager from "../sprite/SpriteManager";

export default class _Entity {
    constructor(json) {
        this.json = json;
        this.type = json.type || "entity";
        this.id = json.id;
        this.name = json.name || "";
        this.description = json.description || "";
        this.sprite = json.sprite || "";
        this.letter = json.letter || "?";
        this.color = json.color || "#fff";

        this.componentArray = [];
        this.components = {};
        if (json.components) {
            this.loadComponents(json, json.components);
            this.callEvent("onComponentsLoaded");
        }

        this.cachedSave = null;
    }

    /**
     * @returns {_Entity}
     */
    clone() {
        console.error("Not implemented");
    }

    callEvent(event, args) {
        for (const component of this.componentArray) {
            component[event]?.(args);
        }

        this[event]?.(args);
    }

    draw(xTileOffset, yTileOffset) {
        const position = this.getComponent("position");
        if (position) {
            spriteManager.getImage(this.sprite).drawImage(sceneState.ctx, (position.x.get() + xTileOffset) * 64, (position.y.get() + yTileOffset) * 64);
        }
    }

    loadComponents(json, components) {
        const self = this;
        Object.keys(components).forEach(function(key) {
            const type = componentLoader.types.get(key);
            if (type) {
                const baseType = type.baseType;
                const existingComponent = self.getComponent(baseType);
                if (!existingComponent) {
                    self.setComponent(componentLoader.create(this, key, json), false);
                }
            }
        });
    }

    setComponent(component) {
        component.parentEntity = this;
        this.components[component.baseType] = component;
        this.componentArray.push(component);

    }

    getComponent(baseType) {
        return this.components[baseType];
    }

    removeComponent(baseType) {
        if (!this.components[baseType]) {
            return;
        }

        this.components[baseType] = undefined;
        for (const component of this.componentArray) {
            if (component.baseType === baseType) {
                const index = this.componentArray.indexOf(component);
                this.componentArray.splice(index, 1);
                break;
            }
        }
    }

    clearSaveCache() {
        this.cachedSave = null;
    }

    save() {
        if (this.cachedSave !== null) {
            return this.cachedSave;
        }

        const json = {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            sprite: this.sprite,
            letter: this.letter,
            color: this.color
        };

        json.components = {};
        for (const component of this.componentArray) {
            const save = component.save();
            if (save !== null && save !== {}) {
                Extend.deep(json.components, save);
            }
        }

        this.cachedSave = json;
        return json;
    }

    loadArg(name, defaultValue) {
        return this.json[name] || defaultValue;
    }


}