import Renderer from "./renderer/Renderer";

class SceneState {
    constructor() {
        this.setupGameHtml();

        this.scale = 1;
        this.needsRenderUpdate = false;
        this.renderer = new Renderer();

        window.addEventListener( "resize", this);
    }

    setupGameHtml() {
        this.gameDom = document.createElement("div");
        this.gameDom.classList.add("game");

        this.canvas = document.createElement("canvas");
        this.canvas.classList.add("view");

        this.gameDom.appendChild(this.canvas);

        document.body.appendChild(this.gameDom);

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
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const xScale = this.canvas.width / 2560;
        const yScale = this.canvas.height / 1440;

        this.scale = Math.min(xScale, yScale);
        this.needsRenderUpdate = true;
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const sceneState = new SceneState();
export default sceneState;
