/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 禁用 检测Vue组件的命名是否符合多词规范 规则
    'vue/multi-word-component-names': 'off',
    // debugger设为警告级别
    "no-debugger": 1
  }
};
