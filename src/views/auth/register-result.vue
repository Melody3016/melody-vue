<template>
  <div class="register-result">
    <el-row justify="center" align="middle" style="height: 100%">
      <el-col class="content">
        <Header></Header>
        <div class="success">
          <el-icon color="#409eff" :size="64"><CircleCheckFilled /></el-icon>
          <p class="success-words">恭喜您，您的账户：{{ username }} 注册成功</p>
          <div class="buttons">
            <router-link to="/login">
              <el-button type="primary" size="large" style="margin-right: 10px">立即登录</el-button>
            </router-link>
            <router-link to="/register">
              <el-button size="large">返回注册</el-button>
            </router-link>
          </div>
        </div>
        <Footer></Footer>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { CircleCheckFilled } from '@element-plus/icons-vue';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
const instance = getCurrentInstance();
const username = instance?.proxy?.$route.query.username;
onMounted(() => {
  if (!username) {
    // 非正常进入，返回注册
    instance?.proxy?.$router.replace('/register');
  }
});
</script>

<style lang="scss" scoped>
.register-result {
  height: 100%;
  background: url('@/assets/images/background.svg');
  background-color: #f0f2f5;

  .success {
    text-align: center;
    .success-words {
      margin-top: 32px;
      font-size: 20px;
      line-height: 28px;
    }

    .buttons {
      margin-top: 40px;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: 368px;
    height: 100%;
  }
}
</style>
