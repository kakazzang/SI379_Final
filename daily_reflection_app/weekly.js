import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Line, Path, Text as SvgText, Circle } from 'react-native-svg';
import * as d3 from 'd3';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

const WeeklySummaryChart = ({ data }) => {
  const { width: screenWidth } = Dimensions.get('window');
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = screenWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const [chartContent, setChartContent] = useState(null);

  useEffect(() => {
    if(data && data.length > 0){
      const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([1, 5])
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.regretLevel));

      const linePath = line(data);

      // Calculate monthly average
      const monthlyAverage = data.reduce((sum, item) => sum + item.regretLevel, 0) / data.length;
      const averageLinePath = `M0,${y(monthlyAverage)}L${width},${y(monthlyAverage)}`;

      setChartContent(
        <G transform={`translate(${margin.left}, ${margin.top})`}>
          {/* x-axis */}
          <Line x1={0} y1={height} x2={width} y2={height} stroke="black" />
          {/* y-axis */}
          <Line x1={0} y1={0} x2={0} y2={height} stroke="black" />
          {/* Line chart path */}
          <Path d={linePath} fill="none" stroke="steelblue" strokeWidth={2} />
          {/* Monthly average line */}
          <Path d={averageLinePath} fill="none" stroke="red" strokeWidth={2} strokeDasharray="5,5" />
          {/* Circles at each data point */}
          {data.map((datum, index) => (
            <Circle
              key={index}
              cx={x(new Date(datum.date))}
              cy={y(datum.regretLevel)}
              r={3}
              fill="steelblue"
            />
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
      
          {/* x-axis labels */}
          {eachDayOfInterval({ start: startOfMonth(new Date(data[0].date)), end: endOfMonth(new Date(data[data.length - 1].date)) })
            .filter((d, i) => i % 4 === 0)
            .map((d, i) => (
              <SvgText
                key={i}
                x={x(d)}
                y={height + 15}
                fontSize="10"
                textAnchor="middle"
              >
                {format(d, 'MM/dd')}
              </SvgText>
            ))}
          {/* y-axis labels */}
          {d3.range(1, 6).map((tick, i) => (
            <SvgText
              key={i}
              x={-10}
              y={y(tick)}
              fontSize="10"
              textAnchor="end"
            >
              {tick}
            </SvgText>
          ))}
          {/* Legend */}
        </G>
      );
    } else {
      setChartContent(
        <Text style={styles.noDataText}>
        Not enough data to create a chart.(monthly)
        </Text>
      );
      console.log("no message data")
    }
  }, [data]);

  return (
    <View style={[styles.container, { width: width, height: height }]}>
      <Svg width={screenWidth} height={height + margin.top + margin.bottom}>
        {chartContent}
      </Svg>
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Regret Level</Text>
        <View style={[styles.legendLine, { marginRight: 40, borderColor: '#3BB0E5' }]}/>
        <Text style={styles.legendText}>Average Regret</Text>
        <View style={[styles.legendLine, { borderStyle: 'dotted', borderColor : 'red' }]} />
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

export default WeeklySummaryChart;
