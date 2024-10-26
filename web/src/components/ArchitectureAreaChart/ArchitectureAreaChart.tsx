import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  digital: number;
  analog: number;
}

type ArchitectureType = 'digital' | 'analog';

interface StackedDataPoint extends d3.Series<DataPoint, ArchitectureType> {
  key: ArchitectureType;
}

interface ArchitectureAreaChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: {
    digital: string;
    analog: string;
  };
}

interface Dimensions {
  width: number;
  height: number;
  margin: Required<NonNullable<ArchitectureAreaChartProps['margin']>>;
  innerWidth: number;
  innerHeight: number;
}

interface Scales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

const DEFAULT_DIMENSIONS: Dimensions = {
  width: 900,
  height: 500,
  margin: { top: 40, right: 120, bottom: 40, left: 60 },
  innerWidth: 0, // Calculated in component
  innerHeight: 0, // Calculated in component
};

const DEFAULT_COLORS = {
  digital: '#FFA500', // Orange
  analog: '#9370DB',  // Purple
};

const GridLine: React.FC<{
  value: number;
  x1: number;
  x2: number;
  y: number;
}> = ({ value, x1, x2, y }) => (
  <line
    key={`grid-${value}`}
    x1={x1}
    x2={x2}
    y1={y}
    y2={y}
    stroke="#e0e0e0"
    strokeDasharray="2,2"
  />
);

const AxisLabel: React.FC<{
  x: number;
  y: number;
  transform?: string;
  children: React.ReactNode;
}> = ({ x, y, transform, children }) => (
  <text
    x={x}
    y={y}
    transform={transform}
    textAnchor="middle"
    fill="#666"
    fontSize="14px"
  >
    {children}
  </text>
);

const LegendItem: React.FC<{
  color: string;
  label: string;
  y: number;
}> = ({ color, label, y }) => (
  <g transform={`translate(0, ${y})`}>
    <rect
      width={18}
      height={18}
      fill={color}
      opacity={0.8}
    />
    <text
      x={25}
      y={14}
      fontSize="12px"
      fill="#666"
    >
      {label}
    </text>
  </g>
);

const ArchitectureAreaChart: React.FC<ArchitectureAreaChartProps> = ({
  data,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  margin = DEFAULT_DIMENSIONS.margin,
  colors = DEFAULT_COLORS,
}) => {
  // Calculate dimensions
  const dimensions: Dimensions = useMemo(() => ({
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }), [width, height, margin]);

  // Create scales and process data
  const { scales, stackedData } = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year) as [number, number])
      .range([0, dimensions.innerWidth]);

    const stack = d3.stack<DataPoint>()
      .keys(['analog', 'digital'] as const)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stacked = stack(data) as StackedDataPoint[];

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(stacked[1], d => d[1]) || 0])
      .nice()
      .range([dimensions.innerHeight, 0]);

    return {
      scales: { xScale, yScale } as Scales,
      stackedData: stacked,
    };
  }, [data, dimensions.innerWidth, dimensions.innerHeight]);

  // Create area generator
  const areaGenerator = useMemo(() => {
    return d3.area<[number, number]>()
      .x((_, i) => scales.xScale(data[i].year))
      .y0(d => scales.yScale(d[0]))
      .y1(d => scales.yScale(d[1]))
      .curve(d3.curveMonotoneX);
  }, [scales, data]);

  // Generate axis ticks
  const { xTicks, yTicks } = useMemo(() => ({
    xTicks: scales.xScale.ticks(10),
    yTicks: scales.yScale.ticks(6),
  }), [scales]);

  return (
    <div className="architecture-area-chart">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Synthesizer Architecture Types Over Time"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {yTicks.map(tick => (
            <GridLine
              key={tick}
              value={tick}
              x1={0}
              x2={dimensions.innerWidth}
              y={scales.yScale(tick)}
            />
          ))}

          {/* Areas */}
          {stackedData.map((layer) => (
            <path
              key={layer.key}
              d={areaGenerator(layer as unknown as Array<[number, number]>) || ''}
              fill={colors[layer.key]}
              opacity={0.8}
            />
          ))}

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              y1={0}
              y2={0}
              stroke="#666"
            />
            {xTicks.map(year => (
              <g
                key={year}
                transform={`translate(${scales.xScale(year)}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="12px"
                >
                  {year}
                </text>
              </g>
            ))}
            <AxisLabel
              x={dimensions.innerWidth / 2}
              y={35}
            >
              Year
            </AxisLabel>
          </g>

          {/* Y-axis */}
          <g>
            <line
              y2={dimensions.innerHeight}
              stroke="#666"
            />
            {yTicks.map(tick => (
              <g
                key={tick}
                transform={`translate(0, ${scales.yScale(tick)})`}
              >
                <line x2={-6} stroke="#666" />
                <text
                  x={-10}
                  dy=".32em"
                  textAnchor="end"
                  fill="#666"
                  fontSize="12px"
                >
                  {tick}
                </text>
              </g>
            ))}
            <AxisLabel
              x={-dimensions.innerHeight / 2}
              y={-40}
              transform="rotate(-90)"
            >
              Count
            </AxisLabel>
          </g>

          {/* Legend */}
          <g transform={`translate(${dimensions.innerWidth + 20}, 0)`}>
            {[
              { key: 'Digital', color: colors.digital },
              { key: 'Analog', color: colors.analog }
            ].map((item, i) => (
              <LegendItem
                key={item.key}
                color={item.color}
                label={item.key}
                y={i * 25}
              />
            ))}
          </g>

          {/* Chart title */}
          <text
            x={dimensions.innerWidth / 2}
            y={-dimensions.margin.top / 2}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
          >
            Count of Synthesizer Architecture Types Over Time (Digital & Analog)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default ArchitectureAreaChart;