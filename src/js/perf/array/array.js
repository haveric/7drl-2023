import { Bench } from "tinybench";
import ArrayUtil from "../../engine/util/ArrayUtil";

const bench = new Bench();

const sizes = [100, 1000, 10000];

for (const size of sizes) {
    bench.add("2d array " + size, () => {
        ArrayUtil.create2dArray(size);
    });

    bench.add("2d array " + size + " (old)", () => {
        create2dArray_old(size);
    });

    bench.add("2d array " + size + " (for loop)", () => {
        create2dArray_forloop(size);
    });
}

const create2dArray_old = numRows => {
    const array = [];

    for (let i = 0; i < numRows; i++) {
        array[i] = [];
    }
    return array;
};

const create2dArray_forloop = numRows => {
    const array = new Array(numRows);

    for (let i = 0; i < numRows; i++) {
        array[i] = [];
    }
    return array;
};

export default bench;