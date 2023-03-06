import html from "../../html/ui/PlayerInfo.html";
import _UIElement from "./_UIElement";

class PlayerInfo extends _UIElement {
    constructor() {
        super(html);

        this.healthFgDom = this.dom.getElementsByClassName("player-health__fg")[0];
        this.healthTextDom = this.dom.getElementsByClassName("player-health__text")[0];
        this.powerDom = this.dom.getElementsByClassName("player-power")[0];
        this.defenseDom = this.dom.getElementsByClassName("player-defense")[0];
    }

    updateHealth(current, max) {
        const percent = current / max * 100;
        this.healthFgDom.style.width = percent + "%";
        this.healthTextDom.innerText = "HP: " + current + " / " + max;
    }

    updatePower(power) {
        this.powerDom.innerText = power;
    }

    updateDefense(defense) {
        this.defenseDom.innerText = defense;
    }
}

const playerInfo = new PlayerInfo();
export default playerInfo;