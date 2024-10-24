import React, { useMemo } from 'react';
import * as d3 from 'd3';

// Types and Interfaces
interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface DensityChartProps {
  data: number[];
  width?: number;
  height?: number;
  margin?: Margin;
  color?: string;
  bandwidth?: number;
}

type DensityData = [number, number][];

interface AxisTick {
  value: number;
  offset: number;
}

interface ScalesAndData {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  densityData: DensityData;
  areaGenerator: d3.Area<[number, number]>;
}

// Helper function to calculate density
const calculateDensity = (data: number[], bandwidth: number = 5): DensityData => {
  // Create a kernel density estimator
  const kde = (
    kernel: (u: number) => number,
    thresholds: number[],
    data: number[]
  ): DensityData => {
    return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d)) || 0]);
  };

  // Epanechnikov kernel function
  const epanechnikov = (bandwidth: number) => {
    return (x: number): number => {
      const scaled = x / bandwidth;
      return Math.abs(scaled) <= 1 ? 0.75 * (1 - scaled * scaled) / bandwidth : 0;
    };
  };

  const thresholds = d3.range(
    d3.min(data) || 0,
    (d3.max(data) || 0) + bandwidth,
    bandwidth
  );

  return kde(epanechnikov(bandwidth), thresholds, data);
};

const DensityChart: React.FC<DensityChartProps> = ({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 30, left: 40 },
  color = "#9370DB",
  bandwidth = 5
}) => {
  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Process data and create scales using useMemo to optimize performance
  const {
    xScale,
    yScale,
    densityData,
    areaGenerator
  }: ScalesAndData = useMemo(() => {
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data) as [number, number])
      .range([0, innerWidth]);

    // Calculate density data
    const densityData = calculateDensity(data, bandwidth);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(densityData, d => d[1]) || 0])
      .range([innerHeight, 0]);

    // Create area generator
    const areaGenerator = d3.area<[number, number]>()
      .x(d => xScale(d[0]))
      .y0(innerHeight)
      .y1(d => yScale(d[1]))
      .curve(d3.curveBasis);

    return {
      xScale,
      yScale,
      densityData,
      areaGenerator
    };
  }, [data, innerWidth, innerHeight, bandwidth]);

  // Create axis ticks
  const xAxis: AxisTick[] = useMemo(() => {
    return xScale.ticks(10).map(value => ({
      value,
      offset: xScale(value),
    }));
  }, [xScale]);

  const yAxis: AxisTick[] = useMemo(() => {
    return yScale.ticks(5).map(value => ({
      value,
      offset: yScale(value),
    }));
  }, [yScale]);

  // Axis components
  const GridLine: React.FC<{
    type: 'x' | 'y';
    offset: number;
    length: number;
  }> = ({ type, offset, length }) => (
    <line
      x1={type === 'x' ? offset : 0}
      x2={type === 'x' ? offset : length}
      y1={type === 'x' ? 0 : offset}
      y2={type === 'x' ? length : offset}
      stroke="#e0e0e0"
      strokeDasharray="2,2"
    />
  );

  const AxisTick: React.FC<{
    type: 'x' | 'y';
    value: number;
    offset: number;
  }> = ({ type, value, offset }) => (
    <g
      transform={
        type === 'x' 
          ? `translate(${offset}, 0)` 
          : `translate(0, ${offset})`
      }
    >
      <line
        {...(type === 'x' 
          ? { y2: 6 } 
          : { x2: -6 })}
        stroke="#666"
      />
      <text
        style={{
          fill: "#666",
          textAnchor: type === 'x' ? "middle" : "end",
          fontSize: "10px"
        }}
        {...(type === 'x'
          ? { dy: ".71em", y: 9 }
          : { dy: ".32em", x: -9 })}
      >
        {type === 'x' ? value : value.toFixed(3)}
      </text>
    </g>
  );

  return (
    <div className="density-chart">
      <svg 
        width={width} 
        height={height}
        role="img"
        aria-label="Density Chart"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Grid lines */}
          {xAxis.map(({ value, offset }) => (
            <GridLine
              key={`x-grid-${value}`}
              type="x"
              offset={offset}
              length={innerHeight}
            />
          ))}
          {yAxis.map(({ value, offset }) => (
            <GridLine
              key={`y-grid-${value}`}
              type="y"
              offset={offset}
              length={innerWidth}
            />
          ))}

          {/* Density area */}
          <path
            d={areaGenerator(densityData) || ''}
            fill={color}
            fillOpacity={0.6}
            stroke={color}
            strokeWidth={1}
          />

          {/* X-axis */}
          <g transform={`translate(0, ${innerHeight})`}>
            <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="#666" />
            {xAxis.map(({ value, offset }) => (
              <AxisTick
                key={`x-tick-${value}`}
                type="x"
                value={value}
                offset={offset}
              />
            ))}
          </g>

          {/* Y-axis */}
          <g>
            <line y2={innerHeight} stroke="#666" />
            {yAxis.map(({ value, offset }) => (
              <AxisTick
                key={`y-tick-${value}`}
                type="y"
                value={value}
                offset={offset}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default DensityChart;