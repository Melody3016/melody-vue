<template>
  <div class="login">
    <div class="layout">
      <div style="margin-top: 20px;">
        <Header></Header>
        <div style="position: relative">
          <el-tabs v-model="activeTabName">
            <el-tab-pane name="user">
              <template #label>
                <span>
                  <el-icon><User /></el-icon>
                  <span>账户密码登录</span>
                </span>
              </template>
              <el-form class="form">
                <el-form-item name="username">
                  <el-input
                    placeholder="请输入用户名"
                    size="large"
                    autocomplete="off"
                    allowClear
                    clearable
                  >
                    <template #prefix>
                      <el-icon><User /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item name="password">
                  <el-input placeholder="请输入密码" size="large" show-password clearable>
                    <template #prefix>
                      <el-icon><Lock /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item name="imgCode">
                  <el-row
                    type="flex"
                    justify="space-between"
                    style="align-items: center; overflow: hidden"
                  >
                    <el-input
                      size="large"
                      allowClear
                      autocomplete="off"
                      placeholder="请输入验证码"
                      :maxlength="10"
                      class="input-verify"
                    />
                    <div
                      v-loading="loadingCaptcha"
                      class="code-image"
                      style="position: relative; font-size: 12px"
                    >
                      <img
                        :src="captchaImg"
                        alt="加载验证码失败"
                        @click="getCaptchaImg"
                        style="
                          width: 110px;
                          height: 32px;
                          line-height: 32px;
                          cursor: pointer;
                          display: block;
                        "
                      />
                    </div>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane name="phone">
              <template #label>
                <el-icon><Iphone /></el-icon>
                <span>手机短信登录</span>
              </template>
              <el-form class="form">
                <el-form-item name="mobile">
                  <el-input placeholder="请输入手机号" size="large" clearable>
                    <template #prefix>
                      <el-icon><Iphone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item name="code">
                  <el-row type="flex" justify="space-between">
                    <el-input
                      size="large"
                      clearable
                      placeholder="请输入短信验证码"
                      :maxlength="6"
                      class="input-verify"
                    >
                      <template #prefix>
                        <el-icon><Message /></el-icon>
                      </template>
                    </el-input>
                    <!-- <CountDownButton
                        ref="countDown"
                        @on-click="sendSmsCode"
                        :autoCountDown="autoCountDown"
                        size="large"
                        :loading="sending"
                        :text="getSms"
                      /> -->
                  </el-row>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <!-- <a-tooltip @click="toQrCodeLogin" placement="rightTop">
              <template #title>
                <span>{{ $t('qrCodeTip') }}</span>
              </template>
              <qrcode-outlined />
            </a-tooltip> -->

          <!-- <a-row type="flex" justify="space-between" align="middle">
              <a-checkbox v-model:checked="saveLogin" size="large">{{
                $t('autoLogin')
              }}</a-checkbox>
              <a-dropdown :trigger="['click']" @on-click="handleDropDown">
                <a class="forget-pass">{{ $t('forgetPass') }}</a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item name="resetByMobile">{{ $t('phoneResetPwd') }}</a-menu-item>
                    <a-menu-item name="resetByEmail">{{ $t('emailResetPwd') }}</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-row> -->
          <!-- <a-row>
              <a-button
                class="login-btn"
                type="primary"
                size="large"
                :loading="loading"
                @click="submitLogin"
                long
              >
                <span v-if="!loading">{{ $t('login') }}</span>
                <span v-else>{{ $t('logining') }}</span>
              </a-button>
            </a-row> -->
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
      </div>
      <Footer></Footer>
    </div>
    <!-- <LangSwitch /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
import { User, Lock, Iphone, Message } from '@element-plus/icons-vue';
import useCaptchaImg from '@/hooks/useCaptchaImg';
// import useNotice from './hooks/useNotice';
// import useAccountLogin from './hooks/useAccountLogin';
// import usePhoneLogin from './hooks/usePhoneLogin';
// import useAfterLogin from './hooks/useAfterLogin';

onMounted(() => {
  relatedLogin();
  // getNoticeInfo();
  getCaptchaImg();
});
const $router = useRouter();
const instance = getCurrentInstance();

// UI
const showMore = ref(false);
const saveLogin = ref(true);
const activeTabName = ref('user');
const loading = ref(false);

// 生成通知提醒框
// const { getNoticeInfo } = useNotice();

// 生成验证码
const { loadingCaptcha, captchaImg, captchaId, getCaptchaImg } = useCaptchaImg();

// 账户密码登录
// const { accLoginModel, validateInfosAcc, loginByAccount } = useAccountLogin(getCaptchaImg);

// 手机验证码登录
// const { mobLoginModel, validateInfosMob, sending, autoCountDown, sendSmsCode, loginByPhone } =
//   usePhoneLogin();

// 登录
const submitLogin = async () => {
  // loading.value = true;
  // let accessToken = null;
  // if (tabKey.value === '1') {
  //   // 账号密码登录
  //   accessToken = await loginByAccount(saveLogin.value, captchaId.value);
  // } else {
  //   // 手机验证码登录
  //   accessToken = await loginByPhone(saveLogin.value);
  // }
  // if (accessToken) {
  //   const { afterLogin } = useAfterLogin(instance);
  //   await afterLogin(accessToken, saveLogin.value);
  // }
  // loading.value = false;
};

// 二维码登录
const toQrCodeLogin = () => {
  $router.push('/login-qr');
};
const relatedLogin = () => {};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background: url('@/assets/background.svg');
  background-color: #f0f2f5;

  .layout {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 368px;
    height: 100%;

    :deep(.ant-tabs) {
      .ant-tabs-nav-wrap {
        display: block;
        .ant-tabs-nav-list {
          width: 90%;
          .ant-tabs-tab {
            flex: 1;
            font-size: 17px;
            .ant-tabs-tab-btn {
              margin: 0 auto;
            }
          }
        }
      }
      .ant-tabs-content {
        transition: margin 0.5s;
        .ant-input {
          padding-left: 15px;
        }
        #form_item_imgCode {
          padding-left: 0;
        }
      }
    }

    :deep(.anticon-qrcode) {
      position: absolute;
      top: 18px;
      right: 0;
      font-size: 34px;
      color: #1da57a;
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
  }

  :deep(.ant-tabs-nav-wrap) {
    line-height: 2;
    font-size: 17px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    zoom: 1;
  }

  .form {
    padding-top: 1vh;

    .input-verify {
      width: 67%;
    }
  }

  .code-image {
    height: 32px;
    :deep(.ant-spin-spinning) {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 8;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.9);
      .ant-spin-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        font-size: 17px;
      }
    }
  }

  .forget-pass,
  .other-way {
    font-size: 14px;
  }

  .login-btn,
  .other-login {
    margin-top: 3vh;
  }

  .icons {
    display: flex;
    align-items: center;
  }

  .other-icon {
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.2);

    :hover {
      color: #2d8cf0;
    }
  }
}
</style>
