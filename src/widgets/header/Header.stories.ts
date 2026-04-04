import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Header from './Header.vue'

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    cartCount: { control: { type: 'number', min: 0, max: 120 } },
  },
  args: {
    cartCount: 1,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
}

export const Mobile320: Story = {
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div style="max-width: 320px; margin: 0 auto; box-sizing: border-box; width: 100%;"><story /></div>',
    }),
  ],
}

export const EmptyCart: Story = {
  args: {
    cartCount: 0,
  },
}
