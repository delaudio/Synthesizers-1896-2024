import type { Meta, StoryObj } from "@storybook/react";
import SalesScatterPlot from "./SalesScatterPlot";

const sampleData = [
  // Notable points with labels
  { name: "Korg Triton", unitsSold: 300000, fame: 0.6, showLabel: true },
  { name: "Korg M1", unitsSold: 250000, fame: 0.6, showLabel: true },
  { name: "Roland D50", unitsSold: 200000, fame: 0.6, showLabel: true },
  { name: "Yamaha DX7", unitsSold: 160000, fame: 0.87, showLabel: true },
  { name: "Roland SH-101", unitsSold: 50000, fame: 0.8, showLabel: true },
  { name: "Roland Juno 106", unitsSold: 40000, fame: 0.85, showLabel: true },
  { name: "Korg MS-20", unitsSold: 30000, fame: 0.9, showLabel: true },
  { name: "Moog - Minimoog", unitsSold: 10000, fame: 1.0, showLabel: true },
  
  // Additional points without labels
  { name: "Other 1", unitsSold: 100000, fame: 0.5, showLabel: false },
  { name: "Other 2", unitsSold: 100000, fame: 0.8, showLabel: false },
  { name: "Other 3", unitsSold: 50000, fame: 0.5, showLabel: false },
  { name: "Other 4", unitsSold: 25000, fame: 0.4, showLabel: false },
  // Add more unlabeled points to match the pattern
  ...Array.from({ length: 15 }, (_, i) => ({
    name: `Other ${i + 5}`,
    unitsSold: Math.random() * 10000,
    fame: 0.2 + Math.random() * 0.6,
    showLabel: false
  }))
];

const meta = {
  title: "Charts/SalesScatterPlot",
  component: SalesScatterPlot,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 1000,
    height: 600,
    margin: { top: 40, right: 40, bottom: 60, left: 60 },
    pointColor: '#FF7F7F'
  },
  argTypes: {
    width: {
      control: { type: "range", min: 800, max: 1400, step: 50 },
    },
    height: {
      control: { type: "range", min: 400, max: 800, step: 50 },
    },
    margin: {
      control: "object",
    },
    pointColor: {
      control: "color",
    },
  },
} satisfies Meta<typeof SalesScatterPlot>;

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
    width: 800,
    height: 500,
  },
};

export const AlternativeColor: Story = {
  args: {
    ...meta.args,
    pointColor: '#4169E1', // Royal Blue
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 60, bottom: 80, left: 80 },
  },
};