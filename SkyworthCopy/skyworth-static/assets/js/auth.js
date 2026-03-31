/**
 * SKYWORTH Vietnam - Authentication Manager
 * 用户状态管理模块
 */

const Auth = (function() {
  'use strict';

  const TOKEN_KEY = 'skyward_user_token';
  const USER_KEY = 'skyward_userinfo';

  // 检查是否已登录
  function isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY) && !!localStorage.getItem(USER_KEY);
  }

  // 获取当前用户信息
  function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }

  // 获取 Token
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // 登录成功处理
  function login(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    notifyAuthChange('login', user);
  }

  // 登出处理
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notifyAuthChange('logout', null);
  }

  // 更新用户信息
  function updateUser(userData) {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    notifyAuthChange('update', updatedUser);
  }

  // 监听器列表
  const listeners = [];

  // 添加状态监听器
  function addListener(callback) {
    if (typeof callback === 'function' && !listeners.includes(callback)) {
      listeners.push(callback);
    }
  }

  // 移除状态监听器
  function removeListener(callback) {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // 通知所有监听器
  function notifyAuthChange(event, user) {
    listeners.forEach(callback => {
      try {
        callback(event, user);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  }

  // ====== 公开方法 ======
  return {
    isLoggedIn,
    getUser,
    getToken,
    login,
    logout,
    updateUser,
    addListener,
    removeListener
  };

})();

// ====== UI 辅助函数 ======

// 更新登录/登出状态的 UI 显示
function updateAuthUI() {
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();

  // 左侧：登录区域 - 只更新表单部分，不重建整个卡片
  const authCard = document.querySelector('.ct-auth-card');
  if (authCard) {
    if (isLoggedIn && user) {
      // 检查是否已经显示用户信息（避免重复重建）
      if (!authCard.querySelector('.ct-user-info')) {
        showLoggedInUI(authCard, user);
      }
    } else {
      // 检查是否显示的是登录表单（避免重复重建）
      if (!authCard.querySelector('#login-form') && !authCard.querySelector('.ct-auth-tabs')) {
        showGuestUI(authCard);
      }
    }
  }

  // 右侧：留言表单
  const messageFormGuest = document.getElementById('message-form-guest');
  const messageFormUser = document.getElementById('message-form-user');

  if (messageFormGuest && messageFormUser) {
    if (isLoggedIn && user) {
      messageFormGuest.style.display = 'none';
      messageFormUser.style.display = 'block';

      // 预填表单
      if (document.getElementById('msg_name')) {
        document.getElementById('msg_name').value = user.fullName || '';
      }
      if (document.getElementById('msg_email')) {
        document.getElementById('msg_email').value = user.email || '';
      }
      if (document.getElementById('msg_phone')) {
        document.getElementById('msg_phone').value = user.phone || '';
      }
    } else {
      messageFormGuest.style.display = 'block';
      messageFormUser.style.display = 'none';
    }
  }
}

// 显示已登录用户 UI
function showLoggedInUI(container, user) {
  const userHtml = `
    <div class="ct-user-info">
      <div class="ct-user-avatar">${(user.fullName || 'U').charAt(0).toUpperCase()}</div>
      <div class="ct-user-name">${user.fullName || 'User'}</div>
      <div class="ct-user-email">${user.email || ''}</div>
      <div class="ct-logout-btn" onclick="handleLogout()">Đăng xuất</div>
    </div>
  `;

  container.innerHTML = userHtml;
}

// 显示访客 UI（登录/注册表单）
function showGuestUI(container) {
  // 恢复原来的表单结构
  const formHtml = `
    <!-- Tabs -->
    <div class="ct-auth-tabs">
      <div class="ct-auth-tab active" data-tab="login">Đăng Nhập</div>
      <div class="ct-auth-tab" data-tab="register">Đăng Ký</div>
    </div>

    <!-- Social Login -->
    <div class="ct-social-btns">
      <button type="button" class="ct-social-btn" onclick="handleSocialLogin('google')">
        <img src="assets/images/icons/google-icon.svg" alt="Google">
        <span>Google</span>
      </button>
      <button type="button" class="ct-social-btn" onclick="handleSocialLogin('facebook')">
        <img src="assets/images/icons/facebook-icon.svg" alt="Facebook">
        <span>Facebook</span>
      </button>
    </div>

    <div class="ct-social-divider">hoặc</div>

    <!-- Login Form -->
    <div id="login-form" class="ct-form-content active">
      <form onsubmit="return handleLogin(event)">
        <div class="ct-form-group">
          <label class="ct-form-label">Email / Điện thoại <span>*</span></label>
          <input type="text" class="ct-form-input" name="login_id" required placeholder="Nhập email hoặc số điện thoại">
        </div>
        <div class="ct-form-group">
          <label class="ct-form-label">Mật khẩu <span>*</span></label>
          <input type="password" class="ct-form-input" name="password" required placeholder="Nhập mật khẩu">
        </div>
        <button type="submit" class="ct-btn-primary">Đăng Nhập</button>
      </form>
    </div>

    <!-- Register Form -->
    <div id="register-form" class="ct-form-content">
      <form onsubmit="return handleRegister(event)">
        <div class="ct-form-group">
          <label class="ct-form-label">Họ và tên <span>*</span></label>
          <input type="text" class="ct-form-input" name="full_name" required placeholder="Nhập họ và tên">
        </div>
        <div class="ct-form-group">
          <label class="ct-form-label">Email <span>*</span></label>
          <input type="email" class="ct-form-input" name="email" required placeholder="email@example.com">
        </div>
        <div class="ct-form-group">
          <label class="ct-form-label">Điện thoại</label>
          <input type="tel" class="ct-form-input" name="phone" placeholder="+84 xxx xxx xxx">
        </div>
        <div class="ct-form-group">
          <label class="ct-form-label">Mật khẩu <span>*</span></label>
          <input type="password" class="ct-form-input" name="register_password" required placeholder="Ít nhất 6 ký tự" minlength="6">
        </div>
        <div class="ct-form-checkbox">
          <input type="checkbox" id="optin" name="optin" required>
          <label for="optin">
            Tôi đồng ý cho SKYWORTH thu thập và xử lý thông tin cá nhân của tôi theo <a href="#" style="color:var(--colorbj);">Chính sách bảo mật</a>. <span style="color:var(--colorred)">*</span>
          </label>
        </div>
        <div class="ct-form-checkbox">
          <input type="checkbox" id="marketing" name="marketing">
          <label for="marketing">
            Tôi đồng ý nhận thông tin về sản phẩm và dịch vụ qua email/điện thoại.
          </label>
        </div>
        <button type="submit" class="ct-btn-primary">Đăng Ký</button>
      </form>
    </div>
  `;

  container.innerHTML = formHtml;

  // 重新绑定 Tab 切换事件
  document.querySelectorAll('.ct-auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      switchTab(targetTab);
    });
  });
}

// Tab 切换
function switchTab(tab) {
  document.querySelectorAll('.ct-auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ct-form-content').forEach(f => f.classList.remove('active'));

  const tabEl = document.querySelector(`.ct-auth-tab[data-tab="${tab}"]`);
  const formEl = document.getElementById(`${tab}-form`);

  if (tabEl && formEl) {
    tabEl.classList.add('active');
    formEl.classList.add('active');
  }
}

// ====== 表单处理 ======

// 处理登录
async function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const loginId = form.login_id.value;
  const password = form.password.value;

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Đang xử lý...';
  btn.disabled = true;

  const result = await ApiClient.login(loginId, password);

  btn.textContent = originalText;
  btn.disabled = false;

  if (result.success) {
    Auth.login(result.token, result.user);
    updateAuthUI();
    showFormMessage('login-form', 'success', 'Đăng nhập thành công!');
  } else {
    showFormMessage('login-form', 'error', result.message || 'Đăng nhập thất bại');
  }

  return false;
}

// 处理注册
async function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const data = {
    fullName: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('register_password'),
    consentPrivacy: form.querySelector('#optin')?.checked,
    consentMarketing: form.querySelector('#marketing')?.checked
  };

  if (!data.consentPrivacy) {
    alert('Vui lòng đồng ý với chính sách bảo mật');
    return false;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Đang xử lý...';
  btn.disabled = true;

  const result = await ApiClient.register(data.email, data.password, data.fullName, data.phone, data.consentPrivacy, data.consentMarketing);

  btn.textContent = originalText;
  btn.disabled = false;

  if (result.success) {
    // 在表单区域显示提示
    showFormMessage('register-form', 'success', 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
    // 清空表单
    form.reset();
  } else {
    showFormMessage('register-form', 'error', result.message || 'Đăng ký thất bại');
  }

  return false;
}

// 处理登出
function handleLogout() {
  if (confirm('Ban co muon dang xuat?')) {
    Auth.logout();
    updateAuthUI();
    alert('Da dang xuat');
  }
}

// 处理留言提交
async function handleMessage(e) {
  e.preventDefault();

  const user = Auth.getUser();
  if (!user || !Auth.isLoggedIn()) {
    alert('Vui long dang nhap de gui tin nhan');
    return false;
  }

  const form = e.target;
  const formData = new FormData(form);

  const data = {
    userId: user.id,
    fullName: formData.get('msg_name'),
    email: formData.get('msg_email'),
    phone: formData.get('msg_phone'),
    product: formData.get('msg_product'),
    message: formData.get('msg_content'),
    consentPrivacy: form.querySelector('#msg_privacy')?.checked || true,
    consentMarketing: form.querySelector('#msg_marketing')?.checked || false
  };

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Đang gửi...';
  btn.disabled = true;

  const result = await ApiClient.submitMessage(
    data.userId, data.fullName, data.email, data.phone,
    data.product, data.message, data.consentPrivacy, data.consentMarketing
  );

  btn.textContent = originalText;
  btn.disabled = false;

  if (result.success) {
    showFormMessage('message-form-user', 'success', result.message);
    form.reset();
  } else {
    showFormMessage('message-form-user', 'error', result.message || 'Gửi tin nhắn thất bại');
  }

  return false;
}

// ====== 表单消息提示 ======

function showFormMessage(formId, type, message) {
  const container = document.getElementById(formId);
  if (!container) return;

  // 移除已有消息
  const existingMsg = container.querySelector('.ct-form-message');
  if (existingMsg) existingMsg.remove();

  // 创建消息元素
  const msgEl = document.createElement('div');
  msgEl.className = 'ct-form-message';
  const bgColor = type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#fef9c3';
  const textColor = type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#854d0e';
  const borderColor = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#eab308';

  msgEl.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid ${borderColor};
    margin-bottom: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  msgEl.innerHTML = `
    <span>${message}</span>
    <span style="cursor:pointer;font-weight:bold;" onclick="this.parentElement.remove()">×</span>
  `;

  // 插入到表单顶部
  const firstChild = container.firstElementChild;
  if (firstChild) {
    container.insertBefore(msgEl, firstChild);
  } else {
    container.appendChild(msgEl);
  }
}

// ====== 验证码弹窗 ======

function showVerifyModal(email) {
  const modal = document.createElement('div');
  modal.id = 'verify-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 9999;
  `;

  modal.innerHTML = `
    <div style="background: #fff; padding: 32px; border-radius: 16px; max-width: 400px; width: 90%; text-align: center;">
      <h3 style="margin-bottom: 16px;">Xác nhận Email</h3>
      <p style="color: #666; margin-bottom: 20px;">Ma xac nhan da gui den<br><strong>${email}</strong></p>
      <input type="text" id="verify-code" class="ct-form-input"
        placeholder="Nhap ma 6 chu so" maxlength="6" style="text-align: center; letter-spacing: 8px; font-size: 18px;">
      <button onclick="submitVerify('${email}')" class="ct-btn-primary" style="margin-top: 16px;">Xac nhan</button>
      <p style="margin-top: 16px; font-size: 13px; color: #888;">
        <a href="#" onclick="resendVerify('${email}'); return false;">Gui lai ma</a>
      </p>
      <button onclick="closeVerifyModal()" style="margin-top: 12px; background: none; border: none; color: #666; cursor: pointer;">Huy</button>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeVerifyModal() {
  const modal = document.getElementById('verify-modal');
  if (modal) {
    modal.remove();
  }
}

async function submitVerify(email) {
  const code = document.getElementById('verify-code').value;

  if (!code || code.length !== 6) {
    alert('Vui long nhap day du 6 ki tu');
    return;
  }

  const btn = document.querySelector('#verify-modal .ct-btn-primary');
  const originalText = btn.textContent;
  btn.textContent = 'Đang xử lý...';
  btn.disabled = true;

  const result = await ApiClient.verifyEmail(email, code);

  btn.textContent = originalText;
  btn.disabled = false;

  if (result.success) {
    closeVerifyModal();
    // 5秒后刷新页面
    showFormMessage('login-form', 'success', 'Xác minh thành công! Đang chuyển hướng...');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } else {
    alert(result.message);
  }
}

async function resendVerify(email) {
  // 重新发送验证码（这里简化处理，实际应该调用API）
  alert('Ma xac nhan da gui lai');
}

// ====== 第三方登录 ======

function handleSocialLogin(provider) {
  // 这里需要集成实际的第三方登录 SDK
  // Google: 使用 Google Sign-In
  // Facebook: 使用 Facebook SDK

  // 示例：Google 登录
  if (provider === 'google') {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.prompt();
    } else {
      alert('Google Sign-In chua duoc cau hinh. Vui long lien he quan tri vien.');
    }
  }

  // Facebook 登录
  if (provider === 'facebook') {
    if (typeof FB !== 'undefined') {
      FB.login(function(response) {
        if (response.authResponse) {
          FB.api('/me', { fields: 'name,email' }, function(userData) {
            handleSocialCallback('facebook', userData);
          });
        }
      }, { scope: 'email' });
    } else {
      alert('Facebook Login chua duoc cau hinh. Vui long lien he quan tri vien.');
    }
  }
}

async function handleSocialCallback(provider, userData) {
  const email = userData.email || provider + '_' + userData.id + '@placeholder.com';
  const fullName = userData.name || 'User';
  const providerId = userData.id;

  const result = await ApiClient.socialLogin(provider, providerId, email, fullName);

  if (result.success) {
    Auth.login(result.token, result.user);
    updateAuthUI();
    alert(result.isNewUser ? 'Dang ky thanh cong!' : 'Dang nhap thanh cong!');
  } else {
    alert(result.message);
  }
}

// ====== 初始化 ======

document.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态并更新UI
  updateAuthUI();

  // 监听登录状态变化
  Auth.addListener(function(event, user) {
    updateAuthUI();
  });

  // 检测URL参数，自动验证邮箱
  checkUrlVerification();
});

// 检测URL参数自动验证邮箱
async function checkUrlVerification() {
  const urlParams = new URLSearchParams(window.location.search);
  const verifyEmail = urlParams.get('email');
  const verifyCode = urlParams.get('code');

  if (verifyEmail && verifyCode) {
    console.log('Detected verification request:', verifyEmail);

    // 显示验证中提示
    const authCard = document.querySelector('.ct-auth-card');
    if (authCard) {
      // 临时显示验证区域
      authCard.innerHTML = `
        <div class="ct-user-info" style="padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
          <div class="ct-user-name">Đang xác nhận email...</div>
        </div>
      `;
    }

    // 调用验证API
    const result = await ApiClient.verifyEmail(verifyEmail, verifyCode);

    if (result.success) {
      // 清理URL参数
      window.history.replaceState({}, document.title, window.location.pathname);

      // 显示成功消息
      if (authCard) {
        authCard.innerHTML = `
          <div class="ct-user-info" style="padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
            <div class="ct-user-name">${result.message}</div>
            <p style="color: #666; margin-top: 12px;">Bạn có thể đăng nhập ngay bây giờ.</p>
          </div>
        `;
      }
    } else {
      // 显示错误
      if (authCard) {
        authCard.innerHTML = `
          <div class="ct-user-info" style="padding: 40px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
            <div class="ct-user-name">Xác nhận thất bại</div>
            <p style="color: #666; margin-top: 12px;">${result.message}</p>
          </div>
        `;
      }
    }
  }
}
