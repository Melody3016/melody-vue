import type { FormInstance, FormRules } from 'element-plus';
import { validateMobile, validatePassword, validateEmail } from '@/libs/validate';
import { resetByMobile, resetByEmail } from '@/api/index';
import utils from '@/libs/util';
import useSendSms from '@/hooks/useSendSms';

// 注册
interface modelState {
  password: string;
  password2: string;
  code: string;
  passStrength: string;
  mobile?: string;
  email?: string;
}
export default (type: number) => {
  const mobileModel = reactive<modelState>({
    password: '',
    password2: '',
    code: '',
    passStrength: '无',
    mobile: ''
  });
  const emailModel = reactive<modelState>({
    password: '',
    password2: '',
    code: '',
    passStrength: '无',
    email: ''
  });
  const mobileRules = reactive<FormRules<modelState>>({
    password: [
      {
        required: true,
        validator: validatePassword,
        trigger: 'change'
      }
    ],
    password2: [
      {
        required: true,
        validator: (rule: any, value: string, callback: any) => {
          if (value !== mobileModel.password) {
            callback(new Error('两次输入的密码不一致！'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ],
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
        message: '验证码不能为空',
        trigger: 'change'
      }
    ]
  });
  const emailRules = reactive<FormRules<modelState>>({
    password: [
      {
        required: true,
        validator: validatePassword,
        trigger: 'change'
      }
    ],
    password2: [
      {
        required: true,
        validator: (rule: any, value: string, callback: any) => {
          if (value !== mobileModel.password) {
            callback(new Error('两次输入的密码不一致！'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ],
    email: [
      {
        required: true,
        validator: validateEmail,
        trigger: 'change'
      }
    ],
    code: [
      {
        required: true,
        message: '验证码不能为空',
        trigger: 'change'
      }
    ]
  });

  // 发送验证码
  const { sending, autoCountDown, onSendSmsCode } = useSendSms();

  // 校验手机或邮箱
  const onValidate = async (regRef?: FormInstance) => {
    if (!regRef) return;
    const item = type === 1 ? 'mobile' : 'email';
    const msg = type === 1 ? '请填写正确的手机号码！' : '请填写正确的邮箱地址！';
    // 校验
    const [validateErr] = await utils.awaitWrap(regRef.validateField(item));
    // 错误处理
    if (validateErr) {
      ElMessage.error(msg);
      return;
    }
    return true;
  };

  const sendCode = async (captchaId: string, code: string) => {
    let res = null;
    // 请求发送验证码
    if (type === 1) {
      res = await onSendSmsCode({ mobile: mobileModel.mobile as string, captchaId, code }, 3);
    } else {
      res = await onSendSmsCode({ email: emailModel.email as string, captchaId, code }, 4);
    }
    if (res) {
      ElMessage.success('验证码发送成功！');
      return res;
    }
  };

  const onReset = async (regRef?: FormInstance) => {
    if (!regRef) return;
    // 校验
    const [validateErr, validateRes] = await utils.awaitWrap(regRef.validate());
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写完整！');
      return false;
    }
    if (!validateRes) return false;
    // 判断手机重置和邮箱重置
    let error,
      resetRes = null;
    if (type === 1) {
      const params = {
        ...mobileModel
      };
      [error, resetRes] = await utils.awaitWrap(resetByMobile(params));
    } else {
      const params = {
        ...emailModel
      };
      [error, resetRes] = await utils.awaitWrap(resetByEmail(params));
    }

    if (error) {
      // 错误处理
      regRef.resetFields();
      return false;
    }
    if (!resetRes) return false;
    if (resetRes.success) {
      ElMessage.success('重置密码成功！');
      return true;
    } else {
      return false;
    }
  };

  return {
    sending,
    autoCountDown,
    mobileModel,
    mobileRules,
    emailModel,
    emailRules,
    sendCode,
    onValidate,
    onReset
  };
};
