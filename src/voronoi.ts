import * as d3 from "d3";
import {Example, Point} from "./common";
import {Selection} from "d3-selection";
import {VoronoiPolygon} from "d3-voronoi";

function main(): void {
    d3.select("head").append("style").text(`
        .site {
            fill: #333;
        }
        .polygon {
            fill: none;
            stroke: #ccc;
            stroke-width: 2px;
        }
    `);

    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const n = 50;

    const x = d3.scaleLinear().range([0, width - 1]);
    const y = d3.scaleLinear().range([0, height - 1]);

    const data: Point[] = d3.range(n)
        .map(() => [Math.random(), Math.random()] as Point);

    const drawSite = (site: Selection<any, Point, any, any>) => {
        site
            .attr("cx", d => x(d[0]))
            .attr("cy", d => y(d[1]))
            .attr("r", 2);
    };

    const drawPolygon = (polygon: Selection<any, VoronoiPolygon<Point>, any, any>) => {
        polygon.attr("d", d => "M" + d.join("L") + "Z");
    };

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .classed("site", true)
        .call(drawSite);

    const voronoi = d3.voronoi()
        .x(d => x(d[0]))
        .y(d => y(d[1]))
        .extent([[-1, -1], [width + 1, height + 1]])
        .size([width, height]);

    const voronoiDiagram = voronoi(data);

    const polygon = svg.append("g")
        .selectAll("path")
        .data(voronoiDiagram.polygons())
        .enter()
        .append("path")
        .classed("polygon", true)
        .call(drawPolygon);

}

export const example: Example = {
    title: "Requisite Voronoi diagram example",
    slug: "voronoi",
    start: () => main()
};
