import engine from "./Engine";
import playerInfo from "./ui/PlayerInfo";
import viewInfo from "./ui/ViewInfo";
import messageConsole from "./ui/MessageConsole";
import details from "./ui/Details";

class SceneState {
    constructor() {
        this.setupGameHtml();

        this.resizeCanvas();
        window.addEventListener( "resize", this);
    }

    setupGameHtml() {
        const gameDom = document.createElement("div");
        gameDom.classList.add("game");

        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("view");

        gameDom.appendChild(this.canvas);

        playerInfo.open();
        viewInfo.open();
        messageConsole.open();
        details.open();

        playerInfo.appendTo(details.dom);
        viewInfo.appendTo(details.dom);
        messageConsole.appendTo(details.dom);
        details.appendTo(gameDom);

        document.body.appendChild(gameDom);

        this.ctx = this.canvas.getContext("2d");
    }

    handleEvent(e) {
        switch(e.type) {
            case "resize":
                this.resizeCanvas();

                break;
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth * .8;
        this.canvas.height = window.innerHeight;

        engine.needsRenderUpdate = true;
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const sceneState = new SceneState();
export default sceneState;
