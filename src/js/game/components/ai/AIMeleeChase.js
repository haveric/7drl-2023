import AI from "../../../engine/component/components/ai/_AI";
import AdamMilazzoFov from "../../../engine/renderer/tiled/fov/AdamMilazzoFov";
import WanderAction from "../../actions/WanderAction";
import MeleeAction from "../../actions/actionWithDirection/MeleeAction";
import AStar from "../../../engine/renderer/tiled/pathfinding/AStar";
import Graph from "../../../engine/renderer/tiled/pathfinding/Graph";
import WaitAction from "../../../engine/actions/WaitAction";
import BumpAction from "../../actions/actionWithDirection/BumpAction";
import MathUtil from "../../../engine/util/MathUtil";
import Arg from "../../../engine/arg/Arg";

export default class AIMeleeChase extends AI {
    constructor(json = {}) {
        super(json, "aiMeleeChase");

        this.fov = new AdamMilazzoFov();
        this.chaseLocation = null;
        this.radius = this.addArg(new Arg("radius", 5));
        this.movementActions = this.addArg(new Arg("movementActions", 1));
        this.currentMovement = this.addArg(new Arg("currentMovement", 0));
    }

    perform(gameMap) {
        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("position");
        if (entityPosition) {
            this.fov.compute(gameMap, entityPosition.x.get(), entityPosition.y.get(), this.radius.get());

            let closestEnemies = [];
            let closestDistance = null;
            const entityFaction = entity.getComponent("faction");
            if (entityFaction) {
                for (const actor of this.fov.visibleActors) {
                    if (actor.isAlive()) {
                        const actorFaction = actor.getComponent("faction");
                        if (entityFaction.isEnemyOf(actorFaction)) {
                            const actorPosition = actor.getComponent("position");

                            if (actorPosition) {
                                const distance = actorPosition.distanceTo(entityPosition);
                                if (closestDistance === null || distance < closestDistance) {
                                    closestEnemies = [];
                                    closestEnemies.push(actor);
                                    closestDistance = distance;
                                } else if (distance === closestDistance) {
                                    closestEnemies.push(actor);
                                }
                            }
                        }
                    }
                }
            }

            let closestEnemy;
            if (closestEnemies.length === 1) {
                closestEnemy = closestEnemies[0];
            } else if (closestEnemies.length > 1) {
                const index = MathUtil.randomInt(0, closestEnemies.length - 1);
                closestEnemy = closestEnemies[index];
            }

            if (closestEnemy) {
                const closestEnemyPosition = closestEnemy.getComponent("position");
                this.chaseLocation = {
                    x: closestEnemyPosition.x.get(),
                    y: closestEnemyPosition.y.get()
                };

                if (closestDistance <= 1) {
                    return new MeleeAction(entity, closestEnemyPosition.x.get() - entityPosition.x.get(), closestEnemyPosition.y.get() - entityPosition.y.get()).perform(gameMap);
                }
            } else {
                if (this.chaseLocation !== null && entityPosition.isAt(this.chaseLocation.x, this.chaseLocation.y)) {
                    this.chaseLocation = null;
                }

                if (this.chaseLocation === null) {
                    return new WanderAction(entity).perform(gameMap);
                }
            }

            this.currentMovement.set(this.currentMovement.get() + this.movementActions.get());

            if (this.currentMovement.get() >= 1) {
                // Move towards enemy
                const fovWidth = this.fov.right - this.fov.left;
                const fovHeight = this.fov.bottom - this.fov.top;
                const cost = Array(fovWidth).fill().map(() => Array(fovHeight).fill(0));

                for (let i = this.fov.left; i < this.fov.right; i++) {
                    for (let j = this.fov.top; j < this.fov.bottom; j++) {
                        const tile = gameMap.tiles[i][j];
                        if (tile) {
                            if (tile.getComponent("blocksMovement")?.blocksMovement.get()) {
                                continue;
                            }

                            cost[i - this.fov.left][j - this.fov.top] += 10;
                        }
                    }
                }

                for (const actor of this.fov.visibleActors) {
                    if (actor.isAlive()) {
                        const actorPosition = actor.getComponent("position");
                        if (actorPosition) {
                            cost[actorPosition.x.get() - this.fov.left][actorPosition.y.get() - this.fov.top] += 100;
                        }
                    }
                }

                const costGraph = new Graph(cost, {diagonal: true});

                const start = costGraph.grid[entityPosition.x.get() - this.fov.left][entityPosition.y.get() - this.fov.top];
                const end = costGraph.grid[this.chaseLocation.x - this.fov.left][this.chaseLocation.y - this.fov.top];
                const path = AStar.search(costGraph, start, end);
                let lastAction;
                while (this.currentMovement.get() >= 1) {
                    if (path && path.length > 0) {
                        const next = path.shift();
                        if (next) {
                            lastAction = new BumpAction(entity, next.x + this.fov.left - entityPosition.x, next.y + this.fov.top - entityPosition.y).perform(gameMap);
                        }
                    } else {
                        lastAction = new WaitAction(entity).perform(gameMap);
                    }

                    this.currentMovement.set(this.currentMovement.get() - 1);
                }

                return lastAction;
            }
        }
    }
}