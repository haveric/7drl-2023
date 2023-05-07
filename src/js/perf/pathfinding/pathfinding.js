import { Bench } from "tinybench";
import Graph from "../../engine/renderer/tiled/pathfinding/Graph";
import AStar from "../../engine/renderer/tiled/pathfinding/AStar";

const bench = new Bench();
const ten_by_10 = Array(10).fill().map(() => Array(10));
const hundred_by_100 = Array(100).fill().map(() => Array(100));

bench.add("10x10", () => {
    const cost = Array(10).fill().map(() => Array(10)).fill(0);
    const costGraph = new Graph(cost, {diagonal: true});
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[9][9];
    AStar.search(costGraph, start, end, {heuristic: "diagonal"});
}).add("10x10 Optimized", () => {
    const cost = ten_by_10.fill(0);
    const costGraph = new Graph(cost, {diagonal: true});
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[9][9];
    AStar.search(costGraph, start, end, {heuristic: "diagonal"});
}).add("100x100 Manhattan", async () => {
    const cost = Array(100).fill().map(() => Array(100)).fill(0);
    const costGraph = new Graph(cost);
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[99][99];
    AStar.search(costGraph, start, end);
}).add("100x100 Diagonal", async () => {
    const cost = Array(100).fill().map(() => Array(100)).fill(0);
    const costGraph = new Graph(cost, {diagonal: true});
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[99][99];
    AStar.search(costGraph, start, end, {heuristic: "diagonal"});
}).add("100x100 Manhattan Optimized", async () => {
    const cost = hundred_by_100.fill(0);
    const costGraph = new Graph(cost);
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[99][99];
    AStar.search(costGraph, start, end);
}).add("100x100 Diagonal Optimized", async () => {
    const cost = hundred_by_100.fill(0);
    const costGraph = new Graph(cost, {diagonal: true});
    const start = costGraph.grid[0][0];
    const end = costGraph.grid[99][99];
    AStar.search(costGraph, start, end, {heuristic: "diagonal"});
});

export default bench;