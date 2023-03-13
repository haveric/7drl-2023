import Extend from "../util/Extend";
import componentLoader from "../components/ComponentLoader";
import sceneState from "../SceneState";
import engine from "../Engine";

export default class _Entity {
    constructor(args) {
        this.args = args;
        this.type = args.type || "entity";
        this.id = args.id;
        this.name = args.name || "";
        this.description = args.description || "";
        this.sprite = args.sprite || "";
        this.letter = args.letter || "?";
        this.color = args.color || "#fff";

        this.componentArray = [];
        this.components = {};
        if (args.components) {
            this.loadComponents(args, args.components);
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
            engine.spriteManager.getImage(this.sprite).drawImage(sceneState.ctx, (position.x.get() + xTileOffset) * 64, (position.y.get() + yTileOffset) * 64);
        }
    }

    loadComponents(args, components) {
        const self = this;
        Object.keys(components).forEach(function(key) {
            const type = componentLoader.types.get(key);
            if (type) {
                const baseType = type.baseType;
                const existingComponent = self.getComponent(baseType);
                if (!existingComponent) {
                    self.setComponent(componentLoader.create(this, key, args), false);
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
        return this.args[name] || defaultValue;
    }


}