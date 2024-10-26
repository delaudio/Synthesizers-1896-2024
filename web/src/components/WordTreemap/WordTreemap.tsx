import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface TreemapData {
  name: string;
  value?: number;
  children?: TreemapData[];
}

interface TreemapChartProps {
  data: TreemapData;
  width?: number;
  height?: number;
  padding?: number;
  colors?: {
    level1: string[];
    level2: string[];
    level3: string[];
  };
}

interface TreemapNode extends d3.HierarchyRectangularNode<TreemapData> {
  depth: number;
}

const DEFAULT_COLORS = {
  level1: ['#9B6B9E', '#7B68EE', '#9370DB'],
  level2: ['#F4C430', '#FFD700', '#FFA07A'],
  level3: ['#FFB6C1', '#FFA07A', '#FFD700']
};

const TITLE_HEIGHT = 40;

const WordTreemap: React.FC<TreemapChartProps> = ({
  data,
  width = 800,
  height = 600,
  padding = 1,
  colors = DEFAULT_COLORS,
}) => {
  // Create treemap layout with adjusted height for title
  const treemapRoot = useMemo(() => {
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0);

    const treemap = d3.treemap<TreemapData>()
      .size([width, height - TITLE_HEIGHT]) // Subtract title height
      .paddingOuter(padding)
      .paddingInner(padding)
      .round(true);

    return treemap(root);
  }, [data, width, height, padding]);

  // Get color based on node depth and index
  const getColor = (node: TreemapNode) => {
    const colorSet = node.depth === 1 
      ? colors.level1 
      : node.depth === 2 
        ? colors.level2 
        : colors.level3;
    return colorSet[node.depth % colorSet.length];
  };

  // Function to determine if text should be visible
  const shouldShowText = (node: TreemapNode) => {
    const minWidth = 60;
    const minHeight = 30;
    return node.x1 - node.x0 > minWidth && node.y1 - node.y0 > minHeight;
  };

  return (
    <div className="word-treemap">
      <svg 
        width={width} 
        height={height}
        role="img"
        aria-label="Top 30 Words in Synth Names"
      >
        {/* Title */}
        <text
          x={width / 2}
          y={TITLE_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20px"
          fontWeight="bold"
        >
          Top 30 Words in Synth Names
        </text>

        {/* Treemap cells - translate by title height */}
        <g transform={`translate(0, ${TITLE_HEIGHT})`}>
          {treemapRoot.descendants().map((node, i) => {
            const isLeaf = !node.children;
            return (
              <g key={`${node.data.name}-${i}`}>
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={node.x1 - node.x0}
                  height={node.y1 - node.y0}
                  fill={getColor(node as TreemapNode)}
                  stroke="white"
                  strokeWidth={1}
                />
                {shouldShowText(node as TreemapNode) && (
                  <text
                    x={(node.x0 + node.x1) / 2}
                    y={(node.y0 + node.y1) / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isLeaf ? "12px" : "14px"}
                    fontWeight={isLeaf ? "normal" : "bold"}
                    fill={isLeaf ? "#000" : "#000"}
                  >
                    {node.data.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default WordTreemap;