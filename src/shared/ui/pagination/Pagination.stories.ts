import type { Meta, StoryObj } from '@storybook/vue3'
import Pagination from './Pagination.vue'
import { ref } from 'vue'

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: (args) => ({
    components: { Pagination },
    setup() {
      const currentPage = ref(args.current)
      return { args, currentPage }
    },
    template: `
      <div style="padding: 20px;">
        <Pagination 
          v-bind="args" 
          v-model:current="currentPage" 
        />
        <p style="margin-top: 20px; font-family: 'DM Sans'; font-size: 14px;">
          Current Page: {{ currentPage }}
        </p>
      </div>
    `,
  }),
  args: {
    total: 5,
    current: 1,
  },
}

export const LongPagination: Story = {
  args: {
    total: 20,
    current: 10,
    siblingCount: 1,
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const currentPage = ref(args.current)
      return { args, currentPage }
    },
    template: '<Pagination v-bind="args" v-model:current="currentPage" />',
  }),
}

export const StartOfList: Story = {
  args: {
    total: 20,
    current: 1,
  },
  render: (args) => ({
    components: { Pagination },
    setup() {
      const currentPage = ref(args.current)
      return { args, currentPage }
    },
    template: '<Pagination v-bind="args" v-model:current="currentPage" />',
  }),
}
