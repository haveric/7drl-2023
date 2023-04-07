import componentLoader from "../component/ComponentLoader";

export default class Renderer {
    constructor() {
        this.preloadComponents();
    }

    preloadComponents() {
        const components = require.context("/src/js/engine/renderer/tiled/components", true, /\.js$/, "eager");
        componentLoader.preloadComponents("renderer", components);
    }
}