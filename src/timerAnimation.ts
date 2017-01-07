import * as d3 from "d3";
import {Example} from "./common";

export class TimerAnimation implements Example {
    private readonly svg = d3.select("svg");
    private readonly width = +this.svg.attr("width");
    private readonly height = +this.svg.attr("height");
    private readonly r = 50;

    slug = "timer-animation";

    title = "A circle moving around using d3.timer to animate";

    start(): void {
        this.svg.append("circle")
            .attr("cx", this.r)
            .attr("cy", Math.floor(this.height / 2))
            .attr("r", this.r)
            .attr("fill", "darkorange");

        const circle = this.svg.select("circle");

        const move = (elapsed: number) => {
            // y = -cos(x)/2 + 0.5 gives nice oscillating output on [0, 1]
            const fraction = -Math.cos(elapsed / 1000) / 2 + 0.5;
            circle.attr("cx", this.r + (fraction * (this.width - 2 * this.r)));
        };

        d3.timer(move);
    }
}
