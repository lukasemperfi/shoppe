import type { Meta, StoryObj } from '@storybook/vue3'
import Select from './Select.vue'
import { ref } from 'vue'

const meta: Meta<typeof Select> = {
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
  },
  decorators: [
    () => ({
      template: '<div style="width: 215px; padding: 20px; min-height: 250px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof Select>

const options = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Popularity', value: 'pop' },
]

export const Default: Story = {
  args: {
    options,
    placeholder: 'Sort by',
    modelValue: '',
  },
  render: (args) => ({
    components: { Select },
    setup() {
      const selected = ref(args.modelValue)
      return { args, selected }
    },
    template: '<Select v-bind="args" v-model="selected" />',
  }),
}

export const Selected: Story = {
  args: {
    options,
    modelValue: 'newest',
  },
  render: (args) => ({
    components: { Select },
    setup() {
      const selected = ref(args.modelValue)
      return { args, selected }
    },
    template: '<Select v-bind="args" v-model="selected" />',
  }),
}

export const ManyOptions: Story = {
  args: {
    placeholder: 'Select country',
    options: [
      { label: 'Ukraine', value: 'ua' },
      { label: 'USA', value: 'us' },
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
      { label: 'Poland', value: 'pl' },
      { label: 'Japan', value: 'jp' },
      { label: 'Australia', value: 'au' },
      { label: 'Canada', value: 'ca' },
      { label: 'Brazil', value: 'br' },
      { label: 'Italy', value: 'it' },
      { label: 'Spain', value: 'es' },
      { label: 'Russia', value: 'ru' },
      { label: 'Mexico', value: 'mx' },
      { label: 'Argentina', value: 'ar' },
      { label: 'Chile', value: 'cl' },
    ],
  },
  render: (args) => ({
    components: { Select },
    setup() {
      const selected = ref('')
      return { args, selected }
    },
    template: '<Select v-bind="args" v-model="selected" />',
  }),
}
