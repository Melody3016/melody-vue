<template>
  <div class="reset">
    <el-row justify="center" align="middle" style="height: 100%">
      <el-col class="layout">
        <div>
          <Header></Header>
          <div style="position: relative">
            <el-tabs v-model="activeTabName" size="large">
              <!-- 手机号重置密码 -->
              <el-tab-pane v-if="type === 1" name="mobile">
                <template #label>
                  <span style="display: flex; align-items: center">
                    <el-icon style="margin-right: 6px"><Iphone /></el-icon>
                    使用手机号重置密码
                  </span>
                </template>
                <el-form
                  class="form"
                  ref="mobileRef"
                  :model="mobileModel"
                  :rules="mobileRules"
                  @keydown.enter="submitReset"
                >
                  <el-form-item name="mobile" prop="mobile">
                    <el-input
                      placeholder="请输入注册绑定手机号"
                      type="tel"
                      v-model="mobileModel.mobile"
                      size="large"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><Iphone /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item name="code" prop="code">
                    <el-row justify="space-between" style="align-items: center; width: 100%">
                      <el-input
                        v-model="mobileModel.code"
                        size="large"
                        clearable
                        placeholder="请输入验证码"
                        type="tel"
                        :maxlength="6"
                        style="width: 67%; padding-left: 0"
                      >
                        <template #prefix>
                          <el-icon><Message /></el-icon>
                        </template>
                      </el-input>
                      <CountDownButton
                        ref="countDown"
                        @on-click="handleClick"
                        :autoCountDown="autoCountDown"
                        size="large"
                        :loading="sending"
                        text="获取验证码"
                      />
                    </el-row>
                  </el-form-item>
                  <el-form-item name="password" prop="password">
                    <el-popover
                      :visible="showPwdTip"
                      placement="right"
                      :popper-style="{ width: '220px' }"
                    >
                      <div>
                        <p :style="{ color: strokeColor }">强度：{{ mobileModel.passStrength }}</p>
                        <p>
                          <el-progress
                            :percentage="percent"
                            :show-text="false"
                            :status="progressStatus"
                          />
                        </p>
                        <p>请至少输入6个字符。请不要使用容易被猜到的密码。</p>
                      </div>

                      <template #reference>
                        <el-input
                          placeholder="请输入新的密码"
                          v-model="mobileModel.password"
                          size="large"
                          @input="pwdChange"
                          @focus="showPwdTip = true"
                          @blur="showPwdTip = false"
                          show-password
                        >
                          <template #prefix>
                            <el-icon><Lock /></el-icon>
                          </template>
                        </el-input>
                      </template>
                    </el-popover>
                  </el-form-item>
                  <el-form-item name="password2" prop="password2">
                    <el-input
                      placeholder="请再次输入密码"
                      v-model="mobileModel.password2"
                      size="large"
                      show-password
                    >
                      <template #prefix>
                        <el-icon><Lock /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <!-- 邮箱重置密码 -->
              <el-tab-pane v-else name="email">
                <template #label>
                  <span style="display: flex; align-items: center">
                    <el-icon style="margin-right: 6px"><MessageBox /></el-icon>
                    使用邮箱重置密码
                  </span>
                </template>
                <el-form
                  class="form"
                  ref="emailRef"
                  :model="emailModel"
                  :rules="emailRules"
                  @keydown.enter="submitReset"
                >
                  <el-form-item name="email" prop="email">
                    <el-input
                      placeholder="请输入注册绑定邮箱地址"
                      v-model="emailModel.email"
                      size="large"
                      clearable
                    >
                      <template #prefix>
                        <el-icon><MessageBox /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item name="code" prop="code">
                    <el-row justify="space-between" style="align-items: center; width: 100%">
                      <el-input
                        v-model="emailModel.code"
                        type="tel"
                        size="large"
                        clearable
                        placeholder="请输入验证码"
                        :maxlength="6"
                        style="width: 67%; padding-left: 0"
                      >
                        <template #prefix>
                          <el-icon><Message /></el-icon>
                        </template>
                      </el-input>
                      <CountDownButton
                        ref="countDown"
                        @on-click="handleClick"
                        :autoCountDown="autoCountDown"
                        size="large"
                        :loading="sending"
                        text="获取验证码"
                      />
                    </el-row>
                  </el-form-item>
                  <el-form-item name="password" prop="password">
                    <el-popover
                      :visible="showPwdTip"
                      placement="right"
                      :popper-style="{ width: '220px' }"
                    >
                      <div>
                        <p :style="{ color: strokeColor }">强度：{{ emailModel.passStrength }}</p>
                        <p>
                          <el-progress
                            :percentage="percent"
                            :show-text="false"
                            :status="progressStatus"
                          />
                        </p>
                        <p>请至少输入6个字符。请不要使用容易被猜到的密码。</p>
                      </div>

                      <template #reference>
                        <el-input
                          placeholder="请输入新的密码"
                          v-model="emailModel.password"
                          size="large"
                          @input="pwdChange"
                          @focus="showPwdTip = true"
                          @blur="showPwdTip = false"
                          show-password
                        >
                          <template #prefix>
                            <el-icon><Lock /></el-icon>
                          </template>
                        </el-input>
                      </template>
                    </el-popover>
                  </el-form-item>
                  <el-form-item name="password2" prop="password2">
                    <el-input
                      placeholder="请再次输入密码"
                      v-model="emailModel.password2"
                      size="large"
                      show-password
                    >
                      <template #prefix>
                        <el-icon><Lock /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <el-row justify="space-between" style="margin-bottom: 15px">
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="submitReset"
                long
                style="width: 100%"
              >
                <span v-if="!loading">重置密码</span>
                <span v-else>重置密码中</span>
              </el-button>
            </el-row>
            <el-row justify="start">
              <router-link to="/login">
                <el-icon><Back /></el-icon>
                <span>返回</span>
              </router-link>
            </el-row>
          </div>
        </div>
        <Footer></Footer>
      </el-col>
    </el-row>
    <el-dialog v-model="visible" title="验证" :destroy-on-close="true">
      <ImgCaptcha ref="captcha" @change="captchaChange"></ImgCaptcha>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handleOk">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Lock, MessageBox, Message, Back, Iphone } from '@element-plus/icons-vue';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
import CountDownButton from '@/views/my-components/xboot/count-down-button.vue';
import ImgCaptcha from '@/views/my-components/xboot/img-captcha.vue';
// import SlideVerify from "@/components/common/slideverify.vue"
import useReset from './hooks/useReset';
import type { FormInstance } from 'element-plus';
import type { Fragment } from 'vue/jsx-runtime';

const instance = getCurrentInstance();
// props
// interface Props {
//   type?: number;
// }
// const props = withDefaults(defineProps<Props>(), {
//   type: 1
// });
// 获取路由信息
const $route = useRoute();
const type = ref<number>(Number($route.query.type || 1));

// tabs
const activeTabName = ref(type.value === 1 ? 'mobile' : 'email');
// UI
const loading = ref(false);
const mobileRef = ref<FormInstance>();
const emailRef = ref<FormInstance>();

// 密码强度显示
const showPwdTip = ref(false);
const percent = ref(0);
const progressStatus = ref<'exception' | 'success' | 'warning' | ''>('');
const strokeColor = ref('#ed3f14');
const checkStrengthValue = (v: string) => {
  // 评级制判断密码强度 最高5
  let grade = 0;
  if (/\d/.test(v)) {
    grade++; //数字
  }
  if (/[a-z]/.test(v)) {
    grade++; //小写
  }
  if (/[A-Z]/.test(v)) {
    grade++; //大写
  }
  if (/\W/.test(v)) {
    grade++; //特殊字符
  }
  if (v.length >= 10) {
    grade++;
  }
  return grade;
};
const pwdChange = (value: string) => {
  // 强度判断
  // console.log(e.target.value)
  const v = value;
  if (!v) return;
  const grade = checkStrengthValue(v);
  if (grade <= 1) {
    progressStatus.value = 'exception';
    mobileModel.passStrength = '弱';
    emailModel.passStrength = '弱';
    percent.value = 33;
    strokeColor.value = '#ed3f14';
  } else if (grade >= 2 && grade <= 4) {
    progressStatus.value = '';
    mobileModel.passStrength = '中';
    emailModel.passStrength = '中';
    percent.value = 66;
    strokeColor.value = '#2d8cf0';
  } else {
    progressStatus.value = 'success';
    mobileModel.passStrength = '强';
    emailModel.passStrength = '强';
    percent.value = 100;
    strokeColor.value = '#52c41a';
  }
};

// 验证码功能
const visible = ref(false);
let code = '';
let captchaId = '';
const captchaChange = (a: string, b: string) => {
  code = a;
  captchaId = b;
};

// 点击按钮
const handleClick = async () => {
  // 验证手机号或邮箱
  const ref = type.value === 1 ? mobileRef : emailRef;
  const res = await onValidate(ref.value);
  if (!res) return;
  visible.value = true;
};
const handleOk = async () => {
  if (!code) {
    ElMessage.error('请填写验证码');
    return;
  }
  visible.value = false;
  // 验证验证码
  const res = await sendCode(captchaId, code);
  if (res) {
    ElMessage.success('验证码发送成功！');
  }
};

// 注册功能hook
const {
  sending,
  autoCountDown,
  mobileModel,
  mobileRules,
  emailModel,
  emailRules,
  sendCode,
  onValidate,
  onReset
} = useReset(type.value);

// 点击注册
const submitReset = async () => {
  const ref = type.value === 1 ? mobileRef : emailRef;
  const success = await onReset(ref.value);
  if (success) {
    // 跳转到登录
    console.log('跳转到登录页面');
    instance?.proxy?.$router.push({
      path: '/login'
    });
  }
};
</script>

<style lang="scss" scoped>
.reset {
  position: relative;
  height: 100%;
  background: url('@/assets/images/background.svg');
  background-color: #f0f2f5;

  .layout {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 368px;
    height: 100%;

    :deep(.el-input__wrapper) {
      font-size: 16px;
    }

    .mobile {
      :deep(.el-input-group__prepend) {
        width: 25%;

        div {
          height: 100%;
        }
      }
    }

    :deep(.el-tabs__item) {
      height: 66px;
      font-size: 18px;
    }
  }
}
</style>
