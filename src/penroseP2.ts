// Based on Preshing's approach http://preshing.com/20110831/penrose-tiling-explained/
// He very cleverly uses complex numbers to do this, but I, less clever, am
// going to do it with 2d real coordinates.

import * as d3 from "d3";
import {Example, Point, Triangle} from "./common";
import {Selection} from "d3-selection";

const enum Colour {
    Red,
    Blue
}

type PenroseTriangle = [Point, Point, Point, Colour];

function distance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

/**
 * Return a new point that is point p rotated deg degrees clockwise around the
 * point about.
 */
function rotate(p: Point, deg: number, about: Point): Point {
    // translate p so rotation is around origin, then rotate with the usual
    // math, then translate result back so it's relative to about.
    const rad = deg * Math.PI / 180;
    const result: Point = [0, 0];
    result[0] = (p[0] - about[0]) * Math.cos(rad) - (p[1] - about[1]) * Math.sin(rad) + about[0];
    result[1] = (p[1] - about[1]) * Math.cos(rad) + (p[0] - about[0]) * Math.sin(rad) + about[1];
    return result;
}

// My model of isosceles triangles: (AB and AC are equal length)
//
//      A
//     /ϴ\
//    /   \
//   B_____C
//
// Given points a and b defining one of the equal length sides of an isosceles
// triangle, and deg, the degrees between the equal length sizes, return c,
// the 3rd point of the triangle.
function isosceles(a: Point, b: Point, degrees: number): Triangle {
    // rotate negative degrees so point C matches our diagram (we're given A and B)
    return [a, b, rotate(b, -degrees, a)];
}

// function redTriangle(a: Point, b: Point): PenroseTriangle {
//     const t: any[] = isosceles(a, b, 36);
//     t.push(Colour.Red);
//     return <PenroseTriangle>t;
// }

function blueTriangle(a: Point, b: Point): PenroseTriangle {
    const t: any[] = isosceles(a, b, 108);
    t.push(Colour.Blue);
    return <PenroseTriangle>t;
}

// draw triangle, but don't stroke the base, since they'll combine into rhombi
// once tiled
function drawTriangle(t: Selection<any, PenroseTriangle, any, any>): void {
    t.attr("d", d => {
            // bc is the triangle base, so we don't stroke that
            const [a, b, c] = d;
            return "M" + [b, a, c].join("L")
        })
        .classed("red", d => d[3] == Colour.Red)
        .classed("blue", d => d[3] == Colour.Blue);
}

// Return a vector of length 1 starting at from in the direction of to.
function unitVector(from: Point, to: Point): Point {
    const d = distance(from, to);
    return [(to[0] - from[0]) / d, (to[1] - from[1]) / d];
}

// multiply vector by scala, return new vector
function multiply(vector: Point, scalar: number): Point {
    return [vector[0] * scalar, vector[1] * scalar];
}

// Return a new vector that is the sum of v1 and v2
function sum(v1: Point, v2: Point): Point {
    return [v1[0] + v2[0], v1[1] + v2[1]];
}

const phi = (1 + Math.sqrt(5)) / 2;

// Split given triangle into two by adding a point p between a and b, s.t. it
// divides ab in the golden ratio. Then return triangles pca and cpb
function deflate(t: PenroseTriangle): PenroseTriangle[] {
    const [a, b, c, colour] = t;

    const result: PenroseTriangle[] = [];
    if (colour == Colour.Red) {
        const p = sum(a, multiply(unitVector(a, b), distance(a, b) / phi));
        result.push([c, p, b, Colour.Red], [p, c, a, Colour.Blue]);
    } else {
        const q = sum(b, multiply(unitVector(b, a), distance(b, a) / phi));
        const r = sum(b, multiply(unitVector(b, c), distance(b, c) / phi));
        result.push([q, r, b, Colour.Blue], [r, q, a, Colour.Red], [r, c, a, Colour.Blue]);
    }

    return result;
}

function deflateMany(ts: PenroseTriangle[]): PenroseTriangle[] {
    return [].concat.apply([], ts.map(deflate));
}

// Apply f to args, then take the result of that and apply f to it again. Do
// this n times.
function iterate<T>(f: (a: T) => T, args: T, n: number) {
    let result = args;
    while (n > 0) {
        result = f.call(null, result);
        n--;
    }
    return result;
}

function main(): void {
    d3.select("head").append("style").text(`
        .triangle {
            stroke: #333;
            stroke-width: 1px;
        }
        .red {
            fill: darkorange;
        }
        .blue {
            fill: steelblue;
         }
        path.fixup.red {
            stroke: darkorange;
            stroke-width: 2px;
        }
        path.fixup.blue {
            stroke: steelblue;
            stroke-width: 2px;
        }
    `);

    const margin = {top: 20, right: 10, bottom: 20, left: 10};

    const svgElem = d3.select("svg");
    const svg = svgElem
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const width = +svgElem.attr("width") - margin.left - margin.right;
    const height = +svgElem.attr("height") - margin.top - margin.bottom;

    // TODO dumb: I'm drawing way more triangles than needed to fill the viewport
    const triangles = iterate(deflateMany, [blueTriangle([800, -200], [-700, 100])], 10);
    console.log(`there are ${triangles.length} triangles`);

    // hack, anti-aliasing causes there to be a tiny gap between filled shapes
    // with no stroke along the adjaced edge... my work around is to draw a
    // fat stroke along these edges "under" the main shapes, so the gaps
    // appear to be filled in. Horrible, but works.
    //
    // "Horrible, but works." - All programmers on all software, ever.
    for (let t of triangles) {
        const [, b, c, colour] = t;
        const d = "M" + [b, c].join("L");
        svg.append("path")
            .attr("d", d)
            .classed("fixup", true)
            .classed("red", colour == Colour.Red)
            .classed("blue", colour == Colour.Blue);
    }

    svg.selectAll("path.triangles") // need a "path" query that won't select the fixup lines
        .data(triangles)
        .enter()
        .append("path")
        .classed("triangle", true)
        .call(drawTriangle);
}

export const example: Example = {
    title: "Simple Penrose P2 tiling",
    slug: "penrose-p2",
    start: () => main()
};
