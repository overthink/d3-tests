import * as d3 from "d3";

const width = 960;
const height = 500;
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);
const xRandom = d3.randomUniform(0, width);
const yRandom = d3.randomUniform(0, height);

interface Point {
    readonly x: number;
    readonly y: number;
}

function generatePoints(): Point[] {
    return d3.range(Math.random() * 50)
        .map(_ => {
            return {
                x: xRandom(),
                y: yRandom()
            }
        });
}

function update(points: Point[]): void {
    const circles = svg.selectAll("circle").data(points);

    // create any new circles
    circles.enter()
        .append("circle")
        .attr("cx", (p: Point) => {
            return p.x;
        })
        .attr("cy", (p: Point) => {
            return p.y;
        })
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("r", "0")
        .transition()
        .attr("r", "7");

    // update existing circle coords
    circles
        .transition()
        .duration(2000)
        .ease(d3.easeBounce)
        .attr("cx", (p: Point) => {
            return p.x;
        })
        .attr("cy", (p: Point) => {
            return p.y;
        });

    // remove any circles that have left
    circles
        .exit()
        .transition()
        .attr("r", 0)
        .remove();
}

export function main(): void {
    update(generatePoints());

    d3.interval(_ => {
        update(generatePoints());
    }, 3000);
}
