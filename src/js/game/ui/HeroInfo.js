import html from "../../../html/ui/HeroInfo.html";
import _UIElement from "../../engine/ui/_UIElement";

class HeroInfo extends _UIElement {
    constructor() {
        super(html);

        this.statusMessageDom = this.dom.getElementsByClassName("hero-status__message")[0];
        this.healthFgDom = this.dom.getElementsByClassName("hero-health__fg")[0];
        this.healthTextDom = this.dom.getElementsByClassName("hero-health__text")[0];
        this.powerDom = this.dom.getElementsByClassName("hero-power")[0];
        this.defenseDom = this.dom.getElementsByClassName("hero-defense")[0];
        this.inventoryDom = this.dom.getElementsByClassName("hero-inventory")[0];
    }

    updateStatus(status) {
        this.statusMessageDom.innerText = status;
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

    updateInventory() {

    }
}

const heroInfo = new HeroInfo();
export default heroInfo;