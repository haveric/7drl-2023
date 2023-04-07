import Actor from "../../game/entity/Actor";
import Tile from "./Tile";
import Extend from "../util/Extend";

import Item from "./Item";

class EntityLoader {
    constructor() {
        this.types = new Map();
        this.templates = new Map();
        this.loaded = false;

        this.init();
    }

    init() {
        this.load(new Actor());
        this.load(new Tile());
        this.load(new Item());

        this.loadTemplates();
    }

    load(entity) {
        this.types.set(entity.type.get(), entity);
    }

    create(json, components = {}) {
        let parsedJson;
        if (typeof json === "object") {
            parsedJson = json;
        } else {
            parsedJson = JSON.parse(json);
        }

        if (parsedJson.extends !== undefined) {
            if (this.templates.has(parsedJson.extends)) {
                const template = JSON.parse(this.templates.get(parsedJson.extends));

                delete parsedJson["extends"];
                return this.create(Extend.deep(template, parsedJson), components);
            } else {
                console.error("Json template for id '" + parsedJson.extends + "' is missing. Cannot extend from it.");
            }
        }

        const entity = this.types.get(parsedJson.type);
        return new entity.constructor(Extend.deep(parsedJson, components));
    }

    createFromTemplate(id, components = {}) {
        if (this.templates.has(id)) {
            return this.create(this.templates.get(id), components);
        } else {
            console.error("Json template for id '" + id + "' is missing.");
            return null;
        }
    }

    isLoaded() {
        return this.loaded;
    }

    loadTemplate(entities) {
        for (const entity of entities) {
            const id = entity.id;
            if (this.templates.has(id)) {
                console.error("Template for entity id '" + id + "' already exists.");
            } else {
                this.templates.set(id, JSON.stringify(entity));
            }
        }
    }

    loadTemplates() {
        const components = require.context("/src/json/entities/", true, /\.json$/, "eager");
        const numToLoad = components.keys().length;
        let numLoaded = 0;
        components.keys().forEach(filePath => {
            components(filePath).then(module => {
                this.loadTemplate(module);

                numLoaded ++;
                if (numLoaded === numToLoad) {
                    this.loaded = true;
                }
            });
        });
    }
}

const entityLoader = new EntityLoader();
export default entityLoader;