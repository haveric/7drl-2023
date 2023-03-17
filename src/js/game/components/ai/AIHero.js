import _AI from "../../../engine/component/components/ai/_AI";
import HeroInfo from "../../ui/HeroInfo";
import Position from "../../../engine/renderer/tiled/components/Position";
import AdamMilazzoFov from "../../../engine/renderer/tiled/fov/AdamMilazzoFov";
import MathUtil from "../../../engine/util/MathUtil";
import MeleeAction from "../../actions/actionWithDirection/MeleeAction";
import WanderAction from "../../actions/WanderAction";
import Graph from "../../../engine/renderer/tiled/pathfinding/Graph";
import AStar from "../../../engine/renderer/tiled/pathfinding/AStar";
import BumpAction from "../../actions/actionWithDirection/BumpAction";
import WaitAction from "../../../engine/actions/WaitAction";
import InteractAction from "../../actions/InteractAction";
import Arg from "../../../engine/component/_arg/Arg";

export default class AIHero extends _AI {
    constructor(args = {}) {
        super(args, "aiHero");

        this.fov = new AdamMilazzoFov();
        this.chaseLocation = null;
        this.radius = this.addArg(new Arg("radius", 10));
        this.movementActions = this.addArg(new Arg("movementActions", 1));
        this.currentMovement = this.addArg(new Arg("currentMovement", 0));

        this.turnsToEnterDungeon = this.addArg(new Arg("turnsToEnterDungeon", 30));
        this.status = this.addArg(new Arg("status", "Hero will arrive in " + this.turnsToEnterDungeon.get() + " turns."));

        this.updateUIStatus();
    }

    decreaseTurnsToEnterDungeon() {
        this.turnsToEnterDungeon.set(this.turnsToEnterDungeon.get() - 1);
    }

    setStatus(newStatus) {
        this.status.set(newStatus);

        this.updateUIStatus();
    }

    updateUIStatus() {
        HeroInfo.updateStatus(this.status.get());
    }

    perform(gameMap) {
        const entity = this.parentEntity;

        if (this.turnsToEnterDungeon.get() > 0) {
            this.decreaseTurnsToEnterDungeon();
            this.setStatus("Hero will arrive in " + this.turnsToEnterDungeon.get() + " turns.");
        } else if (this.turnsToEnterDungeon.get() === 0) {
            entity.setComponent(new Position({components: {position: {x: 5, y: 0}}}));
            this.decreaseTurnsToEnterDungeon();

            this.setStatus("Hero has entered the dungeon!");
        } else {
            // TODO: Loot, Escape Room

            const entityPosition = entity.getComponent("position");
            if (entityPosition) {
                this.fov.compute(gameMap, entityPosition.x.get(), entityPosition.y.get(), this.radius.get());

                const closestEnemy = this.getClosestEnemy();
                if (closestEnemy) {
                    const closestEnemyPosition = closestEnemy.getComponent("position");
                    this.chaseLocation = {
                        x: closestEnemyPosition.x.get(),
                        y: closestEnemyPosition.y.get()
                    };

                    const distance = entityPosition.distanceTo(closestEnemyPosition);
                    if (distance <= 1) {
                        this.setStatus("Hero is fighting " + closestEnemy.name + "!");
                        return new MeleeAction(entity, closestEnemyPosition.x.get() - entityPosition.x.get(), closestEnemyPosition.y.get() - entityPosition.y.get()).perform(gameMap);
                    } else {
                        this.setStatus("Hero is moving to attack " + closestEnemy.name + ".");
                    }
                } else {
                    const closestStairs = this.getClosestStairs();
                    if (closestStairs) {
                        const closestStairsPosition = closestStairs.getComponent("position");
                        this.chaseLocation = {
                            x: closestStairsPosition.x.get(),
                            y: closestStairsPosition.y.get()
                        };

                        const distance = entityPosition.distanceTo(closestStairsPosition);
                        if (distance <= 0) {
                            this.setStatus("Hero is climbing down the stairs!");
                            return new InteractAction(entity).perform(gameMap);
                        } else {
                            this.setStatus("Hero is moving towards the stairs!");
                        }
                    }

                    if (this.chaseLocation !== null && entityPosition.isAt(this.chaseLocation.x, this.chaseLocation.y)) {
                        this.chaseLocation = null;
                    }

                    if (this.chaseLocation === null) {
                        this.setStatus("Hero is wandering aimlessly.");
                        return new WanderAction(entity).perform(gameMap);
                    }
                }

                return this.moveTowards(gameMap);
            }
        }
    }

    getClosestEnemy() {
        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("position");

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
                            const distance = entityPosition.distanceTo(actorPosition);

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

        if (closestEnemies.length === 1) {
            return closestEnemies[0];
        } else if (closestEnemies.length > 1) {
            const index = MathUtil.randomInt(0, closestEnemies.length - 1);
            return closestEnemies[index];
        }

        return null;
    }

    getClosestStairs() {
        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("position");

        let closestStairs = [];
        let closestDistance = null;
        for (const tile of this.fov.visibleTiles) {
            const interactable = tile.getComponent("interactable");
            if (interactable && interactable.type === "stairsInteractable") {
                const tilePosition = tile.getComponent("position");
                if (tilePosition) {
                    const distance = entityPosition.distanceTo(tilePosition);

                    if (closestDistance === null || distance < closestDistance) {
                        closestStairs = [];
                        closestStairs.push(tile);
                        closestDistance = distance;
                    } else if (distance === closestDistance) {
                        closestStairs.push(tile);
                    }
                }
            }
        }

        if (closestStairs.length === 1) {
            return closestStairs[0];
        } else if (closestStairs.length > 1) {
            const index = MathUtil.randomInt(0, closestStairs.length - 1);
            return closestStairs[index];
        }

        return null;
    }

    moveTowards(gameMap) {
        const entity = this.parentEntity;
        const entityPosition = entity.getComponent("position");

        this.currentMovement.set(this.movementActions.get());
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
                        lastAction = new BumpAction(entity, next.x + this.fov.left - entityPosition.x.get(), next.y + this.fov.top - entityPosition.y.get()).perform(gameMap);
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