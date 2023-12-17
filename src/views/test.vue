<template>
  <div class="container">
    <h1 style="margin: 15px 0;">测试页面</h1>
    <el-popover placement="right" trigger="hover" :popper-style="{ width: '220px' }">
      <div>
        <p>请至少输入6个字符。请不要使用容易被猜到的密码。</p>
      </div>

      <template #reference>
        <el-input
          placeholder="请输入密码"
          v-model="regModel.password"
          size="large"
          @input="pwdChange"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
        <!-- <el-button >Focus to activate</el-button> -->
        <!-- <el-input placeholder="请输入密码"></el-input> -->
      </template>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { Lock } from '@element-plus/icons-vue';

const regModel = reactive({
  password: ''
});

const pwdChange = (e: any) => {
  console.log(e);
};
</script>
<style lang="scss" scoped>
.container {
  margin: 80px auto;
  width: 500px;
}
</style>
