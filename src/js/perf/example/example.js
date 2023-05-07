import { Bench } from "tinybench";

const bench = new Bench();

bench.add("faster task", () => {
    console.log("I am faster");
}).add("slower task", async () => {
    await new Promise(r => setTimeout(r, 1)); // we wait 1ms :)
    console.log("I am slower");
});
export default bench;