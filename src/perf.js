import example from "./js/perf/example/example";
import array from "./js/perf/array/array";
import pathfinding from "./js/perf/pathfinding/pathfinding";

(async function () {
    const body = document.getElementsByTagName("body")[0];

    const displayTable = (bench) => {
        const result_table = bench.table();
        const result_html = document.createElement("table");
        for (const [index, result] of result_table.entries()) {
            if (index === 0) {
                const tr = document.createElement("tr");
                Object.keys(result).forEach(key => {
                    const th = document.createElement("th");
                    th.innerText = key;
                    tr.appendChild(th);
                });
                result_html.appendChild(tr);
            }

            const tr = document.createElement("tr");
            Object.keys(result).forEach(key => {
                const td = document.createElement("td");
                td.innerText = result[key];
                tr.appendChild(td);
            });
            result_html.appendChild(tr);
        }

        body.appendChild(result_html);
    };

    await example.run();
    displayTable(example);

    await array.run();
    displayTable(array);

    await pathfinding.run();
    displayTable(pathfinding);
}());
