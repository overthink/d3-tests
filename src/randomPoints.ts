import * as d3 from "d3";
import {Point} from "./common";

const width = 960;
const height = 500;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const xRandom = d3.randomUniform(0, width);
const yRandom = d3.randomUniform(0, height);

function generatePoints(): Point[] {
    return d3.range(Math.random() * 50)
        .map((): Point => [xRandom(), yRandom()]);
}

function update(points: Point[]): void {
    const circles = svg.selectAll("circle").data(points);

    // create any new circles
    circles
        .enter()
        .append("circle")
        .attr("cx", (p: Point) => p[0])
        .attr("cy", (p: Point) => p[1])
        .attr("fill", "steelblue")
        .attr("stroke", "black")
        .attr("r", "0")
        .transition()
        .attr("r", "7");

    // update existing circle coords
    circles
        .transition()
        .duration(2000)
        .ease(d3.easeBounce)
        .attr("cx", (p: Point) => p[0])
        .attr("cy", (p: Point) => p[1]);

    // remove any circles that have left
    circles
        .exit()
        .transition()
        .attr("r", 0)
        .remove();
}

export function main(): void {
    update(generatePoints());

    d3.interval(() => {
        update(generatePoints());
    }, 3000);
}
