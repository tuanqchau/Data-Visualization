/*
 * HW6
 * BarChart component JavaScript source code
 *
 * Author: Tuan Chau
 * Version: 1.0
 */

import './BarChart.css';
import React, {useEffect} from 'react';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import * as d3 from 'd3';

const theme = createTheme({
    palette: {
        background: {
            paper: '#fff',
        },
        text: {
            primary: '#173A5E',
            secondary: '#46505A',
        },
        action: {
            active: '#001E3C',
        },
        success: {
            dark: '#009688',
        },
    },
});

let svg = null;

let didMount = true;

const settings = {
    viewBox: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    title: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        baseline: 5
    },
    labels: {
        x: 5,
        y: 95,
        width: 95,
        height: 5,
        baseline: 2
    },
    values: {
        x: 0,
        y: 10,
        width: 5,
        height: 90,
        baseline: 4.5,
        min: 0,
        max: 7,
        step: 0.5
    },
    lines: {
        margin: 1.5
    },
    bars: {
        x: 5,
        y: 10,
        width: 95,
        height: 85,
        ratio: 0.7
    }
};

const BarChart = (props) => {
    let myReference = React.createRef();
    let dataset = props.dataset;

    useEffect(()=> {
        let min = null;
        let max = null;
        let step = 0.5;

        //get min max values from the array
        for (let i = 0; i < dataset.data.length; i++) {
            let e = null;
            e = dataset.data[i];
            if (min === null) {
                min = Object.values(e)[1];
                max = Object.values(e)[1];
            }

            else {
                if (min > Object.values(e)[1]) {
                    min = Object.values(e)[1];
                }
                if (max < Object.values(e)[1]) {
                    max = Object.values(e)[1];
                }
            }
        }

        //rounding
        min = min - 0.5;
        min = Math.floor(min);
        max = Math.ceil(max);

        //calculate step
        step = 0.5 * Math.pow(10, ((max-min).toString().length) - 1);


        //checks if min and max were provided
        //if not, use the default settings
        if (props.min) {
            settings.values.min = props.min;
        }
        else {
            settings.values.min = min;
        }

        if (props.max) {
            settings.values.max = props.max;
        }
        else {
            settings.values.max = max;
        }

        if (props.step) {
            settings.values.step = props.step;
        }
        else {
            settings.values.step = step;
        }
    })


    const init = () => {
        let container = d3.select(myReference.current);
        svg = container
            .append("svg")
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none")
            .style("width", "100%")
            .style("height", "100%")
            .style("border", "none");
    }

    //const handleSelect()
    const paint = () => {

        //when mouse move update the coordinate of the tooltip
        const mousemove = (event, d) => {
            const text = d3.select('.tooltip-text');
            text.text("Tooltip")

            const x = event.pageX;
            const y = event.pageY;
            tooltip
                .style('left', x.toString()+"px")
                .style('top', y.toString()+"px")
                .text(Object.keys(d)[0] + ": " + Object.values(d)[0]+ " " +  Object.keys(d)[1] + ": " + Object.values(d)[1]);

        };

        //the tooltip
        const tooltip = d3.select("body")
            .append("div")
            // .attr('x', "50%")
            // .attr('y', "50%")
            .style("position", "absolute")
            //.style("z-index", "10")
            .style("width", "150px")
            .style("height", "50px")
            .style("visibility", "hidden")
            //.style("background", "#deb5de")
            .style("background", "white")
            .style("color", "black")
            .style("border-radius", "5px")
            .style("border", "solid 1px black")
            .style("text-align", "center");
        svg
            .selectAll("*")
            .remove();



        svg //lines
            .append("g")
            .attr("id", "lines")
            .selectAll("line")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step)) //third requirement?
            .enter()
            .append("line")
            .attr("x1", settings.values.x + settings.values.width)
            .attr("x2", settings.values.x + settings.values.width + settings.bars.width - settings.lines.margin )
            .attr("y1", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .attr("y2", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            });

        svg
            .append("g")
            .attr("id", "bars")
            .selectAll("rect")
            .data(dataset.data)
            .enter()
            .append("rect")
            .attr("x", (item , index) => {
                return settings.bars.x + (1 - settings.bars.ratio + index) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", (item , index) => { //Object.values(item)[1]
                //return settings.labels.y - item.population * settings.bars.height / (settings.values.max - settings.values.min);
                return settings.labels.y - (Object.values(item)[1] - settings.values.min) *
                    settings.bars.height / (settings.values.max - settings.values.min);
            })
            .attr("width", settings.bars.ratio * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio))
            .attr("height", (item , index) => {
                return (Object.values(item)[1] - settings.values.min) * settings.bars.height / (settings.values.max - settings.values.min);
            })
            .attr("dataPointIndex", (item, index) => {
                return index;
            })
            .on("click", function(e) {
                //tooltip.style("visibility", "hidden");
                tooltip.remove();
                e.target.dataPointIndex = parseInt(e.target.getAttribute("dataPointIndex"));
                props.onSelect(e);
            })
            .on("mouseover", function(e) {
                // tooltip.text(e);
                let d = props.dataset.data[parseInt(e.target.getAttribute("dataPointIndex"))];
                const x = e.pageX;
                const y = e.pageY;
                tooltip
                    .style('left', x.toString()+"px")
                    .style('top', y.toString()+"px")
                    .text(Object.keys(d)[0] + ": " + Object.values(d)[0]+ " " +  Object.keys(d)[1] + ": " + Object.values(d)[1]);
                return tooltip.style("visibility", "visible");
            })
            // .on("mousemove", function() {
            //     return tooltip.style("top", (svg.event.pageY-10) + "px").style("left",(svg.event.pageX + 10)+"px");
            // })
            .on("mousemove", mousemove)
            .on("mouseout", function(e) {
                return tooltip.style("visibility", "hidden");
            })
            .style("fill", (item, index) => {
                return props.selection.includes(index) ? "red" : "dodgerblue" ;
            })


        svg //title
            .append("g")
            .attr("id", "title")
            .append("text")
            .attr("x", (settings.title.x + settings.title.width) / 2)
            .attr("y", settings.title.y + settings.title.height - settings.title.baseline)
            .text(dataset.title);

        //axis labels
        // svg
        //     .append("g")
        //     .attr("id", "x-label")
        //     .append("text")
        //     .attr("x", settings.labels.width / 2)
        //     .attr("y", settings.viewBox.height - 1)
        //     .text(Object.keys(dataset.data[0])[0]);
        //
        // svg
        //     .append("g")
        //     .attr("id", "y-label")
        //     .append("text")
        //     .attr("x", settings.labels.x + 1)
        //     .attr("y", settings.title.y + settings.title.height - settings.title.baseline + 7)
        //
        //     .text(Object.keys(dataset.data[0])[1]);


        // svg
        //     .append("g")
        //     .attr("id", "axis-title")
        //     .append("text")


        svg
            .append("g")
            .attr("id", "labels")
            .selectAll("text")
            .data(dataset.data)
            .enter()
            .append("text")
            .attr("x", (item , index) => {
                return settings.labels.x + (1 - settings.bars.ratio + index + settings.bars.ratio / 2) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baseline)
            .text((item, index) => {
                //return item.year; //1st requirement?
                return Object.values(item)[0];
            });

        svg
            .append("g")
            .attr("id", "values")
            .selectAll("text")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("text")
            .attr("x", settings.values.x + settings.values.width / 2)
            .attr("y", (item, index) => {
                return settings.values.y + settings.values.height - settings.values.baseline - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .text((item, index) => {
                return (settings.values.min + item*settings.values.step).toFixed(1);
                //return (item / 2.0).toFixed(1);
            });

    }


    useEffect(() => {
        if (didMount) {
            didMount = false;
            init();
            window.addEventListener('resize', () => {
                paint();
            })
        }
        paint();
    });

    return(
            <Box ref={myReference} sx={props.sx} >
            </Box>
    );

}

export default BarChart;
