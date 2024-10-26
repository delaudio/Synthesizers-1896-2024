import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  unitsSold: number;
  fame: number;
  showLabel?: boolean;
}

interface ScatterPlotProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pointColor?: string;
}

const DEFAULT_DIMENSIONS = {
  width: 1000,
  height: 600,
  margin: { top: 40, right: 40, bottom: 60, left: 60 },
};

const SalesScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  width = DEFAULT_DIMENSIONS.width,
  height = DEFAULT_DIMENSIONS.height,
  margin = DEFAULT_DIMENSIONS.margin,
  pointColor = '#FF7F7F' // Light coral color
}) => {
  const dimensions = useMemo(() => ({
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  }), [width, height, margin]);

  // Create scales
  const scales = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain([0, 1]) // Fame is normalized between 0 and 1
      .range([0, dimensions.innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.unitsSold) || 0])
      .range([dimensions.innerHeight, 0])
      .nice();

    return { xScale, yScale };
  }, [data, dimensions]);

  // Generate grid lines
  const { xTicks, yTicks } = useMemo(() => ({
    xTicks: scales.xScale.ticks(10),
    yTicks: scales.yScale.ticks(8),
  }), [scales]);

  // Function to calculate annotation line endpoint
  const getAnnotationEndpoint = (point: DataPoint) => {
    const offset = point.unitsSold > 150000 ? -40 : 40; // Adjust offset based on position
    return {
      x: scales.xScale(point.fame) + offset,
      y: scales.yScale(point.unitsSold) - 20
    };
  };

  return (
    <div className="sales-scatter-plot">
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        role="img"
        aria-label="Units Sold vs Fame Scatter Plot"
      >
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          {/* Grid lines */}
          {xTicks.map(tick => (
            <line
              key={`x-grid-${tick}`}
              x1={scales.xScale(tick)}
              x2={scales.xScale(tick)}
              y1={0}
              y2={dimensions.innerHeight}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}
          {yTicks.map(tick => (
            <line
              key={`y-grid-${tick}`}
              x1={0}
              x2={dimensions.innerWidth}
              y1={scales.yScale(tick)}
              y2={scales.yScale(tick)}
              stroke="#e0e0e0"
              strokeDasharray="2,2"
            />
          ))}

          {/* Data points and annotations */}
          {data.map((point, i) => (
            <g key={`point-${i}`}>
              <circle
                cx={scales.xScale(point.fame)}
                cy={scales.yScale(point.unitsSold)}
                r={5}
                fill={pointColor}
              />
              
              {point.showLabel && (
                <>
                  {/* Annotation line */}
                  <line
                    x1={scales.xScale(point.fame)}
                    y1={scales.yScale(point.unitsSold)}
                    x2={getAnnotationEndpoint(point).x}
                    y2={getAnnotationEndpoint(point).y}
                    stroke="#666"
                    strokeWidth={1}
                  />
                  
                  {/* Label text */}
                  <text
                    x={getAnnotationEndpoint(point).x}
                    y={getAnnotationEndpoint(point).y - 5}
                    textAnchor={point.unitsSold > 150000 ? "end" : "start"}
                    fontSize="12px"
                    fill="#666"
                  >
                    {point.name}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* X-axis */}
          <g transform={`translate(0, ${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              stroke="#666"
            />
            {xTicks.map(tick => (
              <g
                key={`x-tick-${tick}`}
                transform={`translate(${scales.xScale(tick)}, 0)`}
              >
                <line y2={6} stroke="#666" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="#666"
                  fontSize="12px"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            ))}
            <text
              x={dimensions.innerWidth / 2}
              y={45}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Fame
            </text>
          </g>

          {/* Y-axis */}
          <g>
            <line
              y2={dimensions.innerHeight}
              stroke="#666"
            />
            {yTicks.map(tick => (
              <g
                key={`y-tick-${tick}`}
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
                  {tick.toLocaleString()}
                </text>
              </g>
            ))}
            <text
              transform="rotate(-90)"
              x={-dimensions.innerHeight / 2}
              y={-40}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              Units Sold
            </text>
          </g>

          {/* Chart title */}
          <text
            x={dimensions.innerWidth / 2}
            y={-dimensions.margin.top / 2}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
          >
            Units Sold vs Fame
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SalesScatterPlot;