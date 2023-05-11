/*
 Chart
 Author: Tuan Chau
 Project 2

 reference link: https://recharts.org/en-US/api/BarChart
 */
import * as React from 'react';
import {Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, BarChart} from "recharts";



export default function ChartData(props) {
        return (
            <BarChart className="chart" width={1200} height={500} data={props.chartData} key={props.barChartKey.toString()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="y" fill="#8884d8" />
            </BarChart>

        );
}
