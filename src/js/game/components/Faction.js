import _Component from "../../engine/component/_Component";
import ArgSimpleArray from "../../engine/arg/ArgSimpleArray";

export default class Faction extends _Component {
    constructor(json = {}) {
        super(json, "faction");

        this.factions = this.addArg(new ArgSimpleArray("factions"));
        this.enemies = this.addArg(new ArgSimpleArray("enemies"));
    }

    /**
     *
     * @param {Faction} otherFaction
     */
    isEnemyOf(otherFaction) {
        if (!otherFaction) {
            return false;
        }

        for (const faction of this.factions.get()) {
            if (otherFaction.enemies.get().indexOf(faction) > -1) {
                return true;
            }
        }

        return false;
    }
}