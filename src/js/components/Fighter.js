import _Component from "./_Component";
import AIDead from "./ai/AIDead";
import messageManager from "../message/MessageManager";
import playerInfo from "../ui/PlayerInfo";

export default class Fighter extends _Component {
    constructor(args) {
        super(args, "fighter");

        this.hp = 0;
        this.maxHp = 0;
        this.defense = 0;
        this.power = 0;

        if (this.hasComponent()) {
            this.hp = this.loadArg("hp", 0);
            this.maxHp = this.loadArg("maxHp", 0);
            this.defense = this.loadArg("defense", 0);
            this.power = this.loadArg("power", 0);
        }
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            fighter: {}
        };

        saveJson.fighter.hp = this.hp;
        saveJson.fighter.maxHp = this.maxHp;
        saveJson.fighter.defense = this.defense;
        saveJson.fighter.power = this.power;

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
        if (this.isPlayer()) {
            messageManager.text("You died!", "#f00").build();
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

        this.clearSaveCache();
    }

    updateUI() {
        if (this.isPlayer()) {
            playerInfo.updateHealth(this.hp, this.maxHp);
            playerInfo.updatePower(this.power);
            playerInfo.updateDefense(this.defense);
        }
    }
}