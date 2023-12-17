<template>
  <div class="login">
    <el-row justify="center" align="middle" style="height: 100%">
      <el-col class="layout">
        <div>
          <Header></Header>
          <div style="position: relative">
            <el-tabs v-model="activeTabName" size="large">
              <el-tab-pane name="qr">
                <template #label>
                  <span style="display: flex; align-items: center">
                    <el-icon style="margin-right: 6px"><FullScreen /></el-icon>
                    扫码登录
                  </span>
                </template>
                <div class="qr-content">
                  <div class="code-content">
                    <img :src="qrUrl" class="qr-img" />
                    <div class="qr-status" v-show="qrStatus != '0' && qrStatus != '2'">
                      <span v-show="qrStatus == '-2'">二维码已失效</span>
                      <span v-show="qrStatus == '-1'">您已取消此次登录</span>
                      <el-icon color="#409eff" :size="34"
                        ><CircleCheckFilled v-show="qrStatus == '1'"
                      /></el-icon>
                      <span v-show="qrStatus == '1'" class="success">扫码成功</span>
                      <span v-show="qrStatus == '1'">请在手机上确认登录</span>
                      <el-button
                        size="small"
                        type="primary"
                        class="refresh"
                        @click="getQRCode"
                        v-show="qrStatus != '1'"
                        >点击刷新</el-button
                      >
                    </div>
                  </div>
                  <div class="qr-tip">请使用 App 扫描二维码登录</div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-tooltip placement="right-start">
              <template #content>
                <span>账号登录</span>
              </template>
              <el-icon class="anticon-desktop" @click="toAccountLogin"><Monitor /></el-icon>
            </el-tooltip>
            <el-row justify="end" class="other-login">
              <router-link to="/register">
                <span style="font-size: 18px" class="forget-pass">注册</span>
              </router-link>
            </el-row>
          </div>
        </div>
        <Footer></Footer>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { FullScreen, CircleCheckFilled, Monitor } from '@element-plus/icons-vue';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
import useQrCode from './hooks/useQrCode';

onMounted(() => {
  getQRCode();
});
onBeforeUnmount(() => {
  // 清除查询二维码状态定时器
  window.clearInterval(checkQRId.value);
});
const $router = useRouter();
// UI
const activeTabName = ref('qr');


// 二维码功能
const { qrUrl, qrStatus, checkQRId, getQRCode } = useQrCode();

// 账号登录
const toAccountLogin = () => {
  $router.push('/login');
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background: url('@/assets/images/background.svg');
  background-color: #f0f2f5;

  .other-login {
    margin-top: 3vh;
  }

  .layout {
    flex: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 368px;
    height: 100%;

    :deep(.el-tabs__nav-wrap) {
      width: 90%;
    }

    :deep(.el-tabs__item) {
      height: 66px;
      font-size: 18px;
    }

    .anticon-desktop {
      position: absolute;
      top: 18px;
      right: 0;
      font-size: 34px;
      color: #409eff;
      cursor: pointer;
      transition: all 0.3s ease 0.1s;

      &:hover {
        transform: scale(1.5);
      }
    }
  }

  .qr-content {
    height: 292px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .code-content {
      position: relative;
      box-sizing: border-box;
      width: 180px;
      height: 180px;
      padding: 7px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e5e5e5;
      transition: transform 0.3s;
      .qr-img {
        width: 164px;
        height: 164px;
      }
      .qr-status {
        opacity: 1;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: hsla(0, 0%, 100%, 0.9);
        font-size: 14px;
        color: #323233;
        font-weight: 500;
        transition: opacity 0.3s;
        .success {
          color: #409eff;
          font-size: 16px;
          margin: 5px 0;
        }
        .refresh {
          margin-top: 15px;
        }
      }
    }
    .qr-tip {
      margin-top: 30px;
    }
  }
}
</style>
