import * as d3 from "d3";
import {Point} from "./common";

const width = 960;
const height = 500;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

type Shape = Point[];
type Triangle = [Point, Point, Point];

const lineFn = d3.line<Point>()
    .x(d => d[0])
    .y(d => d[1]);

/**
 * Return SVG path data for the given triangle.
 */
function shapePathData(t: Shape): string {
    const result = lineFn(t);
    if (result === null) {
        throw "Expected string result";
    }
    return result + ",Z"; // force close the path, d3 only does this if fill is non-none
}

/**
 * Given a seed shape, return a sequence of shapes that tile a width x height
 * area. Yes, this could be done with svg:pattern ...
 */
function tile(width: number, height: number, seed: Shape): Shape[] {
    // get the width and height of the bounding box of the seed shape (assume
    // (0, 0) is the top-left of seed shape)
    const seedW = d3.max(seed, (p: Point) => p[0]);
    const seedH = d3.max(seed, (p: Point) => p[1]);

    const result: Shape[] = [];
    for (let i = 0; i < Math.floor(width / seedW); i++) {
        for (let j = 0; j < Math.floor(height / seedH); j++) {
            const copy = seed.map(([x, y]): Point => [x + i * seedW, y + j * seedH]);
            result.push(copy);
        }
    }
    return result;
}

export function main(): void {
    const seed: Triangle = [[20, 20], [120, 20], [20, 120]];
    svg.selectAll("path")
        .data(tile(width, height, seed))
        .enter()
        .append("path")
        .attr("d", t => shapePathData(t))
        .attr("fill", (_, i) => d3.color("steelblue").brighter(i / 12).toString())
        .attr("stroke", "black")
        .attr("stroke-width", "3");
}
