import engine from "../Engine";

export default class _Action {
    constructor(entity) {
        this.entity = entity;
    }

    /**
     * @returns {_Action}
     */
    perform() {
        console.error("Not Implemented");
    }

    isPlayer() {
        return this.entity === engine.player;
    }
}