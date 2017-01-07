import * as d3 from "d3";
import {Example, Point} from "./common";

const svg = d3.select("svg");
const height = +svg.attr("height");
const width = +svg.attr("width");
const n = 75;

function initialData(): Point[] {
    const data: Point[] = [];
    const midY = Math.floor(height / 2);
    for (let i = 0; i < n; i++) {
        data.push([i * width / n, midY]);
    }
    return data;
}

function render(data: Point[]): void {
    const dots = svg.selectAll("circle").data(data);

    // newly arriving dots
    dots.enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 2);

    // existing dots
    dots.transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("cy", d => d[1]);
}

const yrand = d3.randomUniform(-3, 3);

function perturb(data: Point[]): Point[] {
    return data.map((p: Point) => {
        p[1] = p[1] + yrand();
        return p;
    });
}

function main(): void {
    const data = initialData();
    render(data);
    d3.interval(() => render(perturb(data)), 500);
}

export class Dots implements Example {
    title = "Line of dots drifting randomly up and down";
    slug = "dots";
    start() {
        main();
    }
}
