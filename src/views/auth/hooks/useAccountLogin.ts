import { loginReq } from '@/api';
import utils from '@/libs/util';
import type { FormInstance, FormRules } from 'element-plus';
// 账户密码登录
interface AccLoginState {
  username: string;
  password: string;
  code: string;
}
export default (cb: Function) => {
  const accLoginModel = reactive<AccLoginState>({
    username: '',
    password: '',
    code: ''
  });
  const accLoginRules = reactive<FormRules<AccLoginState>>({
    username: [
      {
        required: true,
        message: '用户名不能为空',
        trigger: 'change'
      }
    ],
    password: [
      {
        required: true,
        message: '密码不能为空',
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

  const loginByAccount = async (
    saveLogin: boolean,
    captchaId: string,
    accLoginRef: FormInstance
  ) => {
    if (!accLoginRef) return;
    // 校验
    const [validateErr, validateRes] = await utils.awaitWrap(accLoginRef.validate());
    // 错误处理
    if (validateErr) {
      ElMessage.error('请填写完整！');
      return;
    }
    if (!validateRes) return;
    // 登录
    const params = {
      ...accLoginModel,
      captchaId,
      saveLogin
    };
    const [error, loginRes] = await utils.awaitWrap(loginReq(params));
    if (error) {
      // 错误处理
      accLoginRef.resetFields()
      return;
    }
    if (!loginRes) return;
    if (loginRes.success) {
      // 返回token
      return loginRes.result;
    } else {
      if (loginRes.result === null) {
        accLoginRef.resetFields()
        cb();
      } else {
        accLoginModel.code = '';
        cb();
      }
    }
  };

  return {
    accLoginModel,
    accLoginRules,
    loginByAccount
  };
};
