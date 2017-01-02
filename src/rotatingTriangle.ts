import * as d3 from "d3";
import {Triangle, shapePathData, Point} from "./common";

export function main(): void {

    d3.select("head").append("style").text(`
    .triangle {
        fill: slategrey;
        stroke: black;
        stroke-width: 2;
    }
    `);

    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const centre: Point = [Math.floor(width / 2), Math.floor(height / 2)];
    const svgGroup = svg
        .append("g")
        .attr("transform", `translate(${centre[0]}, ${centre[1]})`); // (0,0) in the middle

    // mark the centre point
    svgGroup.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 2)
        .style("fill", "#ccc");

    console.log("in rotatingTriangle.ts");

    const offset = 100;

    const seed: Triangle = [[0, offset], [0, 80 + offset], [-40, 80 + offset]];
    const rotateFn = () => d3.interpolateString("rotate(0, 0, 0)", "rotate(360, 0, 0)");

    const triangle = svgGroup.append("path")
        .attr("class", "triangle")
        .attr("d", shapePathData(seed));

    function repeat(): void {
        triangle
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attrTween("transform", rotateFn)
            .on("end", repeat); // restart the transition as soon as it ends
    }

    repeat();
}
