import type { Meta, StoryObj } from "@storybook/react";
import ArchitectureAreaChart from "./ArchitectureAreaChart";

// Generate sample data
const generateSampleData = () => {
  const years = Array.from({ length: 61 }, (_, i) => 1960 + i);
  
  return years.map(year => {
    let analog: number;
    let digital: number;
    
    if (year < 1970) {
      analog = Math.round(Math.random() * 5);
      digital = 0;
    } else if (year < 1980) {
      analog = Math.round(Math.random() * 35 + 5);
      digital = Math.round(Math.random() * 10);
    } else if (year < 1990) {
      analog = Math.round(Math.random() * 20 + 10);
      digital = Math.round(Math.random() * 40 + 5);
    } else if (year < 2000) {
      analog = Math.round(Math.random() * 15 + 5);
      digital = Math.round(Math.random() * 35 + 15);
    } else if (year < 2010) {
      analog = Math.round(Math.random() * 20 + 10);
      digital = Math.round(Math.random() * 30 + 20);
    } else {
      analog = Math.round(Math.random() * 25 + 15);
      digital = Math.round(Math.random() * 40 + 10);
    }
    
    return { year, analog, digital };
  });
};

const meta = {
  title: "Charts/ArchitectureAreaChart",
  component: ArchitectureAreaChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 900,
    height: 500,
    margin: { top: 40, right: 120, bottom: 40, left: 60 },
    colors: {
      digital: '#FFA500',
      analog: '#9370DB'
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
} satisfies Meta<typeof ArchitectureAreaChart>;

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
    width: 600,
    height: 400,
  },
};

export const AlternativeColors: Story = {
  args: {
    ...meta.args,
    colors: {
      digital: '#4169E1',
      analog: '#FF69B4'
    },
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 140, bottom: 60, left: 80 },
  },
};