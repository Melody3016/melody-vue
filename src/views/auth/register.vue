<template>
  <div class="register">
    <el-row justify="center" align="middle" style="height: 100%">
      <el-col class="layout">
        <div>
          <Header></Header>
          <div style="position: relative">
            <el-form
              class="form"
              ref="regRef"
              @keydown.enter="submitRegister"
              :model="regModel"
              :rules="rules"
            >
              <el-form-item name="username" prop="username">
                <el-input
                  placeholder="请输入用户名"
                  v-model="regModel.username"
                  size="large"
                  clearable
                >
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="password" prop="password">
                <el-popover :visible="showPwdTip" placement="right" :popper-style="{ width: '220px' }">
                  <div>
                    <p :style="{ color: strokeColor }">强度：{{ regModel.passStrength }}</p>
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
                      placeholder="请输入密码"
                      v-model="regModel.password"
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
                  v-model="regModel.password2"
                  size="large"
                  show-password
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="email" prop="email">
                <el-input placeholder="请输入邮箱地址" v-model="regModel.email" size="large">
                  <template #prefix>
                    <el-icon><MessageBox /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item name="mobile" prop="mobile">
                <el-input type="tel" placeholder="请输入手机号" v-model="regModel.mobile" size="large" class="mobile">
                  <template #prepend>
                    <el-select v-model="areaCode">
                      <el-option label="+86" value="1" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item name="code" prop="code">
                <el-row justify="space-between" style="align-items: center; width: 100%">
                  <el-input
                    v-model="regModel.code"
                    size="large"
                    clearable
                    type="tel"
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
            </el-form>
            <el-row justify="space-between" style="margin-bottom: 15px">
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="submitRegister"
                long
                style="width: 100%"
              >
                <span v-if="!loading">注册</span>
                <span v-else>注册中</span>
              </el-button>
            </el-row>
            <el-row justify="end">
              <router-link to="/login">
                <span class="forget-pass">使用已有账号登录</span>
              </router-link>
            </el-row>
          </div>
        </div>
        <Footer></Footer>
      </el-col>
    </el-row>
    <!-- <el-dialog v-model="slideVisible" title="滑动验证" :width="400" :destroy-on-close="true">
      <SlideVerify :on-success="handleSuccess"></SlideVerify>
    </el-dialog> -->
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
import { User, Lock, MessageBox, Message } from '@element-plus/icons-vue';
import Header from '@/views/main-components/header.vue';
import Footer from '@/views/main-components/footer.vue';
import CountDownButton from '@/views/my-components/xboot/count-down-button.vue';
import ImgCaptcha from '@/views/my-components/xboot/img-captcha.vue';
// import SlideVerify from "@/components/common/slideverify.vue"
import useRegister from './hooks/useRegister';
import type { FormInstance } from 'element-plus';

const instance = getCurrentInstance();
const areaCode = ref('1');
// UI
const loading = ref(false);
const regRef = ref<FormInstance>();

// 密码强度显示
const showPwdTip = ref(false)
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
    regModel.passStrength = '弱';
    percent.value = 33;
    strokeColor.value = '#ed3f14';
  } else if (grade >= 2 && grade <= 4) {
    progressStatus.value = '';
    regModel.passStrength = '中';
    percent.value = 66;
    strokeColor.value = '#2d8cf0';
  } else {
    progressStatus.value = 'success';
    regModel.passStrength = '强';
    percent.value = 100;
    strokeColor.value = '#52c41a';
  }
};

// 滑块验证
const slideVisible = ref(false);
const handleSuccess = () => {
  setTimeout(async () => {
    slideVisible.value = false;
    visible.value = true;
  }, 1000);
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
  // 验证手机号
  const res = await onValMobile(regRef.value);
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
  const res = await sendSmsCode(captchaId, code);
  if (res) {
    ElMessage.success('验证码发送成功！');
  }
};

// 注册功能hook
const { sending, autoCountDown, regModel, rules, sendSmsCode, onValMobile, onRegister } =
  useRegister();

// 点击注册
const submitRegister = async () => {
  const success = await onRegister(regRef.value);
  if (success) {
    // 跳转到注册成功页面
    console.log('跳转到注册成功页面');
    instance?.proxy?.$router.push({
      path: '/register-result',
      query: {
        username: regModel.username
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.register {
  position: relative;
  height: 100%;
  background: url('@/assets/images/background.svg');
  background-color: #f0f2f5;

  :deep(.ant-input) {
    padding-left: 15px;
  }

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
  }
}
</style>
