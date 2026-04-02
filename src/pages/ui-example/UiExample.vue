<script setup lang="ts">
import Icon from '@/shared/ui/icon/Icon.vue'
import Button from '@/shared/ui/button/Button.vue'
import Tabs from '@/shared/ui/tabs/Tabs.vue'
import TabsTrigger from '@/shared/ui/tabs/TabsTrigger.vue'
import TabsPanel from '@/shared/ui/tabs/TabsPanel.vue'
import TabsList from '@/shared/ui/tabs/TabsList.vue'
import { ref } from 'vue'

const activeTab = ref('history')
</script>
<template>
  <div>
    <h1>UI Example</h1>
    <Icon name="logo" />
    <Icon name="twitter" />
    <Button variant="primary" class="full">Primary</Button>
    <Button variant="outline">Outline</Button>
    <div style="background-color: black; padding: 20px; margin-top: 20px">
      <Button variant="outline" color="white" class="full">Outline</Button>
    </div>
    <div style="background-color: gray; padding: 20px; margin-top: 20px">
      <Tabs v-model="activeTab">
        <TabsList>
          <TabsTrigger id="wallet"> Wallet </TabsTrigger>
          <TabsTrigger id="history"> History </TabsTrigger>
          <TabsTrigger id="profile"> Profile </TabsTrigger>
        </TabsList>

        <div class="tabs-content-container">
          <TabsPanel id="wallet">
            <div class="wallet-list">
              <div class="wallet-item">Ethereum Card</div>
              <div class="wallet-item">Solana Card</div>
            </div>
          </TabsPanel>

          <TabsPanel id="history">
            <div class="history-list">
              <p>No recent transactions found.</p>
            </div>
          </TabsPanel>
          <TabsPanel id="profile">
            <div class="profile-list">
              <p>No recent transactions found.</p>
            </div>
          </TabsPanel>
        </div>
      </Tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
h1 {
  font-family: var(--font4);
}
</style>
