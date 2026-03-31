/**
 * SKYWORTH Vietnam - API Client
 * 基于 Google Apps Script 的后端 API 客户端
 *
 * 配置说明:
 * 1. 部署 Apps Script 后获取 URL
 * 2. 将 URL 填入下方的 API_BASE
 * 3. 配置管理员邮箱（在 Apps Script 中）
 */

const ApiClient = (function() {
  'use strict';

  // ====== 配置区域 ======
  // TODO: 替换为实际的 Apps Script 部署 URL
  // 获取方法: Google Apps Script -> 部署 -> Web 应用 -> 复制当前网页应用网址
  const API_BASE = 'https://script.google.com/macros/s/1RF6ZSUtS49HN8L4V8Kj1ciZGMZWpGbF7G7lmB5EsFkX42uT5_mOy33R-/exec';
  // ======================

  // 请求方法
  async function post(action, data = {}) {
    const payload = { action, ...data };
    console.log('API Request:', action, payload);

    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      return result;

    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Ket noi that bai. Vui long thu lai sau. Lỗi: ' + error.message
      };
    }
  }

  // ====== API 方法 ======

  // 用户注册
  async function register(email, password, fullName, phone, consentPrivacy, consentMarketing) {
    return post('user_register', {
      email,
      password,
      fullName,
      phone,
      consentPrivacy: consentPrivacy === true,
      consentMarketing: consentMarketing === true
    });
  }

  // 邮箱验证
  async function verifyEmail(email, code) {
    return post('verify_email', { email, code });
  }

  // 用户登录
  async function login(email, password) {
    return post('user_login', { email, password });
  }

  // 第三方登录
  async function socialLogin(provider, providerId, email, fullName) {
    return post('social_login', {
      provider,
      providerId,
      email,
      fullName
    });
  }

  // 密码重置请求
  async function resetPasswordRequest(email) {
    return post('reset_password_request', { email });
  }

  // 密码重置确认
  async function resetPasswordConfirm(email, code, newPassword) {
    return post('reset_password_confirm', { email, code, newPassword });
  }

  // 留言提交
  async function submitMessage(userId, fullName, email, phone, product, message, consentPrivacy, consentMarketing) {
    return post('message_submit', {
      userId: userId || null,
      fullName,
      email,
      phone,
      product,
      message,
      consentPrivacy: consentPrivacy === true,
      consentMarketing: consentMarketing === true
    });
  }

  // 获取用户信息
  async function getUser(userId, token) {
    return post('get_user', { userId, token });
  }

  // ====== 公开方法 ======
  return {
    register,
    verifyEmail,
    login,
    socialLogin,
    resetPasswordRequest,
    resetPasswordConfirm,
    submitMessage,
    getUser
  };

})();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiClient;
}
