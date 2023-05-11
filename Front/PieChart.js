/*
 * Project 2
 * PieChart component JavaScript source code
 *
 * Author: Tuan Chau
 * Version: 1.0
 */

import './PieChart.css';
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

const PieChart = (props) => {
    let myReference = React.createRef();
    let dataset = props.dataset;



    const init = () => {
        let container = d3.select(myReference.current);
        svg = container
            .append("svg")
            .style("width", "100%")
            .style("height", "100%")
            .append("svg")
            .attr("x", "50%")
            .attr("y", "50%")
            .style("overflow", "visible")
            .append('g')
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none")
    }

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

                .text(Object.keys(d)[2] + ": " + Object.values(d)[2]);

        };

        //the tooltip
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("width", "150px")
            .style("height", "50px")
            .style("visibility", "hidden")
            .style("background", "white")
            .style("color", "black")
            .style("border-radius", "5px")
            .style("border", "solid 1px black")
            .style("text-align", "center");
        svg
            .selectAll("*")
            .remove();
        let radius = 300 / 2;
        let color = d3.scaleOrdinal()
            .domain(dataset.data)
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
        let arc = d3.arc().innerRadius(0).outerRadius(radius);
        let pie = d3.pie()
            .value((d) => {
                console.log(d)
                //return d.y
                return Object.values(d)[1];
            })

            .sort(null);

        //draw the pie chart
        let path = svg.selectAll('g')
            .data(pie(dataset.data))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                //return color(d.y);
                return color(Object.values(d)[1]);

            })
            .attr("stroke", "black")
            .style("stroke-width", "3px")
            .attr("dataPointIndex", (item, index) => {
                return index;
            })
            .on("click", function(e) {
                //tooltip.style("visibility", "hidden");
                tooltip.remove();
                e.target.dataPointIndex = parseInt(e.target.getAttribute("dataPointIndex"));
                props.onSelect(e);
            })
            .style("fill", (item, index) => {
                return props.selection.includes(index) ? "red" : "dodgerblue" ;
            })
            .on("mouseover", function(e) {
                // tooltip.text(e);
                let d = props.dataset.data[parseInt(e.target.getAttribute("dataPointIndex"))];
                const x = e.pageX;
                const y = e.pageY;
                tooltip
                    .style('left', x.toString()+"px")
                    .style('top', y.toString()+"px")
                    .text(Object.keys(d)[2] + ": " + Object.values(d)[2]);
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", mousemove)
            .on("mouseout", function(e) {
                return tooltip.style("visibility", "hidden");
            })
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

export default PieChart;
