import * as d3 from "d3";
import {Point, Example} from "./common";

export class RandomPoints implements Example {

    private readonly svg = d3.select("svg");
    private readonly width = +this.svg.attr("width");
    private readonly height = +this.svg.attr("height");

    private readonly xRandom = d3.randomUniform(0, this.width);
    private readonly yRandom = d3.randomUniform(0, this.height);

    private generatePoints(): Point[] {
        return d3.range(Math.random() * 50)
            .map((): Point => [this.xRandom(), this.yRandom()]);
    }

    private update(points: Point[]): void {
        const circles = this.svg.selectAll("circle").data(points);

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

    slug = "random-points";
    title = "animated random points";
    start(): void {
        this.update(this.generatePoints());

        d3.interval(() => {
            this.update(this.generatePoints());
        }, 3000);
    }

}
