import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Line, Path, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';

const Linec = ({ data }) => {
  const chartRef = useRef(null);
  const [chartContent, setChartContent] = useState(null);

  const margin = { top: 20, right: 30, bottom: 50, left: 40 }; // Adjusted left margin
  const width = 300 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  let x, y; // Define x and y outside useEffect

  useEffect(() => {
    if (data && data.length > 0) {
      x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width]);

      y = d3.scaleLinear()
        // .domain([0, d3.max(data, d => d.regretLevel)])
        .domain([0, 5])
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.regretLevel));

      const linePath = line(data);

      // Set the chart content to be rendered outside of useEffect
      setChartContent(
        <G transform={`translate(${margin.left}, ${margin.top})`}>
          {/* x-axis */}
          <Line
            x1={0}
            y1={height}
            x2={width}
            y2={height}
            stroke="black"
          />
          {/* x-axis labels */}
          {data.map((datum, index) => (
            <SvgText
              key={index}
              x={x(new Date(datum.date))}
              y={height + margin.bottom - 25}
              fontSize="10"
              textAnchor="middle"
              transform={`rotate(-90 ${x(new Date(datum.date))},${height + margin.bottom - 32})`}
              
            >
              {d3.timeFormat('%m/%d')(new Date(datum.date))}
            </SvgText>
          ))}
          
          {/* x-axis title */}
          <SvgText
            x={width / 2}
            y={height + margin.bottom / 1.}
            fontSize="12"
            textAnchor="middle"
          >
            Date
          </SvgText>

          {/* y-axis */}
          <Line
            x1={0}
            y1={0}
            x2={0}
            y2={height}
            stroke="black"
          />
          {/* y-axis labels */}
          {d3.range(0, 10).map((tick) => (
            <SvgText
              key={tick}
              x={-margin.left + 30}
              y={y(tick)}
              fontSize="10"
              textAnchor="end"
              dy="3"
            >
              {tick}
            </SvgText>
          ))}

            <SvgText
              x={-margin.left / 2}
              y={height / 2.3}
              fontSize="12"
              textAnchor="middle"
              transform={`rotate(-90 ${-margin.left / 2},${height / 2})`}
            >
              Regret Level
            </SvgText>

          {/* Line chart path */}
          <Path d={linePath} fill="none" stroke="steelblue" strokeWidth={1.5} />
        </G>
      );
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Satisfaction Score Summary</Text>
      <View style={styles.chartContainer}>
        <Svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} ref={chartRef}>
          {chartContent}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartContainer: {
    width: 300,
    height: 200,
  },
});

export default Linec;