import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import * as d3 from 'd3';
import Svg, { G, Path, Text as SvgText, TSpan } from 'react-native-svg';

// import { View, StyleSheet } from 'react-native';
// import { Card, Text } from 'react-native-elements';
// import * as d3 from 'd3';
// import Svg, { G, Path, Text as SvgText, TSpan } from 'react-native-svg';

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

   // Define your custom colors here
   const customColors = ['#FF0000', '#FF7400', '#FFC100', '#79c314', '#487de7', '#4b369d', '#70369d', '#FF0000', '#FF7400', '#FFC100', '#79c314', '#487de7', '#4b369d', '#70369d'];

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.month))
    // .range(d3.schemeCategory10);
    .range(customColors);

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
              <TSpan x={0} dy="1.5em" fillOpacity={0.7}>
                {d.data.value.toLocaleString("en-US")}
              </TSpan>
            )}
          </SvgText>
        ))}
      </G>
    </Svg>
  );

//   return (
//     <View>
//       <Text style={styles.title}>Monthly Satisfaction Score Summary</Text>
//       {svg}
//     </View>
//   );
// };
return (
  <Card containerStyle={styles.card}>
    <Card.Title style={styles.title}>Monthly Satisfaction Score Summary</Card.Title>
    <Card.Divider />
    <View style={styles.chartContainer}>
      {svg}
    </View>
  </Card>
);
};

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
// });
const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default MonthlySummaryChart;

// const MonthlySummaryChart = ({ width, data }) => {

//   // include count of scores for each month
//   const aggregatedData = data.reduce((acc, entry) => {
//     const existingEntry = acc.find(item => item.month === entry.month);
//     if (existingEntry) {
//       existingEntry.count += 1;
//       existingEntry.totalScore += entry.score;
//     } else {
//       acc.push({
//         month: entry.month,
//         count: 1,
//         totalScore: entry.score,
//       });
//     }
//     return acc;
//   }, []);

//   const height = Math.min(width, 500);
//   const radius = Math.min(width, height) / 2;

//   const arc = d3.arc()
//     .innerRadius(radius * 0.67)
//     .outerRadius(radius - 1);

//   const pie = d3.pie()
//     .padAngle(1 / radius)
//     .sort(null)
//     .value(d => d.value);

//    // Define your custom colors here
//    const customColors = ['#FF0000', '#FF7400', '#FFC100', '#79c314', '#487de7', '#4b369d', '#70369d', '#FF0000', '#FF7400', '#FFC100', '#79c314', '#487de7', '#4b369d', '#70369d'];

//   const color = d3.scaleOrdinal()
//     .domain(data.map(d => d.month))
//     // .range(d3.schemeCategory10);
//     .range(customColors);

//   const svg = (
//     <Svg
//       width={width}
//       height={height}
//       viewBox={[-width / 2, -height / 2, width, height]}
//       style={{ maxWidth: '100%', height: 'auto' }}
//     >
//       <G>
//         {pie(data).map((d, index) => (
//           <Path
//             key={index}
//             fill={color(d.data.month)}
//             d={arc(d)}
//           />
//         ))}
//       </G>
//       <G fontFamily="sans-serif" fontSize={12} textAnchor="middle">
//         {pie(data).map((d, index) => (
//           <SvgText
//             key={index}
//             transform={`translate(${arc.centroid(d)})`}
//           >
//             <TSpan dy="-0.4em" fontWeight="bold">{d.data.month}</TSpan>
//             {(d.endAngle - d.startAngle) > 0.25 && (
//               <TSpan x={0} dy="1.5em" fillOpacity={0.7}>
//                 {d.data.value.toLocaleString("en-US")}
//               </TSpan>
//             )}
//           </SvgText>
//         ))}
//       </G>
//     </Svg>
//   );

// //   return (
// //     <View>
// //       <Text style={styles.title}>Monthly Satisfaction Score Summary</Text>
// //       {svg}
// //     </View>
// //   );
// // };
// return (
//   <Card containerStyle={styles.card}>
//     <Card.Title style={styles.title}>Monthly Satisfaction Score Summary</Card.Title>
//     <Card.Divider />
//     <View style={styles.chartContainer}>
//       {svg}
//     </View>
//   </Card>
// );
// };

// // const styles = StyleSheet.create({
// //   title: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     marginBottom: 10,
// //   },
// // });
// const styles = StyleSheet.create({
//   card: {
//     margin: 10,
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   chartContainer: {
//     alignItems: 'center',
//   },
// });

// export default MonthlySummaryChart;

// import React from 'react';
// import { View } from 'react-native';
// import { Svg, G, Line, Circle, Text } from 'react-native-svg';
// import * as d3 from 'd3';

// const MonthlySummaryChart = ({ data, width, height }) => {
//   // Set margins and dimensions
//   const margin = { top: 20, right: 20, bottom: 30, left: 30 };
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;

//   // Extract x and y values from data
//   const xValues = data.map(d => d.x);
//   const yValues = data.map(d => d.y);

//   // Create scales
//   const xScale = d3.scaleLinear().domain([d3.min(xValues), d3.max(xValues)]).range([0, innerWidth]);
//   const yScale = d3.scaleLinear().domain([0, d3.max(yValues)]).range([innerHeight, 0]);

//   // Generate line function
//   const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

//   return (
//     <View>
//       <Svg width={width} height={height}>
//         <G transform={`translate(${margin.left},${margin.top})`}>
//           {/* Draw line */}
//           <Line
//             x1={0}
//             y1={yScale(d3.max(yValues))}
//             x2={innerWidth}
//             y2={yScale(d3.max(yValues))}
//             stroke="black"
//           />
          
//           {/* Draw markers */}
//           {data.map((d, index) => (
//             <G key={index} transform={`translate(${xScale(d.x)},${yScale(d.y)})`}>
//               <Circle r={5} fill="blue" />
//               <Text
//                 x={10}
//                 y={-10}
//                 fontSize={12}
//                 fill="black"
//                 textAnchor="middle"
//               >
//                 {d.y}
//               </Text>
//             </G>
//           ))}

//           {/* Draw line */}
//           <Line
//             d={line(data)}
//             fill="none"
//             stroke="blue"
//             strokeWidth={2}
//           />
//         </G>
//       </Svg>
//     </View>
//   );
// };

// export default MonthlySummaryChart;

// import React from 'react';
// import { View } from 'react-native';
// import { Svg, G, Line, Circle, Text } from 'react-native-svg';
// import * as d3 from 'd3';

// import React from 'react';
// import { View } from 'react-native';
// import { LineChart, XAxis, YAxis } from 'react-native-svg';
// import * as shape from 'd3-shape';

// const MonthlySummaryChart = ({ data }) => {
//   const width = 928;
//   const height = 500;
//   const marginTop = 20;
//   const marginRight = 30;
//   const marginBottom = 30;
//   const marginLeft = 40;

//   const xValues = data.map(d => d.date);
//   const yValues = data.map(d => d.close);

//   const xScale = d3.scaleUtc()
//     .domain(d3.extent(xValues))
//     .range([marginLeft, width - marginRight]);

//   const yScale = d3.scaleLinear()
//     .domain([0, d3.max(yValues)])
//     .range([height - marginBottom, marginTop]);

//   const line = d3.line()
//     .x(d => xScale(d.date))
//     .y(d => yScale(d.close))
//     .curve(shape.curveMonotoneX);

//   return (
//     <View>
//       <LineChart
//         style={{ height, width }}
//         data={data}
//         yAccessor={({ item }) => item.close}
//         xAccessor={({ item }) => item.date}
//         svg={{ stroke: 'steelblue', strokeWidth: 2 }}
//         curve={shape.curveMonotoneX}
//       />
//       <XAxis
//         data={data}
//         xAccessor={({ item }) => item.date}
//         scale={xScale}
//         contentInset={{ left: 10, right: 10 }}
//         formatLabel={(value, index) => index}
//         numberOfTicks={width / 80}
//         svg={{ fontSize: 10, fill: 'black' }}
//       />
//       <YAxis
//         data={data}
//         yAccessor={({ item }) => item.close}
//         scale={yScale}
//         contentInset={{ top: 20, bottom: 20 }}
//         svg={{ fontSize: 10, fill: 'black' }}
//       />
//     </View>
//   );
// };

// export default MonthlySummaryChart;
