import * as d3 from "d3";
import * as i from "immutable";
import {RandomPoints} from "./randomPoints";
import {Mouse} from "./mouse";
import {Example} from "./common";
import {Triangles} from "./triangles";
import {RotatingTriangle} from "./rotatingTriangle";
import {TimerAnimation} from "./timerAnimation";
import * as dots from "./dots";
import * as v from "./voronoi";
import * as penroseP2 from "./penroseP2";

// ideally I'd enumerate these programmatically somehow
const exampleList = [
    new RandomPoints(),
    new Triangles(),
    new RotatingTriangle(),
    new TimerAnimation(),
    new Mouse(),
    dots.example,
    v.example,
    penroseP2.example
];

const examples = exampleList
    .reduce((acc, ex) => acc.set(ex.slug, ex), i.Map<string, Example>());

const defaultExample = examples.valueSeq().first();

/**
 * Return the value of `selected` from the query string, or undefined if we
 * can"t figure it out.
 */
function getSelected(queryString: string): string | undefined {
    const r = new RegExp("selected=([^=/]*)");
    const result = r.exec(queryString);
    return result === null ? undefined : result[1];
}

const selected = getSelected(window.location.search) || "random-points";
examples.get(selected, defaultExample).start();

// Make a clickable list of examples
d3.select("ul.examples-list").selectAll("li")
    .data(examples.entrySeq().toArray())
    .enter()
    .append("li")
    .append("a")
    .text(([, v]) => v.title)
    .attr("href", ([k, ]) => "?selected=" + k)
    .filter(([k, ]) => k === selected)
    .attr("href", null);
