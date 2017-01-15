// Overly explainy comments in here since I'm trying to understand
// d3.voronoi better.
//
// much borrowed from https://bl.ocks.org/mbostock/4060366
import * as d3 from "d3";
import {Example, Point} from "./common";
import {Selection} from "d3-selection";
import {VoronoiPolygon, VoronoiLayout, VoronoiDiagram} from "d3-voronoi";

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

    // apparently there's a "margin convention" for d3:
    // http://bl.ocks.org/mbostock/3019563
    const margin = {top: 20, right: 10, bottom: 20, left: 10};

    const svgElem = d3.select("svg");
    const svg = svgElem
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const width = +svgElem.attr("width") - margin.left - margin.right;
    const height = +svgElem.attr("height") - margin.top - margin.bottom;
    const n = 150;

    const x = d3.scaleLinear().range([0, width - 1]);
    const y = d3.scaleLinear().range([0, height - 1]);

    let siteData: Point[] = d3.range(n)
        .map(() => [x(Math.random()), y(Math.random())] as Point);

    // "site" is Voronoi lingo for one of the dots on the diagram
    const drawSite = (site: Selection<any, Point, any, any>) => {
        site
            .attr("cx", d => d[0])
            .attr("cy", d => d[1])
            .attr("r", 2);
    };

    const drawPolygon = (polygon: Selection<any, VoronoiPolygon<Point>, any, any>) => {
        // nb: a polygon's data can be null if its site is coincident with an earlier
        // polygon
        polygon.attr("d", d => d ? "M" + d.join("L") + "Z" : null);
    };

    // Create a VoronoiLayout that can be used to create a Voronoi diagram
    // when given data. extent sets the clipping for the polygons in the diagram.
    const layout: VoronoiLayout<Point> = d3.voronoi()
        .extent([[-1, -1], [width + 1, height + 1]]);

    let sites: Selection<any, Point, any, any> = svg.append("g")
        .selectAll("circle")
        .data(siteData)
        .enter()
        .append("circle")
        .classed("site", true)
        .call(drawSite);

    let polygons: Selection<any, VoronoiPolygon<Point>, any, any> = svg.append("g")
        .selectAll("path")
        .data(layout.polygons(siteData))
        .enter()
        .append("path")
        .classed("polygon", true)
        .call(drawPolygon);

    const rand = d3.randomUniform(-1, 1);
    const perturb = (data: Point[]): Point[] => {
        return data.map((p: Point) => {
            p[1] = p[1] + rand();
            p[0] = p[0] + rand();
            // clamp points within width x height
            if (p[0] > width) p[0] = width;
            if (p[0] < 0) p[0] = 0;
            if (p[1] > height) p[1] = height;
            if (p[1] < 0) p[1] = 0;
            return p;
        });
    };

    // Always make sure there is a site at the mouse location (looks cool)
    svgElem.on("touchmove mousemove", () => {
        const curPos = d3.mouse(d3.event.currentTarget);
        curPos[0] -= margin.left;
        curPos[1] -= margin.top;
        siteData[0] = curPos;
        update();
    });


    const update = () => {
        // move the sites around randomly
        siteData = perturb(siteData);
        // regenerate the diagram using the updated site data (rendering of
        // diagram not yet changed)
        const diagram: VoronoiDiagram<Point> = layout(siteData);
        // Update the polygons and sites we've already drawn using the data from the
        // new diagram we just created.
        polygons = polygons.data(diagram.polygons()).call(drawPolygon);
        sites = sites.data(siteData).call(drawSite);
    };

    d3.timer(update);
}

export const example: Example = {
    title: "Jittery Voronoi diagram with mouse interaction",
    slug: "voronoi",
    start: () => main()
};
