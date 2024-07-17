<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer class="q-pa-lg">
      <q-item-section class="text-grand-hotel constrain" style="font-size: 20px;">® Instagroum, a mediocre copy of Instagram</q-item-section>
      <div style="text-align: right" class="constrain">
        <q-item-section class="text-grand-hotel" style="font-size: 20px;">2024</q-item-section>
      </div>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default{
  name:"LayoutLogins"
}
</script>

<style>
.q-footer{
  background: linear-gradient(to right, #515BD4, #8134AF,#DD2A7B, #FEDA77, #F58529);
  display: flex;
  justify-content: center;
  align-items: center;
  height:18px;
}
</style>
