import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import Tabs from './Tabs.vue'
import TabsTrigger from './TabsTrigger.vue'
import TabsPanel from './TabsPanel.vue'
import TabsList from './TabsList.vue'

const meta: Meta<typeof Tabs> = {
  tags: ['autodocs'],
  component: Tabs,
}

export default meta

export const Default: StoryObj = {
  render: () => ({
    components: { Tabs, TabsTrigger, TabsPanel, TabsList },
    setup() {
      const activeTab = ref('orders')
      return { activeTab }
    },
    template: `
      <Tabs v-model="activeTab">
          <TabsList>
            <TabsTrigger id="dashboard">
              Dashboard
            </TabsTrigger>
            <TabsTrigger id="orders">
              Orders
            </TabsTrigger>
            <TabsTrigger id="addresses">
              Addresses
            </TabsTrigger>
          </TabsList>
        
        <div class="tabs-content-container">
          <TabsPanel id="dashboard">
            <div>
              <div >Ethereum Card</div>
              <div >Solana Card</div>
            </div>
          </TabsPanel>
          
          <TabsPanel id="orders">
            <div>
              <p>No recent transactions found.</p>
            </div>
          </TabsPanel>

          <TabsPanel id="addresses">
            <div>
              <p> Some addresses </p>
            </div>
          </TabsPanel>
        </div>
      </Tabs>
    `,
  }),
}
