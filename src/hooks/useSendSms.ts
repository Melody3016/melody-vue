import { ref } from 'vue';
import { sendSms, sendResetEmail } from '@/api';
import utils from '@/libs/util';

export default () => {
  const sending = ref(false);
  const autoCountDown = ref(false);

  const onSendSmsCode = async (params: ISmsParam | IEmailParam, type: number) => {
    // 请求发送验证码
    sending.value = true;
    let smsErr, smsRes = null
    if(type === 4) {
      // 发送邮箱验证码
      [smsErr, smsRes] = await utils.awaitWrap(sendResetEmail(params as IEmailParam));
    } else {
      [smsErr, smsRes] = await utils.awaitWrap(sendSms(params as ISmsParam, type));
    }
    if (smsErr) {
      sending.value = false;
      return;
    }
    // 成功
    sending.value = false;
    if (smsRes?.success) {
      autoCountDown.value = true;
      return smsRes?.result;
    }
  };

  return {
    sending,
    autoCountDown,
    onSendSmsCode
  };
};
