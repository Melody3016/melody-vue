import type { FormInstance, FormRules } from 'element-plus';
import utils from '@/libs/util';
import { validateMobile } from '@/libs/validate';
import { smsLogin } from '@/api';
import useSendSms from '@/hooks/useSendSms';

// 手机验证码登录
interface MobLoginState {
  mobile: string;
  code: string;
}
export default () => {
  const mobLoginModel = reactive<MobLoginState>({
    mobile: '',
    code: ''
  });
  const mobLoginRules = reactive<FormRules<MobLoginState>>({
    mobile: [
      {
        required: true,
        validator: validateMobile,
        trigger: 'change'
      }
    ],
    code: [
      {
        required: true,
        message: '请输入短信验证码',
        trigger: 'change'
      }
    ]
  });

  // 发送验证码
  const { sending, autoCountDown, onSendSmsCode } = useSendSms();

  const sendSmsCode = async (phoneLoginRef?: FormInstance) => {
    if (!phoneLoginRef) return;
    // 校验
    const [validateErr] = await utils.awaitWrap(phoneLoginRef.validateField('mobile'));
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写手机号码！');
      return;
    }
    const mobile = mobLoginModel.mobile;
    // 请求发送验证码
    const res = await onSendSmsCode({ mobile }, 1);
    if (res) {
      ElMessage.success('验证码发送成功！');
      return res;
    }
  };

  const loginByPhone = async (saveLogin: boolean, phoneLoginRef: FormInstance) => {
    if (!phoneLoginRef) return;
    // 校验
    const [validateErr, validateRes] = await utils.awaitWrap(phoneLoginRef.validate());
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写完整！');
      return;
    }
    if (!validateRes) return;
    // 登录
    const params = {
      ...mobLoginModel,
      saveLogin
    };
    const [error, loginRes] = await utils.awaitWrap(smsLogin(params));
    if (error) {
      // 错误处理
      phoneLoginRef.resetFields();
      return;
    }
    if (!loginRes) return;
    if (loginRes.success) {
      // 返回token
      return loginRes.result;
    } else {
      mobLoginModel.code = '';
    }
  };

  return {
    mobLoginModel,
    mobLoginRules,
    sending,
    autoCountDown,
    sendSmsCode,
    loginByPhone
  };
};
