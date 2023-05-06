import _Component from "../../engine/component/_Component";
import AIDead from "../../engine/component/components/ai/AIDead";
import messageManager from "../../engine/message/MessageManager";
import playerInfo from "../ui/PlayerInfo";
import MathUtil from "../../engine/util/MathUtil";
import heroInfo from "../ui/HeroInfo";
import engine from "../Engine";
import Arg from "../../engine/arg/Arg";

export default class Fighter extends _Component {
    constructor(json) {
        super(json, "fighter");

        this.baseHp = this.addArg(new Arg("baseHp", 0));
        this.hp = this.addArg(new Arg("hp", null));
        this.baseDefense = this.addArg(new Arg("baseDefense", 0));
        this.baseDamage = this.addArg(new Arg("baseDamage", 0));

        this.minDamage = 0;
        this.maxDamage = 0;
        this.defense = 0;
    }

    setHp(newHp) {
        this.hp.set(Math.max(0, Math.min(newHp, this.maxHp)));
        this.updateUI();
    }

    heal(amount) {
        if (this.hp.get() === this.maxHp) {
            return 0;
        }

        const newHp = Math.min(this.maxHp, this.hp.get() + amount);
        const healedHp = newHp - this.hp.get();
        this.setHp(newHp);

        return healedHp;
    }

    takeDamage(damage) {
        this.setHp(this.hp.get() - damage);

        if (this.hp.get() <= 0) {
            this.die();
        }
    }

    die() {
        const entity = this.parentEntity;
        if (engine.isPlayer(this.parentEntity)) {
            messageManager.text("You died!", "#f00").build();
        } else if (this.parentEntity.id.get() === "hero") {
            messageManager.text(entity.name.get() + " dies!", "#ffa030").build();
            messageManager.text("You managed to keep the hero alive for " + engine.heroMap.level + " levels!", "#ffa030").build();
            // TODO: Game Over
        } else {
            messageManager.text(entity.name.get() + " dies!", "#ffa030").build();
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

        entity.sprite.set("rltiles_corpse");
        entity.name.set("Corpse of " + this.name);

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
        const statHp = this.baseHp.get();

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
        if (this.hp.get() === null || this.hp >= this.maxHp) {
            this.hp.set(newMax);
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
        const statDamage = this.baseDamage.get();

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
        const statDefense = this.baseDefense.get();

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
            playerInfo.updateHealth(this.hp.get(), this.maxHp);
            playerInfo.updatePower(this.getDamageDisplay());
            playerInfo.updateDefense(this.defense);
        } else if (this.parentEntity.id.get() === "hero") {
            heroInfo.updateHealth(this.hp.get(), this.maxHp);
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