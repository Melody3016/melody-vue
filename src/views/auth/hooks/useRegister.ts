import type { FormInstance, FormRules } from 'element-plus';
import { validateMobile, validatePassword, validateEmail } from '@/libs/validate';
import { registerReq } from '@/api';
import utils from '@/libs/util';
import useSendSms from '@/hooks/useSendSms';

// 注册
interface modelRefState {
  username: string;
  email: string;
  password: string;
  password2: string;
  mobile: string;
  code: string;
  passStrength: string;
}
export default () => {
  const regModel = reactive<modelRefState>({
    username: '',
    email: '',
    password: '',
    password2: '',
    mobile: '',
    code: '',
    passStrength: '无'
  });
  const rules = reactive<FormRules<modelRefState>>({
    username: [
      {
        required: true,
        message: '用户名不能为空',
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
          if (value !== regModel.password) {
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

  // 发送验证码
  const { sending, autoCountDown, onSendSmsCode } = useSendSms();

  // 校验手机
  const onValMobile = async (regRef?: FormInstance) => {
    if (!regRef) return;
    // 校验
    const [validateErr] = await utils.awaitWrap(regRef.validateField('mobile'));
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写正确的手机号码！');
      return;
    }
    return regModel.mobile;
  };

  const sendSmsCode = async (captchaId: string, code: string) => {
    // 请求发送验证码
    const res = await onSendSmsCode({ mobile: regModel.mobile, captchaId, code }, 2);
    if (res) {
      ElMessage.success('验证码发送成功！');
      return res;
    }
  };

  const onRegister = async (regRef?: FormInstance) => {
    if (!regRef) return;
    // 校验
    const [validateErr, validateRes] = await utils.awaitWrap(regRef.validate());
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写完整！');
      return false;
    }
    if (!validateRes) return false;
    // 注册参数
    const params = {
      ...regModel
    };
    const [error, registerRes] = await utils.awaitWrap(registerReq(params));
    if (error) {
      // 错误处理
      regRef.resetFields();
      return false;
    }
    if (!registerRes) return false;
    if (registerRes.success) {
      ElMessage.success('注册成功！');
      return true;
    } else {
      return false;
    }
  };

  return {
    sending,
    autoCountDown,
    regModel,
    rules,
    sendSmsCode,
    onValMobile,
    onRegister
  };
};
