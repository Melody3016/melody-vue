<template>
  <div class="login">
    <div class="layout">
      <Header></Header>
      <div class="pane" style="position: relative">
        <el-tabs v-model="activeTabName" :stretch="true" class="tabs">
          <el-tab-pane name="user">
            <template #label>
              <span style="display: flex; align-items: center">
                <el-icon style="margin-right: 6px"><User /></el-icon>
                <span>账户密码登录</span>
              </span>
            </template>
            <el-form
              class="my-form"
              ref="accLoginRef"
              :model="accLoginModel"
              :rules="accLoginRules"
              @keyup.enter="submitLogin"
            >
              <el-form-item name="username" prop="username">
                <el-input
                  v-model="accLoginModel.username"
                  placeholder="请输入用户名"
                  size="large"
                  autocomplete="off"
                  allowClear
                  clearable
                  input-style="font-size:16px"
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="password" prop="password">
                <el-input
                  v-model="accLoginModel.password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                  clearable
                  input-style="font-size:16px"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="imgCode" prop="code">
                <div class="imgCode">
                  <el-input
                    v-model="accLoginModel.code"
                    size="large"
                    clearable
                    placeholder="请输入验证码"
                    :maxlength="4"
                    class="input-verify"
                    input-style="font-size:16px"
                  >
                    <template #prefix>
                      <el-icon><Message /></el-icon
                    ></template>
                  </el-input>
                  <div
                    v-loading="loadingCaptcha"
                    class="code-image"
                    style="position: relative; font-size: 12px"
                  >
                    <img
                      :src="captchaImg"
                      alt="加载验证码失败"
                      @click="getCaptchaImg"
                      v-loading="Boolean(captchaImg)"
                      style="
                        width: 110px;
                        height: 38px;
                        line-height: 38px;
                        cursor: pointer;
                        display: block;
                      "
                    />
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="phone">
            <template #label>
              <span style="display: flex; align-items: center">
                <el-icon style="margin-right: 6px"><Iphone /></el-icon>
                <span>手机短信登录</span>
              </span>
            </template>
            <el-form
              ref="phoneLoginRef"
              :model="mobLoginModel"
              :rules="mobLoginRules"
              @keyup.enter="submitLogin"
            >
              <el-form-item name="mobile" prop="mobile">
                <el-input
                  v-model="mobLoginModel.mobile"
                  placeholder="请输入手机号"
                  type="tel"
                  size="large"
                  clearable
                  input-style="font-size:16px"
                >
                  <template #prefix>
                    <el-icon><Iphone /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="code" prop="code">
                <el-row type="flex" justify="space-between" class="sms-code">
                  <el-input
                    v-model="mobLoginModel.code"
                    type="tel"
                    size="large"
                    clearable
                    placeholder="请输入短信验证码"
                    :maxlength="6"
                    class="input-verify"
                    input-style="font-size:16px"
                  >
                    <template #prefix>
                      <el-icon><Message /></el-icon>
                    </template>
                  </el-input>
                  <CountDownButton
                    ref="countDown"
                    @on-click="() => sendSmsCode(phoneLoginRef)"
                    :autoCountDown="autoCountDown"
                    size="large"
                    :loading="sending"
                    text="获取验证码"
                    style="width: 110px"
                  />
                </el-row>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-tooltip placement="right-start">
          <template #content>
            <span>扫码登录</span>
          </template>
          <el-icon @click="toQrCodeLogin" class="qr-code"><Grid /></el-icon>
        </el-tooltip>

        <el-row justify="space-between" align="middle">
          <el-checkbox v-model:checked="saveLogin" size="large"
            ><span style="font-size: 16px">自动登录</span></el-checkbox
          >
        </el-row>
        <el-row style="margin: 20px 0">
          <el-button
            class="login-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="submitLogin"
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中</span>
          </el-button>
        </el-row>
        <el-row justify="space-between" align="middle">
          <el-dropdown placement="bottom-start">
            <span class="forget-pass">忘记密码</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item name="resetByMobile"><router-link to="/reset">使用手机号重置密码</router-link></el-dropdown-item>
                <el-dropdown-item name="resetByEmail"><router-link to="/reset?type=2">使用邮箱重置密码</router-link></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <router-link to="/register">
            <span class="forget-pass">点击注册</span>
          </router-link>
        </el-row>
        <!-- <a-row type="flex" justify="space-between" class="other-login">
              <div class="other-way icons">
                {{ $t('otherLogin') }}
                <div class="other-icon" @click="toGithubLogin">
                  <github-outlined />
                </div>
                <div class="other-icon" @click="toQQLogin">
                  <qq-outlined />
                </div>
                <div class="other-icon" @click="toWeixinLogin">
                  <wechat-outlined />
                </div>
                <down-outlined v-show="!showMore" class="other-icon" @click="showMore = true" />
                <div class="other-icon" v-show="showMore" @click="toWeiboLogin">
                  <weibo-outlined />
                </div>
                <div class="other-icon" v-show="showMore" @click="toDingdingLogin">
                  <dingding-outlined />
                </div>
                <up-outlined v-show="showMore" class="other-icon" @click="showMore = false" />
              </div>
              <router-link to="/register">
                <a class="forget-pass">{{ $t('register') }}</a>
              </router-link>
            </a-row> -->
      </div>
      <Footer></Footer>
    </div>
    <!-- <LangSwitch /> -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { User, Lock, Iphone, Message, Grid } from '@element-plus/icons-vue';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
import CountDownButton from '@/views/my-components/xboot/count-down-button.vue';
import useCaptchaImg from '@/hooks/useCaptchaImg';
import useNotice from './hooks/useNotice';
import useAccountLogin from './hooks/useAccountLogin';
import type { FormInstance } from 'element-plus';
import usePhoneLogin from './hooks/usePhoneLogin';
// import useAfterLogin from './hooks/useAfterLogin';

onMounted(() => {
  // relatedLogin();
  // 通知提醒框
  getNoticeInfo();
  // 获取验证码
  getCaptchaImg();
});
const $router = useRouter();
const instance = getCurrentInstance();

// UI
// const showMore = ref(false);
const saveLogin = ref(true);
const activeTabName = ref('user');
const loading = ref(false);

// 生成通知提醒框
const { getNoticeInfo } = useNotice();

// 生成验证码
const { loadingCaptcha, captchaImg, captchaId, getCaptchaImg } = useCaptchaImg();

// 账户密码登录
const accLoginRef = ref<FormInstance>();
const { accLoginModel, accLoginRules, loginByAccount } = useAccountLogin(getCaptchaImg);

// 手机验证码登录
const phoneLoginRef = ref<FormInstance>();
const { mobLoginModel, mobLoginRules, sending, autoCountDown, sendSmsCode, loginByPhone } =
  usePhoneLogin();

// 登录
const submitLogin = async () => {
  if (!accLoginRef.value || !phoneLoginRef.value) return;
  loading.value = true;
  let accessToken = null;
  if (activeTabName.value === 'user') {
    // 账号密码登录
    accessToken = await loginByAccount(saveLogin.value, captchaId.value, accLoginRef.value);
  } else {
    // 手机验证码登录
    accessToken = await loginByPhone(saveLogin.value, phoneLoginRef.value);
  }
  if (accessToken) {
    console.log('登录成功！', accessToken);
    // const { afterLogin } = useAfterLogin(instance);
    // await afterLogin(accessToken, saveLogin.value);
  }
  loading.value = false;
};

// 二维码登录
const toQrCodeLogin = () => {
  $router.push('/login-qr');
};
// const relatedLogin = () => {};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background: url('@/assets/images/background.svg');
  background-color: #f0f2f5;

  .layout {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .pane {
      flex: 1;
      width: 368px;

      .tabs {
        :deep(.el-tabs__nav-wrap) {
          width: 90%;
        }

        :deep(.el-tabs__item) {
          height: 66px;
          font-size: 18px;
        }

        .my-form {
          .imgCode {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .input-verify {
              flex: 0 1 240px;
            }
          }
        }
      }

      .qr-code {
        position: absolute;
        top: 18px;
        right: 0;
        font-size: 34px;
        color: #409eff;
        cursor: pointer;
        transition: all 0.3s ease 0.1s;

        &:hover {
          transform: scale(1.5);
          svg {
            clip-path: none;
            // clip-path: polygon(-85% 0%, 0% -100%, 200% 100%, 0% 100%);
          }
        }
        svg {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 0);
        }
      }
      .login-btn {
        width: 100%;
      }
      .forget-pass {
        font-size: 16px;
        color: #409eff;
      }
      .sms-code {
        flex-wrap: nowrap;
        width: 100%;

        .input-verify {
          flex: 0 1 240px;
        }
      }
    }
  }
}
</style>
