import type { Meta, StoryObj } from "@storybook/react";
import DensityChart from "./DensityChart";

const meta = {
  title: "Charts/DensityChart",
  component: DensityChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: generateSampleData(),
    width: 800,
    height: 400,
    color: "#9370DB",
    margin: { top: 20, right: 30, bottom: 30, left: 40 },
    bandwidth: 5,
  },
  argTypes: {
    width: {
      control: { type: "range", min: 300, max: 1200, step: 50 },
    },
    height: {
      control: { type: "range", min: 200, max: 800, step: 50 },
    },
    color: {
      control: "color",
    },
    margin: {
      control: "object",
    },
    bandwidth: {
      control: { type: "range", min: 1, max: 20, step: 1 },
    },
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate sample data
function generateSampleData(): number[] {
  // Generate years from 1900 to 2020
  const years = Array.from({ length: 121 }, (_, i) => 1900 + i);

  return years.flatMap((year) => {
    let count: number;
    if (year < 1960) {
      count = Math.random() * 2;
    } else if (year < 1980) {
      count = Math.random() * 10 + 5;
    } else if (year < 2000) {
      count = Math.random() * 20 + 15;
    } else if (year < 2010) {
      count = Math.random() * 30 + 25;
    } else {
      count = Math.max(0, Math.random() * 40 + 20 - Math.abs(year - 2010) * 2);
    }

    return Array(Math.round(count)).fill(year);
  });
}

export const Default: Story = {
  args: {
    ...meta.args,
    data: generateSampleData(),
    width: 800,
    height: 400,
    color: "#9370DB",
    margin: { top: 20, right: 30, bottom: 30, left: 40 },
    bandwidth: 5,
  },
};

