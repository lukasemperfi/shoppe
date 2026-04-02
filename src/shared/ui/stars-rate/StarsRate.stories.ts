import type { Meta, StoryObj } from '@storybook/vue3'
import StarsRate from './StarsRate.vue'

const meta: Meta<typeof StarsRate> = {
  component: StarsRate,
  tags: ['autodocs'],
  argTypes: {
    rate: {
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      description: 'Рейтинг от 0 до 5',
    },
    readonly: {
      control: 'boolean',
      description: 'Показывать только рейтинг без возможности клика',
    },
  },
}

export default meta
type Story = StoryObj<typeof StarsRate>

export const Default: Story = {
  args: {
    rate: 3,
  },
}

export const Full: Story = {
  args: {
    rate: 5,
  },
}

export const Fractional: Story = {
  args: {
    rate: 3.7,
  },
}

export const Empty: Story = {
  args: {
    rate: 0,
  },
}

export const Showcase: Story = {
  render: () => ({
    components: { StarsRate },
    template: `
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div>0.5 stars: <StarsRate :rate="0.5" /></div>
        <div>1.2 stars: <StarsRate :rate="1.2" /></div>
        <div>2.8 stars: <StarsRate :rate="2.8" /></div>
        <div>4.4 stars: <StarsRate :rate="4.4" /></div>
        <div>4.9 stars: <StarsRate :rate="4.9" /></div>
      </div>
    `,
  }),
}
