import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Line, Path, Text as SvgText, Circle } from 'react-native-svg';
import * as d3 from 'd3';

const MonthlySummaryChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartContent, setChartContent] = useState(null);

  const { width: screenWidth } = Dimensions.get('window');
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = screenWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  let x, y; // Define x and y outside useEffect

  useEffect(() => {
    if (data && data.length > 0) {
      x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width]);

      y = d3.scaleLinear()
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
            x2={width + 20}
            y2={height}
            stroke="black"
          />

          {/* x-axis labels */}
          {data.map((datum, index) => (
            <SvgText
              key={index}
              x={x(new Date(datum.date)) + 5}
              y={height + margin.bottom - 25}
              fontSize="10"
              textAnchor="middle"
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
            fontWeight="bold"
          >
            Date
          </SvgText>

          {/* y-axis */}
          <Line
            x1={0}
            y1={-10}
            x2={0}
            y2={height}
            stroke="black"
          />

          {/* y-axis labels */}
          {d3.range(0, 10).map((tick) => (
            <SvgText
              key={tick}
              x={-margin.left + 30}
              y={y(tick) - 10}
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
              fontWeight="bold"
            >
              Regret Level
            </SvgText>

          {/* Line chart path */}
          <Path d={linePath} fill="none" stroke="steelblue" strokeWidth={1.5} />

          {/* Circles at each data point */}
          {data.map((datum, index) => (
            <Circle
              key={index}
              cx={x(new Date(datum.date))}
              cy={y(datum.regretLevel)}
              r={4} 
              fill="#3BB0E5" 
            />
          ))}
        </G>
      );
    } else {
      // Set message when there's not enough data
      setChartContent(
      <View style={styles.noDataText}>
        <Text style={styles.noDataText}>
          Not enough data to create a chart.
        </Text>
      </View>
      );
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom} ref={chartRef}>
          {chartContent}
        </Svg>
      </View>
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Regret Level</Text>
        <View style={[styles.legendLine, { marginRight: 40, borderColor: '#3BB0E5' }]}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  legendText: {
    fontSize: 12,
    marginRight: 10,
  },
  legendLine: {
    width: 40,
    height: 2,
    marginRight: 10,
    borderWidth: 2,
  },
});

export default MonthlySummaryChart;