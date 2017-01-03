import * as d3 from "d3";

export function main() {
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const r = 50;

    svg.append("circle")
        .attr("cx", r)
        .attr("cy", Math.floor(height / 2))
        .attr("r", r)
        .attr("fill", "darkorange");

    const circle = svg.select("circle");
    function move(elapsed: number) {
        // y = -cos(x)/2 + 0.5 gives nice oscillating output on [0, 1]
        const fraction = -Math.cos(elapsed / 1000) / 2 + 0.5;
        circle.attr("cx", r + (fraction * (width - 2 * r)));
    }

    d3.timer(move);
}
