import Extend from "../util/Extend";
import componentLoader from "../component/ComponentLoader";
import sceneState from "../SceneState";
import spriteManager from "../sprite/SpriteManager";
import Arg from "../arg/Arg";

export default class _Entity {
    constructor(json) {
        this.json = json;
        this.args = [];

        this.type = this.addArg(new Arg("type", "entity"));
        this.id = this.addArg(new Arg("id"));
        this.name = this.addArg(new Arg("name"), "");
        this.description = this.addArg(new Arg("description", ""));
        this.sprite = this.addArg(new Arg("sprite", ""));
        this.letter = this.addArg(new Arg("letter", "?"));
        this.color = this.addArg(new Arg("color", "#fff"));

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
            spriteManager.getImage(this.sprite.get()).drawImage(sceneState.ctx, (position.x.get() + xTileOffset) * 64, (position.y.get() + yTileOffset) * 64);
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

        const saveJson = {};
        for (const arg of this.args) {
            arg.save(saveJson);
        }

        saveJson.components = {};
        for (const component of this.componentArray) {
            const save = component.save();
            if (save !== null && save !== {}) {
                Extend.deep(saveJson.components, save);
            }
        }

        this.cachedSave = saveJson;
        return saveJson;
    }

    addArg(arg) {
        arg.setParentComponentOrEntity(this);
        this.args.push(arg);

        arg.load(this.json);

        return arg;
    }
}