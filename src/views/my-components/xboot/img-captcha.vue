<template>
  <el-row justify="space-between" style="align-items: center; overflow: hidden">
    <el-input
      v-model="code"
      size="large"
      clearable
      placeholder="请输入验证码"
      :maxlength="10"
      class="input-verify"
      @change="emit('change', code, captchaId)"
    />
    <div class="code-image" style="position: relative; font-size: 12px">
      <img
        v-loading="loadingCaptcha"
        :src="captchaImg"
        alt="加载验证码失败"
        @click="getCaptchaImg"
        style="width: 110px; height: 32px; line-height: 32px; cursor: pointer; display: block"
      />
    </div>
  </el-row>
</template>
<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import useCaptchaImg from '@/hooks/useCaptchaImg';

const code = ref('');

const { loadingCaptcha, captchaImg, captchaId, getCaptchaImg } = useCaptchaImg();

const emit = defineEmits<{
  (e: 'change', code: string, captchaId: string): void;
}>();

onMounted(() => {
  getCaptchaImg();
});
defineExpose({
  getCaptchaImg
});
</script>
<style lang="scss" scoped></style>
