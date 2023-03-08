import _AI from "./_AI";
import HeroInfo from "../../ui/HeroInfo";
import Position from "../Position";

export default class AIHero extends _AI {
    constructor(args = {}) {
        super(args, "aiHero");

        this.turnsToEnterDungeon = 30;
        this.status = "Hero will arrive in " + this.turnsToEnterDungeon + " turns.";

        if (this.hasComponent()) {
            this.turnsToEnterDungeon = this.loadArg("turnsToEnterDungeon", 30);
            this.status = this.loadArg("status", "Hero will arrive in " + this.turnsToEnterDungeon + " turns.");
        }

        this.updateUIStatus();
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            aiHero: {}
        };

        saveJson.aiHero.turnsToEnterDungeon = this.turnsToEnterDungeon;
        saveJson.aiHero.status = this.status;

        this.cachedSave = saveJson;
        return saveJson;
    }

    decreaseTurnsToEnterDungeon() {
        this.turnsToEnterDungeon --;

        this.clearSaveCache();
    }

    setStatus(newStatus) {
        this.status = newStatus;

        this.updateUIStatus();
        this.clearSaveCache();
    }

    updateUIStatus() {
        HeroInfo.updateStatus(this.status);
    }

    perform() {
        if (this.turnsToEnterDungeon > 0) {
            this.decreaseTurnsToEnterDungeon();
            this.setStatus("Hero will arrive in " + this.turnsToEnterDungeon + " turns.");
        } else if (this.turnsToEnterDungeon === 0) {
            this.parentEntity.setComponent(new Position({components: {position: {x: 5, y: 0}}}));
            this.decreaseTurnsToEnterDungeon();

            this.setStatus("Hero has entered the dungeon!");
        } else {
            // TODO: Attack Enemies, Loot, Escape Room
        }
    }
}