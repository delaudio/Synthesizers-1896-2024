import type { Meta, StoryObj } from "@storybook/react";
import BrandBarChart from "./BrandBarChart";

const sampleData = [
  { brand: "Roland", releases: 263 },
  { brand: "Korg", releases: 256 },
  { brand: "Yamaha", releases: 169 },
  { brand: "E-mu", releases: 69 },
  { brand: "Kurzweil", releases: 67 },
  { brand: "Clavia", releases: 63 },
  { brand: "Moog", releases: 62 },
  { brand: "Akai", releases: 50 },
  { brand: "Ensoniq", releases: 37 },
  { brand: "Oberheim", releases: 37 }
];

const meta = {
  title: "Charts/BrandBarChart",
  component: BrandBarChart,
  parameters: {
    layout: "centered",
  },
  args: {
    data: sampleData,
    width: 900,
    height: 500,
    margin: { top: 40, right: 30, bottom: 60, left: 60 },
    barColor: '#FFB6C1'
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
    barColor: {
      control: "color",
    },
  },
} satisfies Meta<typeof BrandBarChart>;

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

export const AlternativeColor: Story = {
  args: {
    ...meta.args,
    barColor: '#87CEEB', // Sky blue
  },
};

export const LargeMargins: Story = {
  args: {
    ...meta.args,
    margin: { top: 60, right: 40, bottom: 80, left: 80 },
  },
};