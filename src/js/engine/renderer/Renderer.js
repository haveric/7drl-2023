import componentLoader from "../component/ComponentLoader";

export default class Renderer {
    constructor() {
        this.componentsLoaded = false;
        this.preloadComponents();
    }


    preloadComponents() {
        const components = require.context("/src/js/engine/renderer/tiled/components", true, /\.js$/, "eager");
        let numToLoad = components.keys().length;
        let numLoaded = 0;
        components.keys().forEach(filePath => {
            if (filePath.indexOf("_") !== -1) {
                numToLoad --;

                if (numLoaded === numToLoad) {
                    this.componentsLoaded = true;
                }
                return;
            }
            components(filePath).then(module => {
                const constructor = module.default;

                // Skip frozen objects (such as enums)
                if (constructor.constructor.isFrozen) {
                    numLoaded ++;
                    return;
                }

                componentLoader.load(new constructor());

                numLoaded ++;
                if (numLoaded === numToLoad) {
                    this.componentsLoaded = true;
                }
            });
        });
    }
}