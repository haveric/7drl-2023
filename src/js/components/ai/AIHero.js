import _AI from "./_AI";
import HeroInfo from "../../ui/HeroInfo";
import Position from "../Position";
import AdamMilazzoFov from "../../map/fov/AdamMilazzoFov";
import MathUtil from "../../util/MathUtil";
import MeleeAction from "../../actions/actionWithDirection/MeleeAction";
import WanderAction from "../../actions/WanderAction";
import Graph from "../../pathfinding/Graph";
import AStar from "../../pathfinding/AStar";
import BumpAction from "../../actions/actionWithDirection/BumpAction";
import WaitAction from "../../actions/WaitAction";

export default class AIHero extends _AI {
    constructor(args = {}) {
        super(args, "aiHero");

        this.fov = new AdamMilazzoFov();
        this.chaseLocation = null;
        this.radius = 10;
        this.movementActions = 1;
        this.currentMovement = 0;

        this.turnsToEnterDungeon = 30;
        this.status = "Hero will arrive in " + this.turnsToEnterDungeon + " turns.";

        if (this.hasComponent()) {
            this.radius = this.loadArg("radius", 10);
            this.movementActions = this.loadArg("movementActions", 1);
            this.currentMovement = this.loadArg("currentMovement", 0);
            this.turnsToEnterDungeon = this.loadArg("turnsToEnterDungeon", 30);
            this.status = this.loadArg("status", "Hero will arrive in " + this.turnsToEnterDungeon + " turns.");
        }

        this.updateUIStatus();
    }

    save() {
        if (this.cachedSave) {
            return this.cachedSave;
        }

        const saveJson = {
            aiHero: {}
        };

        if (this.radius !== 10) {
            saveJson.aiHero.radius = this.radius;
        }

        if (this.movementActions !== 1) {
            saveJson.aiHero.movementActions = this.movementActions;
        }

        if (this.currentMovement !== 0) {
            saveJson.aiHero.currentMovement = this.currentMovement;
        }

        saveJson.aiHero.turnsToEnterDungeon = this.turnsToEnterDungeon;
        saveJson.aiHero.status = this.status;

        this.cachedSave = saveJson;
        return saveJson;
    }

    decreaseTurnsToEnterDungeon() {
        this.turnsToEnterDungeon --;

        this.clearSaveCache();
    }

    setStatus(newStatus) {
        this.status = newStatus;

        this.updateUIStatus();
        this.clearSaveCache();
    }

    updateUIStatus() {
        HeroInfo.updateStatus(this.status);
    }

    perform(gameMap) {
        const entity = this.parentEntity;

        if (this.turnsToEnterDungeon > 0) {
            this.decreaseTurnsToEnterDungeon();
            this.setStatus("Hero will arrive in " + this.turnsToEnterDungeon + " turns.");
        } else if (this.turnsToEnterDungeon === 0) {
            entity.setComponent(new Position({components: {position: {x: 5, y: 0}}}));
            this.decreaseTurnsToEnterDungeon();

            this.setStatus("Hero has entered the dungeon!");
        } else {
            // TODO: Loot, Escape Room

            const entityPosition = entity.getComponent("position");
            if (entityPosition) {
                this.fov.compute(gameMap, entityPosition.x, entityPosition.y, this.radius);

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
                                    const dx = Math.abs(actorPosition.x - entityPosition.x);
                                    const dy = Math.abs(actorPosition.y - entityPosition.y);
                                    const distance = Math.max(dx, dy);

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
                        x: closestEnemyPosition.x,
                        y: closestEnemyPosition.y
                    };

                    if (closestDistance <= 1) {
                        return new MeleeAction(entity, closestEnemyPosition.x - entityPosition.x, closestEnemyPosition.y - entityPosition.y).perform(gameMap);
                    }
                } else {
                    if (this.chaseLocation !== null && this.chaseLocation.x === entityPosition.x && this.chaseLocation.y === entityPosition.y) {
                        this.chaseLocation = null;
                    }

                    if (this.chaseLocation === null) {
                        return new WanderAction(entity).perform(gameMap);
                    }
                }

                this.currentMovement += this.movementActions;

                if (this.currentMovement >= 1) {
                    // Move towards enemy
                    const fovWidth = this.fov.right - this.fov.left;
                    const fovHeight = this.fov.bottom - this.fov.top;
                    const cost = Array(fovWidth).fill().map(() => Array(fovHeight).fill(0));

                    for (let i = this.fov.left; i < this.fov.right; i++) {
                        for (let j = this.fov.top; j < this.fov.bottom; j++) {
                            const tile = gameMap.tiles[i][j];
                            if (tile) {
                                const blocksMovementComponent = tile.getComponent("blocksMovement");
                                if (blocksMovementComponent && blocksMovementComponent.blocksMovement) {
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
                                cost[actorPosition.x - this.fov.left][actorPosition.y - this.fov.top] += 100;
                            }
                        }
                    }

                    const costGraph = new Graph(cost, {diagonal: true});

                    const start = costGraph.grid[entityPosition.x - this.fov.left][entityPosition.y - this.fov.top];
                    const end = costGraph.grid[this.chaseLocation.x - this.fov.left][this.chaseLocation.y - this.fov.top];
                    const path = AStar.search(costGraph, start, end);
                    let lastAction;
                    while (this.currentMovement >= 1) {
                        if (path && path.length > 0) {
                            const next = path.shift();
                            if (next) {
                                lastAction = new BumpAction(entity, next.x + this.fov.left - entityPosition.x, next.y + this.fov.top - entityPosition.y).perform(gameMap);
                            }
                        } else {
                            lastAction = new WaitAction(entity).perform(gameMap);
                        }

                        this.currentMovement -= 1;
                    }

                    return lastAction;
                }
            }
        }
    }
}