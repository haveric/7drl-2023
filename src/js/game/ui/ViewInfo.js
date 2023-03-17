import html from "../../../html/ui/ViewInfo.html";
import _UIElement from "../../engine/ui/_UIElement";

class ViewInfo extends _UIElement {
    constructor() {
        super(html);
    }

    updatePlayerDetails(player, playerMap) {
        const playerPosition = player.getComponent("position");
        const tile = playerMap.tiles[playerPosition.x.get()][playerPosition.y.get()];
        this.updatePositionDetails(tile);
    }

    getDetailsLine(innerText) {
        return "<span class='details__line'>" + innerText + "</span>";
    }

    updatePositionDetails(tile) {
        let text;
        if (tile.getComponent("fov")?.isExplored()) {
            text = this.getDetailsLine(tile.name);

        } else {
            text = this.getDetailsLine("You haven't explored here.");
        }

        this.dom.innerHTML = text;
    }
}

const viewInfo = new ViewInfo();
export default viewInfo;