import Actor from "./Actor";
import Tile from "./Tile";
import Extend from "../util/Extend";
import actorsBaseList from "../../json/actors/_base.json";
import enemiesList from "../../json/actors/enemies.json";
import heroList from "../../json/actors/hero.json";
import playerList from "../../json/actors/player.json";
import tilesBaseList from "../../json/tiles/_base.json";
import floorsList from "../../json/tiles/floors.json";
import stairsList from "../../json/tiles/stairs.json";
import wallsList from "../../json/tiles/walls.json";
import itemsBaseList from "../../json/items/_base.json";
import potionsList from "../../json/items/potions.json";
import Item from "./Item";

class EntityLoader {
    constructor() {
        this.types = new Map();
        this.templates = new Map();

        this.init();
    }

    init() {
        this.load(new Actor());
        this.load(new Tile());
        this.load(new Item());

        this.loadTemplates();
    }

    load(entity) {
        this.types.set(entity.type, entity);
    }

    create(json, args = {}) {
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
                return this.create(Extend.deep(template, parsedJson), args);
            } else {
                console.error("Json template for id '" + parsedJson.extends + "' is missing. Cannot extend from it.");
            }
        }

        const entity = this.types.get(parsedJson.type);
        return new entity.constructor(Extend.deep(parsedJson, args));
    }

    createFromTemplate(id, args = {}) {
        if (this.templates.has(id)) {
            return this.create(this.templates.get(id), args);
        } else {
            console.error("Json template for id '" + id + "' is missing.");
            return null;
        }
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
        this.loadTemplate(actorsBaseList);
        this.loadTemplate(enemiesList);
        this.loadTemplate(heroList);
        this.loadTemplate(playerList);

        this.loadTemplate(tilesBaseList);
        this.loadTemplate(floorsList);
        this.loadTemplate(stairsList);
        this.loadTemplate(wallsList);

        this.loadTemplate(itemsBaseList);
        this.loadTemplate(potionsList);
    }
}

const entityLoader = new EntityLoader();
export default entityLoader;