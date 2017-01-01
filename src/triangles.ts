import * as d3 from "d3";
import {Point, Shape, Triangle, shapePathData} from "./common";

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

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
    const blend = d3.interpolateRgb("steelblue", "orange");
    const seed: Triangle = [[10, 10], [60, 10], [10, 60]];
    const shapes = tile(width, height, seed);
    svg.selectAll("path")
        .data(shapes)
        .enter()
        .append("path")
        .attr("d", t => shapePathData(t))
        .attr("fill", (_, i) => blend(i / shapes.length))
        .attr("stroke", "black")
        .attr("stroke-width", "3");
}
