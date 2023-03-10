import _Component from "./_Component";
import AIDead from "./ai/AIDead";
import messageManager from "../message/MessageManager";
import playerInfo from "../ui/PlayerInfo";
import MathUtil from "../util/MathUtil";
import heroInfo from "../ui/HeroInfo";
import engine from "../Engine";

export default class Fighter extends _Component {
    constructor(args) {
        super(args, "fighter");

        this.baseHp = 0;
        this.hp = null;
        this.baseDefense = 0;
        this.baseDamage = 0;

        if (this.hasComponent()) {
            this.baseHp = this.loadArg("baseHp", 0);
            this.hp = this.loadArg("hp", null);
            this.baseDefense = this.loadArg("baseDefense", 0);
            this.baseDamage = this.loadArg("baseDamage", 0);
        }

        this.minDamage = 0;
        this.maxDamage = 0;
        this.defense = 0;
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            fighter: {}
        };

        saveJson.fighter.baseHp = this.baseHp;
        saveJson.fighter.hp = this.hp;
        saveJson.fighter.maxHp = this.maxHp;
        saveJson.fighter.baseDefense = this.baseDefense;
        saveJson.fighter.baseDamage = this.baseDamage;

        this.cachedSave = saveJson;
        return saveJson;
    }

    setHp(newHp) {
        this.hp = Math.max(0, Math.min(newHp, this.maxHp));
        this.updateUI();
        this.clearSaveCache();
    }

    heal(amount) {
        if (this.hp === this.maxHp) {
            return 0;
        }

        const newHp = Math.min(this.maxHp, this.hp + amount);
        const healedHp = newHp - this.hp;
        this.setHp(newHp);

        return healedHp;
    }

    takeDamage(damage) {
        this.setHp(this.hp - damage);

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        const entity = this.parentEntity;
        if (engine.isPlayer(this.parentEntity)) {
            messageManager.text("You died!", "#f00").build();
        } else if (this.parentEntity.id === "hero") {
            messageManager.text(entity.name + " dies!", "#ffa030").build();
            messageManager.text("You managed to keep the hero alive for " + engine.heroMap.level + " levels!", "#ffa030").build();
            // TODO: Game Over
        } else {
            messageManager.text(entity.name + " dies!", "#ffa030").build();
        }

        entity.callEvent("onEntityDeath");

        const ai = entity.getComponent("ai");
        if (ai) {
            const aiArgs = {
                components: {
                    aiDead: {
                        previousAI: ai.type
                    }
                }
            };

            entity.removeComponent("ai");
            entity.setComponent(new AIDead(aiArgs));
        }

        entity.sprite = "rltiles_corpse";
        entity.name = "Corpse of " + this.name;

        this.clearSaveCache();
    }

    getDamage() {
        if (this.minDamage === this.maxDamage) {
            return this.minDamage;
        } else {
            return MathUtil.randomInt(this.minDamage, this.maxDamage);
        }
    }

    getDamageDisplay() {
        if (this.minDamage === this.maxDamage) {
            return this.minDamage;
        } else {
            return this.minDamage + " - " + this.maxDamage;
        }
    }

    getBlockedDamage() {
        return Math.floor(MathUtil.randomNumber(this.defense / 10, this.defense) / 10);
    }

    getMaxHp() {
        const statHp = this.baseHp;

        let equipmentHp = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentHp += equippable.health;
            }
        }

        return statHp + equipmentHp;
    }

    recalculateStats(clear = true) {
        const newMax = this.getMaxHp();
        if (this.hp === null || this.hp >= this.maxHp) {
            this.hp = newMax;
        }
        this.maxHp = newMax;

        this.calculateDamage();
        this.calculateDefense();

        this.updateUI();

        if (clear) {
            this.clearSaveCache();
        }
    }

    calculateDamage() {
        const statDamage = this.baseDamage;

        let equipmentMinDamage = 0;
        let equipmentMaxDamage = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentMinDamage += equippable.minDamage;
                equipmentMaxDamage += equippable.maxDamage;
            }
        }

        this.minDamage = statDamage + equipmentMinDamage;
        this.maxDamage = Math.floor(statDamage * 1.5) + equipmentMaxDamage;
    }

    calculateDefense() {
        const statDefense = this.baseDefense;

        let equipmentDefense = 0;
        const equipment = this.parentEntity.getComponent("equipment");
        if (equipment) {
            const equippables = equipment.getEquippables();
            for (const equippable of equippables) {
                equipmentDefense += equippable.defense;
            }
        }

        this.defense = statDefense + equipmentDefense;
    }


    updateUI() {
        if (engine.isPlayer(this.parentEntity)) {
            playerInfo.updateHealth(this.hp, this.maxHp);
            playerInfo.updatePower(this.getDamageDisplay());
            playerInfo.updateDefense(this.defense);
        } else if (this.parentEntity.id === "hero") {
            heroInfo.updateHealth(this.hp, this.maxHp);
            heroInfo.updatePower(this.getDamageDisplay());
            heroInfo.updateDefense(this.defense);
        }
    }

    onComponentsLoaded() {
        this.recalculateStats(false);
    }

    onEquipmentChange() {
        this.recalculateStats();
    }
}