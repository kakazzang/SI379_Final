import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as d3 from 'd3';
import Svg, { G, Path, Text as SvgText, TSpan } from 'react-native-svg';

const MonthlySummaryChart = ({ width, data }) => {
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

  const arc = d3.arc()
    .innerRadius(radius * 0.67)
    .outerRadius(radius - 1);

  const pie = d3.pie()
    .padAngle(1 / radius)
    .sort(null)
    .value(d => d.value);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.month))
    .range(d3.schemeCategory10);

  const svg = (
    <Svg
      width={width}
      height={height}
      viewBox={[-width / 2, -height / 2, width, height]}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <G>
        {pie(data).map((d, index) => (
          <Path
            key={index}
            fill={color(d.data.month)}
            d={arc(d)}
          />
        ))}
      </G>
      <G fontFamily="sans-serif" fontSize={12} textAnchor="middle">
        {pie(data).map((d, index) => (
          <SvgText
            key={index}
            transform={`translate(${arc.centroid(d)})`}
          >
            <TSpan dy="-0.4em" fontWeight="bold">{d.data.month}</TSpan>
            {(d.endAngle - d.startAngle) > 0.25 && (
              <TSpan x={0} dy="0.7em" fillOpacity={0.7}>
                {d.data.value.toLocaleString("en-US")}
              </TSpan>
            )}
          </SvgText>
        ))}
      </G>
    </Svg>
  );

  return (
    <View>
      <Text style={styles.title}>Monthly Satisfaction Score Summary</Text>
      {svg}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default MonthlySummaryChart;
