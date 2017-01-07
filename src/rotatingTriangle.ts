import * as d3 from "d3";
import {Triangle, shapePathData, Point, Example} from "./common";

export class RotatingTriangle implements Example {

    private readonly svg = d3.select("svg");
    private readonly width = +this.svg.attr("width");
    private readonly height = +this.svg.attr("height");

    private readonly centre: Point = [Math.floor(this.width / 2), Math.floor(this.height / 2)];
    private readonly offset = 100;
    private readonly seed: Triangle = [[0, this.offset], [0, 80 + this.offset], [-40, 80 + this.offset]];

    private readonly rotateFn = () => d3.interpolateString("rotate(0, 0, 0)", "rotate(360, 0, 0)");

    private animate(): void {
        this.svg.select(".triangle")
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attrTween("transform", this.rotateFn)
            .on("end", () => this.animate()); // restart the transition as soon as it ends
    }

    slug = "rotating-triangle";

    title = "Rotating triangle using repeating transition";

    start(): void {
        d3.select("head").append("style").text(`
        .triangle {
            fill: slategrey;
            stroke: black;
            stroke-width: 2;
        }
        `);

        const svgGroup = this.svg
            .append("g")
            .attr("transform", `translate(${this.centre[0]}, ${this.centre[1]})`); // (0,0) in the middle

        // mark the centre point
        svgGroup.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 2)
            .style("fill", "#ccc");

        svgGroup.append("path")
            .attr("class", "triangle")
            .attr("d", shapePathData(this.seed));

        this.animate();
    }
}
