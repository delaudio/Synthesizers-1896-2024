import type { Meta, StoryObj } from "@storybook/react";
import DurationScatterPlot from "./DurationScatterPlot";

// Generate sample data
const generateSampleData = () => {
  const baseData = Array.from({ length: 50 }, (_, i) => {
    const year = 1970 + i;
    let baseDuration;
    
    if (year < 1990) {
      baseDuration = 3.5 - (year - 1970) * 0.1;
    } else if (year < 2000) {
      baseDuration = 2;
    } else {
      baseDuration = 2 + Math.pow((year - 2000) / 10, 2);
    }
    
    // Add some random variation
    const duration = baseDuration + (Math.random() - 0.5) * 2;
    
    return {
      year,
      duration: Math.max(0, duration),
    };
  });

  // Add prediction point
  baseData.push({
    year: 2027,
    duration: 6,
  });

  return baseData;
};

const meta = {
  title: "Charts/DurationScatterPlot",
  component: DurationScatterPlot,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 900,
    height: 500,
    margin: { top: 40, right: 200, bottom: 60, left: 60 },
    colors: {
      points: '#800080',  // Purple
      prediction: '#FF0000', // Red
      line: '#FFA500'     // Orange
    }
  },
  argTypes: {
    width: {
      control: { type: "range", min: 600, max: 1400, step: 50 },
    },
    height: {
      control: { type: "range", min: 300, max: 800, step: 50 },
    },
    margin: {
      control: "object",
    },
    colors: {
      control: "object",
    },
  },
} satisfies Meta<typeof DurationScatterPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...meta.args,
  },
};

export const Compact: Story = {
  args: {
    ...meta.args,
    width: 700,
    height: 400,
  },
};

export const AlternativeColors: Story = {
  args: {
    ...meta.args,
    colors: {
      points: '#4B0082',  // Indigo
      prediction: '#DC143C', // Crimson
      line: '#DAA520'     // Goldenrod
    },
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 220, bottom: 80, left: 80 },
  },
};