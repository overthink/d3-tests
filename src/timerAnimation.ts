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

    const x = d3.scaleLinear().domain([-1, 1]).range([r, width - r]);

    let start = 0;
    function move() {
        const circle = svg.select("circle");
        start += 0.02;
        circle.attr("cx", x(-Math.cos(start)));
    }

    // const t = d3.timer(e => {
    //     move(e);
    //     if (e > 30000) t.stop();
    // });
    d3.timer(move);

}
