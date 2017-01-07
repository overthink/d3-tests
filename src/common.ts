import * as d3 from "d3";

export interface Example {
    readonly title: string,
    readonly slug: string,
    start(): void // maybe at stop() and make this a real SPA?
}

export type Point = [number, number];
export type Shape = Point[];
export type Triangle = [Point, Point, Point];

const lineFn = d3.line<Point>()
    .x(d => d[0])
    .y(d => d[1]);

/**
 * Return SVG path data for the given shape.
 */
export function shapePathData(t: Shape): string {
    const result = lineFn(t);
    if (result === null) {
        throw "Expected string result";
    }
    return result + "Z"; // force close the path, d3 only does this if fill is non-none
}
