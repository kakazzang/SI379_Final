import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Path, Text as SvgText, TSpan } from 'react-native-svg';
import * as d3 from 'd3';

const D3Chart = ({ data, width }) => {
  useEffect(() => {
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
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    // Create an SVG element using react-native-svg components
    const paths = pie(data).map((d, index) => (
      <Path
        key={index}
        fill={color(d.data.name)}
        d={arc(d)}
      />
    ));

    const textElements = pie(data).map((d, index) => (
      <SvgText
        key={index}
        transform={`translate(${arc.centroid(d)})`}
      >
        <TSpan dy="-0.4em" fontWeight="bold">{d.data.name}</TSpan>
        {(d.endAngle - d.startAngle) > 0.25 && (
          <TSpan x={0} dy="0.7em" fillOpacity={0.7}>
            {d.data.value.toLocaleString("en-US")}
          </TSpan>
        )}
      </SvgText>
    ));

    // Return the SVG component
    return (
      <Svg width={width} height={height}>
        <G>{paths}</G>
        <G fontFamily="sans-serif" fontSize={12} textAnchor="middle">{textElements}</G>
      </Svg>
    );

  }, [data, width]);

  return (
    <View>
      {/* Your chart will be rendered here */}
      <Text style={styles.title}>Your Chart Title</Text>
    </View>
  );
};



export default D3Chart;
