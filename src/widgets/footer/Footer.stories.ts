import type { Meta, StoryObj } from '@storybook/vue3'
import Footer from './Footer.vue'

const meta: Meta<typeof Footer> = {
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  render: (args) => ({
    components: { Footer },

    template: `
    <div style=" margin-top: 30px;">
        <Footer />
    </div> 
    `,
  }),
}
