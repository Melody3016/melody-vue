<template>
  <div>
    <div class="header">
      <!-- <img src="@/assets/logo-white.png" width="220px" v-if="mainTheme == 'darkMode'" />
      <img src="@/assets/logo-black.png" width="220" v-else /> -->
      <img src="@/assets/images/logo-social.png" width="300"/>
      <div class="description">前后端分离快速开发平台</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue';
// 主题
// const mainTheme = computed(() => {
//   // return this.$store.state.theme.theme.mainTheme
//   return '';
// });
</script>

<style lang="scss" scoped>
.header {
  margin-top: 8vh;
  margin-bottom: 5vh;
  text-align: center;

  .description {
    font-size: 20px;
    padding-top: 1vh;
  }
}
</style>
