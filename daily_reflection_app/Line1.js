import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { G, Line, Path, Svg } from 'react-native-svg';
import { mixPath, ReText } from 'react-native-redash';
import * as d3 from 'd3';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LineChart = ({
  height,
  width,
  data,
  bottomPadding,
  leftPadding,
}) => {
  const [selectedGraph, setSelectedGraph] = useState(data[0]);
  const [previousGraph, setPreviousGraph] = useState({ ...data[0] });
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const [transition, setTransition] = useState(1);

  const calculateCurve = (dataPoints) => {
    const xScale = d3
      .scaleTime()
      .domain([
        new Date(dataPoints[0].date),
        new Date(dataPoints[dataPoints.length - 1].date),
      ])
      .range([leftPadding, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataPoints, (d) => d.regretLevel)])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.regretLevel))
      .curve(d3.curveLinear);

    const path = line(dataPoints);

    return path;
  };

  const onQuarterTapped = (quarter) => {
    if (isAnimationComplete) {
      setIsAnimationComplete(false);
      setTransition(0);

      const index = quarter - 1;
      const selectedData = data[index];

      setSelectedGraph({
        ...selectedData,
        curve: calculateCurve(data.slice(0, index + 1)),
      });

      setTransition(1);

      setPreviousGraph(selectedGraph);
      setIsAnimationComplete(true);
    }
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      d: mixPath(
        transition,
        previousGraph.curve,
        selectedGraph.curve,
      ),
    };
  });

  const mostRecent = useDerivedValue(() => {
    return `${selectedGraph.regretLevel}`;
  });

  const q1Tapped = () => onQuarterTapped(1);
  const q2Tapped = () => onQuarterTapped(2);
  const q3Tapped = () => onQuarterTapped(3);
  const q4Tapped = () => onQuarterTapped(4);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>FACEBOOK</Text>
        <ReText style={styles.priceText} text={mostRecent} />
      </View>
      <Animated.View style={styles.chartContainer}>
        <Svg width={width} height={height} stroke="#6231ff">
          <G y={-bottomPadding}>
            <Line
              x1={leftPadding}
              y1={height}
              x2={width}
              y2={height}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.6}
              x2={width}
              y2={height * 0.6}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <Line
              x1={leftPadding}
              y1={height * 0.2}
              x2={width}
              y2={height * 0.2}
              stroke={'#d7d7d7'}
              strokeWidth="1"
            />
            <AnimatedPath animatedProps={animatedProps} strokeWidth="2" />
          </G>
        </Svg>
      </Animated.View>
      {/* ... */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    marginTop: 8,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LineChart;
