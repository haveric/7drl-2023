import AIDead from "./ai/AIDead";
import AIHero from "./ai/AIHero";
import AIMeleeChase from "./ai/AIMeleeChase";
import StairsInteractable from "./interactable/StairsInteractable";
import TrapDoorInteractable from "./interactable/TrapDoorInteractable";
import BlocksFov from "./BlocksFov";
import BlocksMovement from "./BlocksMovement";
import Cleanable from "./Cleanable";
import Faction from "./Faction";
import Fighter from "./Fighter";
import Fov from "./Fov";
import Position from "./Position";
// import HealingConsumable from "./consumable/HealingConsumable";

class ComponentLoader {
    constructor() {
        this.types = new Map();

        this.init();
    }

    init() {
        this.load(new AIDead());
        this.load(new AIHero());
        this.load(new AIMeleeChase());

        this.load(new StairsInteractable());
        this.load(new TrapDoorInteractable());
        //
        // this.load(new HealingConsumable());
        //
        this.load(new BlocksFov());
        this.load(new BlocksMovement());
        this.load(new Cleanable());
        this.load(new Faction());
        this.load(new Fighter());
        this.load(new Fov());
        this.load(new Position());
    }

    load(component) {
        this.types.set(component.type, component);
    }

    create(entity, type, args) {
        const component = this.types.get(type);
        const constructor = component.constructor;
        return new constructor(args);
    }
}

const componentLoader = new ComponentLoader();
export default componentLoader;