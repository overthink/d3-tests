import * as d3 from "d3";
import {Point} from "./common";

const width = 960;
const height = 500;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

type Triangle = [Point, Point, Point];

const triangles: Triangle[] = [
    [[20, 20], [120, 20], [20, 120]],
    [[320, 20], [420, 20], [320, 120]]
];

const lineFn = d3.line<Point>()
    .x(d => d[0])
    .y(d => d[1]);

/**
 * Return SVG path data for the given triangle.
 * @param t
 * @returns {string}
 */
function trianglePathData(t: Triangle): string {
    const result = lineFn(t);
    if (result === null) {
        throw "Expected string result";
    }
    return result + ",Z"; // force close the path, d3 only does this if fill is non-none
}

export function main(): void {

    triangles.forEach(t => {
        svg.append("path")
            .attr("d", trianglePathData(t))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "2")
    });

    console.log('done!');
}
