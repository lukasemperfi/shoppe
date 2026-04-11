import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Header from './Header.vue'

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
