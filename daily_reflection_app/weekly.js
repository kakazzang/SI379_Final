import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { startOfMonth, endOfMonth, format } from 'date-fns';

const WeeklySummaryChart = ({ data }) => {
  const containerWidth = '100%';
  const containerHeight = '100%';
  const [chartContent, setChartContent] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const margin = { top: 10, right: -40, bottom: 10, left: 40 };
      const width = containerWidth === '100%' ? 300 : parseInt(containerWidth);
      const height = containerHeight === '100%' ? 200 : parseInt(containerHeight);

      // Group data by month
      const groupedData = d3.group(data, (d) => format(new Date(d.date), 'yyyy-MM'));

      const x = d3.scaleBand()
        .domain([...groupedData.keys()])
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, 5])
        .range([height - margin.bottom, margin.top]);

      const barWidth = x.bandwidth();

      const bars = Array.from(groupedData).map(([month, monthData], i) => (
        <Rect
          key={i}
          x={x(month)}
          y={y(d3.mean(monthData, d => d.regretLevel))}
          width={barWidth}
          height={height - margin.bottom - y(d3.mean(monthData, d => d.regretLevel))}
          fill="steelblue"
        />
      ));

      const xLabels = Array.from(groupedData.keys()).map((month, i) => (
        <SvgText
          key={i}
          x={x(month) + barWidth / 2}
          y={height - margin.bottom + 20}
          fontSize="10"
          textAnchor="middle"
        >
          {month}
        </SvgText>
      ));

      const yTicks = d3.ticks(0, 5, 6);
      const yLabels = yTicks.map((tick, i) => (
        <SvgText
          key={i}
          x={margin.left - 5}
          y={y(tick)}
          fontSize="10"
          textAnchor="end"
          dy="3"
        >
          {tick}
        </SvgText>
      ));

      const newChartContent = (
        <G>
          {bars}
          {xLabels}
          {yLabels}
        </G>
      );

      setChartContent(newChartContent);
    } else {
      setChartContent(
        <View style={styles.noDataText}>
          <Text style={styles.noDataText}>
            Not enough data to create a chart.
          </Text>
        </View>
      );
    }
  }, [data, containerWidth, containerHeight]);

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]}>
      <Svg width="100%" height="100%">
        {chartContent}
      </Svg>
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
  }
});

export default WeeklySummaryChart;
