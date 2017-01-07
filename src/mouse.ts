import * as d3 from "d3";
import {Point, Example} from "./common";

interface Data {
    point: Point,
    birthday: number
}

export class Mouse implements Example {
    private readonly svg = d3.select("svg");
    private readonly width = +this.svg.attr("width");
    private readonly height = +this.svg.attr("height");
    private readonly data: Data[] = [];

    // Track if we should be drawing right now (i.e. mousedown or touchstart)
    private drawing = false;

    private render(): void {
        const circles = this.svg.selectAll("circle")
            .data(this.data, (d: Data) => d.birthday.toString());
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

    private drawCircle(coords: Point): void {
        this.data.push({point: coords, birthday: Date.now()});
        this.render();
    }

    // delete data points that are too old
    private reap(): void {
        for (let i = this.data.length - 1; i >= 0; i--) {
            const age = Date.now() - this.data[i].birthday;
            if (age > 3000) this.data.splice(i, 1);
        }
    };

    title = "Draw with the mouse our touching the screen";
    slug = "mouse";
    start() {
        this.svg.on("mousedown touchstart", () => {
            d3.event.preventDefault(); // don't let the touch scroll the viewport on mobile
            this.drawing = true;
            this.drawCircle(d3.mouse(d3.event.currentTarget));
        });

        this.svg.on("mouseup touchend", () => {
            this.drawing = false;
        });

        this.svg.on("mousemove touchmove", () => {
            if (this.drawing) {
                this.drawCircle(d3.mouse(d3.event.currentTarget));
            }
        });

        d3.interval(() => this.reap(), 2000);
    }

}
