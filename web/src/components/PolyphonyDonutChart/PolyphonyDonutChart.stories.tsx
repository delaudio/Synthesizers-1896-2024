import type { Meta, StoryObj } from "@storybook/react";
import PolyphonyDonutChart from "./PolyphonyDonutChart";

const sampleData = [
  { value: 1, count: 378 },    // 34.3%
  { value: 8, count: 130 },    // 11.8%
  { value: 16, count: 93 },    // 8.4%
  { value: 64, count: 83 },    // 7.5%
  { value: 128, count: 81 },   // 7.4%
  { value: 32, count: 80 },    // 7.3%
  { value: 6, count: 78 },     // 7.1%
  { value: 4, count: 75 },     // 6.8%
  { value: 2, count: 61 },     // 5.5%
  { value: 12, count: 43 }     // 3.9%
];

const meta = {
  title: "Charts/PolyphonyDonutChart",
  component: PolyphonyDonutChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 600,
    height: 600,
    innerRadius: 100,
    outerRadius: 250,
    colors: [
      '#1e3799', // Dark blue
      '#4834d4', // Purple
      '#686de0', // Light purple
      '#be2edd', // Pink purple
      '#e056fd', // Pink
      '#ff7979', // Coral
      '#f0932b', // Orange
      '#ffbe76', // Light orange
      '#badc58', // Yellow green
      '#c7ecee', // Light blue
    ],
  },
  argTypes: {
    width: {
      control: { type: "range", min: 400, max: 1000, step: 50 },
    },
    height: {
      control: { type: "range", min: 400, max: 1000, step: 50 },
    },
    innerRadius: {
      control: { type: "range", min: 50, max: 200, step: 10 },
    },
    outerRadius: {
      control: { type: "range", min: 150, max: 400, step: 10 },
    },
  },
} satisfies Meta<typeof PolyphonyDonutChart>;

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
    width: 400,
    height: 400,
    innerRadius: 70,
    outerRadius: 170,
  },
};

export const Large: Story = {
  args: {
    ...meta.args,
    width: 800,
    height: 800,
    innerRadius: 150,
    outerRadius: 350,
  },
};

export const ThinRing: Story = {
  args: {
    ...meta.args,
    innerRadius: 200,
    outerRadius: 250,
  },
};