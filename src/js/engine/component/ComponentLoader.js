class ComponentLoader {
    constructor() {
        this.types = new Map();

        this.componentsLoaded = false;
    }

    preloadComponents() {
        const components = require.context("./components", true, /\.js$/, "eager");
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

    load(component) {
        this.types.set(component.type, component);
    }

    create(entity, type, args) {
        const component = this.types.get(type);
        const constructor = component.constructor;
        return new constructor(args);
    }
}

const componentLoader = new ComponentLoader();
export default componentLoader;