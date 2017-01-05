import * as d3 from "d3";
import {Point} from "./common";

export function main(): void {
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    interface Data {
        point: Point,
        birthday: number
    }

    const data: Data[] = [];

    function render(): void {
        const circles = svg.selectAll("circle")
            .data(data, (d: Data) => d.birthday.toString());
        circles.enter()
            .append("circle")
            .attr("cx", d => d.point[0])
            .attr("cy", d => d.point[1])
            .attr("r", 20)
            .transition()
            .duration(2000)
            .style("opacity", 0);
        circles.exit()
            .remove();
    }

    // delete data points that are too old
    function reap(): void {
        for (let i = data.length - 1; i >= 0; i--) {
            const age = Date.now() - data[i].birthday;
            if (age > 3000) data.splice(i, 1);
        }
    }

    function update(): void {
        reap();
        render();
    }

    svg.on("click", () => {
        const coords = d3.mouse(d3.event.currentTarget);
        data.push({point: coords, birthday: Date.now()});
        render();
    });

    update();
    d3.interval(update, 2000);

}
