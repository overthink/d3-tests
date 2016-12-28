import * as d3 from "d3";
import * as immutable from "immutable";
import * as rp from "./randomPoints";
import * as tri from "./triangles";

interface Example {
    readonly title: string,
    readonly run: () => void
}

// ideally I"d enumerate these programmatically
const examples: immutable.Map<string, Example> = immutable.Map({
    "random-points": {title: "Random points", run: rp.main},
    "triangles": {title: "Triangles", run: tri.main}
});

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
examples.get(selected, defaultExample).run();

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
