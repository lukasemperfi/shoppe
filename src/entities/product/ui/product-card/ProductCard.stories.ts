import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from 'storybook/test'
import ProductCard from './ProductCard.vue'

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  tags: ['autodocs'],
  args: {
    name: 'Lira Earrings',
    price: 20,
    onAddToCart: fn(),
  },
  argTypes: {
    badge: {
      control: 'object',
    },
    imageUrl: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => ({
    components: { ProductCard },
    setup() {
      const onAdd = fn()
      return { onAdd }
    },
    template: `
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: clamp(16px, 4vw, 40px);
          justify-content: center;
          align-items: flex-start;
          max-width: 1320px;
          margin: 0 auto;
        "
      >
        <ProductCard
          name="Lira Earrings"
          :price="20"
          :old-price="25.32"
          image-url="https://loremflickr.com/300/300/earrings?lock=10"
          :badge="{ text: '-%21', variant: 'discount' }"
          @add-to-cart="onAdd"
        />
        <ProductCard
          name="Lira Earrings"
          :price="20"
          image-url="https://loremflickr.com/300/300/jewelry?lock=11"
          :badge="{ text: 'Earring', variant: 'category' }"
          @add-to-cart="onAdd"
        />
        <ProductCard
          name="Lira Earrings"
          :price="20"
          image-url="https://loremflickr.com/300/300/pearl?lock=12"
          :badge="{ text: 'Sold', variant: 'sold' }"
          is-sold-out
        />
        <ProductCard
          name="Lira Earrings"
          :price="20"
          image-url="https://loremflickr.com/300/300/watch?lock=13"
          :badge="{ text: 'New', variant: 'new' }"
          @add-to-cart="onAdd"
        />
      </div>
    `,
  }),
}

export const Discount: Story = {
  args: {
    price: 20,
    oldPrice: 25.32,
    imageUrl: 'https://loremflickr.com/300/300/earrings?lock=2',
    badge: { text: '-%21', variant: 'discount' },
  },
}

export const Category: Story = {
  args: {
    imageUrl: 'https://loremflickr.com/300/300/ring?lock=3',
    badge: { text: 'Earring', variant: 'category' },
    oldPrice: null,
  },
}

export const SoldOut: Story = {
  args: {
    imageUrl: 'https://loremflickr.com/300/300/necklace?lock=4',
    badge: { text: 'Sold', variant: 'sold' },
    isSoldOut: true,
    oldPrice: null,
  },
}

export const New: Story = {
  args: {
    imageUrl: 'https://loremflickr.com/300/300/bracelet?lock=5',
    badge: { text: 'New', variant: 'new' },
    oldPrice: null,
  },
}
