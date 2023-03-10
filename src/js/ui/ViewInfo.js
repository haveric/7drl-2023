import html from "../../html/ui/ViewInfo.html";
import _UIElement from "./_UIElement";

class ViewInfo extends _UIElement {
    constructor() {
        super(html);
    }

    updatePlayerDetails(player, playerMap) {
        const playerPosition = player.getComponent("position");
        const tile = playerMap.tiles[playerPosition.x][playerPosition.y];
        this.updatePositionDetails(tile);
    }

    getDetailsLine(innerText) {
        return "<span class='details__line'>" + innerText + "</span>";
    }

    updatePositionDetails(tile) {
        let text;
        const tileFov = tile.getComponent("fov");
        if (tileFov && tileFov.explored) {
            text = this.getDetailsLine(tile.name);

        } else {
            text = this.getDetailsLine("You haven't explored here.");
        }

        this.dom.innerHTML = text;
    }
}

const viewInfo = new ViewInfo();
export default viewInfo;