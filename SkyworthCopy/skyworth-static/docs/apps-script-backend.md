/**
 * SKYWORTH Vietnam - User Management API
 * 部署方法:
 * 1. 打开 https://script.google.com/
 * 2. 新建项目
 * 3. 将此代码粘贴到 Code.gs
 * 4. 部署为 Web 应用
 * 5. 获取部署URL填入前端配置
 */

// ==================== 配置区域 ====================
const CONFIG = {
  // 管理員邮箱（多人用逗号分隔）
  ADMIN_EMAILS: 'zhangqing04@skyworth.com,zhangqing@solavita.com',

  // 邮件配置
  EMAIL_FROM: 'SKYWORTH Vietnam <noreply@solavita.com>',
  EMAIL_SUBJECT_PREFIX: '[SKYWORTH] ',

  // 验证码有效期（分钟）
  VERIFY_CODE_EXPIRE_MINUTES: 15,

  // 验证页面URL - 替换为你的实际网站URL
  VERIFY_PAGE_URL: 'https://your-domain.com/pages/contact-us-vn.html',

  // 数据Sheet名称
  SHEET_USERS: 'users',
  SHEET_MESSAGES: 'messages',
  SHEET_VERIFY_CODES: 'verify_codes'
};

// ==================== 初始化 ====================
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter.action ? e.parameter : JSON.parse(e.postData.contents);
    const action = params.action;
    console.log('Received action:', action, params);

    let result;
    switch(action) {
      case 'user_register':
        result = userRegister(params);
        break;
      case 'verify_email':
        result = verifyEmail(params);
        break;
      case 'user_login':
        result = userLogin(params);
        break;
      case 'social_login':
        result = socialLogin(params);
        break;
      case 'reset_password_request':
        result = resetPasswordRequest(params);
        break;
      case 'reset_password_confirm':
        result = resetPasswordConfirm(params);
        break;
      case 'message_submit':
        console.log('Processing message_submit');
        result = messageSubmit(params);
        break;
      case 'get_user':
        result = getUser(params);
        break;
      default:
        result = { success: false, message: '未知操作' };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: '服务器错误: ' + error.message,
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==================== Sheet 操作 ====================
function getSheet(name) {
  // 尝试获取当前绑定的Spreadsheet
  let ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    console.error('Cannot get active spreadsheet:', e);
    // 如果没有绑定的spreadsheet，返回错误
    throw new Error('Vui long tao Apps Script tu Google Sheet');
  }

  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // 添加表头
    const headers = {
      'users': ['id', 'email', 'password_hash', 'full_name', 'phone', 'provider', 'provider_id', 'email_verified', 'created_at', 'status'],
      'messages': ['id', 'user_id', 'full_name', 'email', 'phone', 'product', 'message', 'consent_marketing', 'consent_privacy', 'created_at'],
      'verify_codes': ['id', 'email', 'code', 'type', 'expires_at', 'created_at'],
      'appointments': ['id', 'user_id', 'full_name', 'phone', 'email', 'address', 'roof_type', 'product', 'budget', 'date', 'time', 'priority', 'note', 'status', 'created_at']
    };
    if (headers[name]) {
      sheet.getRange(1, 1, 1, headers[name].length).setValues([headers[name]]);
    }
  }
  return sheet;
}

function getLastRowWithData(sheet, column) {
  const data = sheet.getDataRange().getValues();
  for (let i = data.length; i > 0; i--) {
    if (data[i-1][column] !== '') {
      return i;
    }
  }
  return 0;
}

function generateId(sheet) {
  const lastRow = getLastRowWithData(sheet, 0);
  return lastRow + 1;
}

// ==================== 用户注册 ====================
function userRegister(params) {
  const { email, password, fullName, phone, consentPrivacy, consentMarketing } = params;

  // 验证必填
  if (!email || !password || !fullName || !consentPrivacy) {
    return { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' };
  }

  const sheet = getSheet(CONFIG.SHEET_USERS);
  const data = sheet.getDataRange().getValues();

  // 检查邮箱是否已存在
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      return { success: false, message: 'Email đã được sử dụng' };
    }
  }

  // 加密密码
  const passwordHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password));

  // 生成验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7天有效

  // 直接创建用户，状态为pending
  const userId = generateId(sheet);
  sheet.appendRow([
    userId,
    email,
    passwordHash,
    fullName,
    phone || '',
    'email',
    '',
    false,  // email_verified = false
    new Date().toISOString(),
    'pending'  // status = pending，需要验证
  ]);

  // 保存验证码
  const codeSheet = getSheet(CONFIG.SHEET_VERIFY_CODES);
  const codeId = generateId(codeSheet);
  codeSheet.appendRow([codeId, email, code, 'register', expiresAt.toISOString(), new Date().toISOString()]);

  // 发送验证邮件（带链接）
  const verifyLink = CONFIG.VERIFY_PAGE_URL + '?email=' + encodeURIComponent(email) + '&code=' + code;
  sendVerifyEmailLink(email, fullName, verifyLink);

  return {
    success: true,
    message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.',
    userId: userId
  };
}

// ==================== 邮箱验证 ====================
// ==================== 邮箱验证（链接方式）====================
function verifyEmail(params) {
  const { email, code } = params;

  // 验证验证码
  const codeSheet = getSheet(CONFIG.SHEET_VERIFY_CODES);
  const codeData = codeSheet.getDataRange().getValues();
  const now = new Date();
  let codeValid = false;

  for (let i = 1; i < codeData.length; i++) {
    if (codeData[i][1] === email && codeData[i][2] === code && codeData[i][3] === 'register') {
      const expiresAt = new Date(codeData[i][4]);
      if (now > expiresAt) {
        return { success: false, message: 'Mã xác nhận đã hết hạn', expired: true };
      }
      codeValid = true;
      break;
    }
  }

  if (!codeValid) {
    return { success: false, message: 'Mã xác nhận không hợp lệ' };
  }

  // 更新用户状态
  const userSheet = getSheet(CONFIG.SHEET_USERS);
  const userData = userSheet.getDataRange().getValues();

  for (let i = 1; i < userData.length; i++) {
    if (userData[i][1] === email) {
      // 更新: email_verified=true, status=active
      userSheet.getRange(i + 1, 8).setValue(true);  // column H: email_verified
      userSheet.getRange(i + 1, 10).setValue('active');  // column J: status

      // 删除验证码
      for (let j = 1; j < codeData.length; j++) {
        if (codeData[j][1] === email && codeData[j][3] === 'register') {
          codeSheet.deleteRow(j + 1);
          break;
        }
      }

      return {
        success: true,
        message: 'Xác minh email thành công! Tài khoản của bạn đã được kích hoạt.',
        verified: true
      };
    }
  }

  return { success: false, message: 'Không tìm thấy tài khoản' };
}

// ==================== 用户登录 ====================
function userLogin(params) {
  const { email, password } = params;

  const sheet = getSheet(CONFIG.SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  const passwordHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password));

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      // 检查用户状态
      const status = data[i][9]; // column J: status
      if (status === 'pending') {
        return {
          success: false,
          message: 'Tài khoản chưa xác nhận email. Vui lòng kiểm tra hộp thư để xác nhận.',
          needVerify: true
        };
      }

      // 检查第三方登录
      if (!data[i][2]) {
        return { success: false, message: 'Tài khoản này đã đăng nhập bằng ' + data[i][5] };
      }

      if (data[i][2] === passwordHash) {
        // 生成简单token
        const token = Utilities.base64Encode(email + ':' + new Date().getTime());

        return {
          success: true,
          message: 'Đăng nhập thành công',
          token: token,
          user: {
            id: data[i][0],
            email: data[i][1],
            fullName: data[i][3],
            phone: data[i][4],
            emailVerified: data[i][7]
          }
        };
      }

      return { success: false, message: 'Mật khẩu không đúng' };
    }
  }

  return { success: false, message: 'Tài khoản không tồn tại' };
}

// ==================== 第三方登录 ====================
function socialLogin(params) {
  const { provider, providerId, email, fullName } = params;

  const sheet = getSheet(CONFIG.SHEET_USERS);
  const data = sheet.getDataRange().getValues();
  const now = new Date().toISOString();

  // 查找现有用户
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email || (data[i][6] === providerId)) {
      // 已存在用户，直接登录
      const token = Utilities.base64Encode(email + ':' + new Date().getTime());

      return {
        success: true,
        message: 'Đăng nhập thành công',
        token: token,
        user: {
          id: data[i][0],
          email: data[i][1],
          fullName: data[i][3],
          phone: data[i][4],
          emailVerified: true
        },
        isNewUser: false
      };
    }
  }

  // 新用户 - 自动注册
  const userId = generateId(sheet);
  sheet.appendRow([
    userId,
    email,
    '',
    fullName,
    '',
    provider,
    providerId,
    true,
    now,
    'active'
  ]);

  const token = Utilities.base64Encode(email + ':' + new Date().getTime());

  return {
    success: true,
    message: 'Đăng nhập thành công',
    token: token,
    user: {
      id: userId,
      email: email,
      fullName: fullName,
      phone: '',
      emailVerified: true
    },
    isNewUser: true
  };
}

// ==================== 密码重置 ====================
function resetPasswordRequest(params) {
  const { email } = params;

  const sheet = getSheet(CONFIG.SHEET_USERS);
  const data = sheet.getDataRange().getValues();

  // 查找用户
  let userName = '';
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      userName = data[i][3];
      break;
    }
  }

  if (!userName) {
    return { success: false, message: 'Email không tồn tại' };
  }

  // 生成验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + CONFIG.VERIFY_CODE_EXPIRE_MINUTES);

  const codeSheet = getSheet(CONFIG.SHEET_VERIFY_CODES);
  const codeId = generateId(codeSheet);
  codeSheet.appendRow([codeId, email, code, 'reset', expiresAt.toISOString(), new Date().toISOString()]);

  // 发送邮件
  sendResetPasswordEmail(email, userName, code);

  return { success: true, message: 'Mã xác nhận đã gửi đến email của bạn' };
}

function resetPasswordConfirm(params) {
  const { email, code, newPassword } = params;

  const sheet = getSheet(CONFIG.SHEET_VERIFY_CODES);
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email && data[i][2] === code && data[i][3] === 'reset') {
      const expiresAt = new Date(data[i][4]);
      if (now > expiresAt) {
        return { success: false, message: 'Mã xác nhận đã hết hạn' };
      }

      // 更新密码
      const userSheet = getSheet(CONFIG.SHEET_USERS);
      const userData = userSheet.getDataRange().getValues();
      const passwordHash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, newPassword));

      for (let j = 1; j < userData.length; j++) {
        if (userData[j][1] === email) {
          userSheet.getRange(j + 1, 3).setValue(passwordHash);
          break;
        }
      }

      // 删除验证码
      sheet.deleteRow(i + 1);

      return { success: true, message: 'Đặt lại mật khẩu thành công' };
    }
  }

  return { success: false, message: 'Mã xác nhận không đúng' };
}

// ==================== 留言提交 ====================
function messageSubmit(params) {
  const { userId, fullName, email, phone, product, message, consentPrivacy, consentMarketing } = params;

  if (!fullName || !email || !message || !consentPrivacy) {
    return { success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' };
  }

  const sheet = getSheet(CONFIG.SHEET_MESSAGES);
  const msgId = generateId(sheet);

  sheet.appendRow([
    msgId,
    userId || '',
    fullName,
    email,
    phone || '',
    product || '',
    message,
    consentMarketing || false,
    consentPrivacy,
    new Date().toISOString()
  ]);

  // 发送确认邮件给用户
  sendMessageConfirmation(email, fullName);

  // 通知管理员
  notifyAdminNewMessage({ fullName, email, phone, product, message });

  return {
    success: true,
    message: 'Gửi tin nhắn thành công',
    messageId: msgId
  };
}

// ==================== 获取用户信息 ====================
function getUser(params) {
  const { userId, token } = params;

  // 简单验证
  if (!token) {
    return { success: false, message: 'Vui lòng đăng nhập' };
  }

  const sheet = getSheet(CONFIG.SHEET_USERS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == userId) {
      return {
        success: true,
        user: {
          id: data[i][0],
          email: data[i][1],
          fullName: data[i][3],
          phone: data[i][4],
          emailVerified: data[i][7]
        }
      };
    }
  }

  return { success: false, message: 'Người dùng không tồn tại' };
}

// ==================== 邮件发送 ====================
function sendVerifyEmail(email, name, code) {
  // 旧函数，保留用于兼容
  const subject = CONFIG.EMAIL_SUBJECT_PREFIX + 'Ma xac nhan dang ky';
  const body = `
Xin chào ${name},

Ma xác nhận đăng ký của bạn là: ${code}

Ma có hiệu lực trong ${CONFIG.VERIFY_CODE_EXPIRE_MINUTES} phut.

Neu ban khong thuc hien hanh dong nay, vui long bo qua email nay.

Trân trọng,
SKYWORTH Vietnam
  `.trim();

  MailApp.sendEmail(email, subject, body, { from: CONFIG.EMAIL_FROM });
}

function sendVerifyEmailLink(email, name, verifyLink) {
  const subject = CONFIG.EMAIL_SUBJECT_PREFIX + 'Xac nhan email dang ky';
  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #006BC0;">Xin chào ${name},</h2>

  <p>Cảm ơn bạn đã đăng ký tài khoản SKYWORTH Vietnam!</p>

  <p>Vui lòng xác nhận email của bạn bằng cách nhấp vào nút bên dưới:</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${verifyLink}" style="background: #006BC0; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      Xác Nhận Email
    </a>
  </div>

  <p>Hoặc copy link sau vào trình duyệt:</p>
  <p style="word-break: break-all; color: #666;">${verifyLink}</p>

  <p style="color: #888; font-size: 12px; margin-top: 30px;">
    Link có hiệu lực trong 7 ngày.<br>
    Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

  <p style="color: #888; font-size: 12px;">
    Trân trọng,<br>
    <strong>SKYWORTH Vietnam</strong>
  </p>
</div>
  `.trim();

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: 'SKYWORTH Vietnam'
  });
}

function sendResetPasswordEmail(email, name, code) {
  const subject = CONFIG.EMAIL_SUBJECT_PREFIX + 'Dat lai mat khau';
  const body = `
Xin chào ${name},

Ma xác nhận đặt lại mật khẩu của bạn là: ${code}

Ma có hiệu lực trong ${CONFIG.VERIFY_CODE_EXPIRE_MINUTES} phut.

Neu ban khong thuc hien hanh dong nay, vui long bo qua email nay.

Trân trọng,
SKYWORTH Vietnam
  `.trim();

  MailApp.sendEmail(email, subject, body, { from: CONFIG.EMAIL_FROM });
}

function sendMessageConfirmation(email, name) {
  const subject = CONFIG.EMAIL_SUBJECT_PREFIX + 'Xac nhan tin nhan';
  const body = `
Xin chào ${name},

Chúng tôi đã nhận được tin nhắn của bạn.

Chúng tôi sẽ phản hồi trong thời gian sớm nhất.

Trân trọng,
SKYWORTH Vietnam
  `.trim();

  MailApp.sendEmail(email, subject, body, { from: CONFIG.EMAIL_FROM });
}

function notifyAdminNewMessage(data) {
  const subject = CONFIG.EMAIL_SUBJECT_PREFIX + 'Tin nhan moi tu website';
  const body = `
Co tin nhan moi tu website:

- Ho ten: ${data.fullName}
- Email: ${data.email}
- Dien thoai: ${data.phone || 'Khong co'}
- San pham: ${data.product || 'Khong chon'}
- Tin nhan: ${data.message}

Vui long dang nhap he thong de xu ly.
  `.trim();

  const admins = CONFIG.ADMIN_EMAILS.split(',');
  admins.forEach(admin => {
    MailApp.sendEmail(admin.trim(), subject, body, { from: CONFIG.EMAIL_FROM });
  });
}

// ==================== 工具函数 ====================
function generateToken() {
  return Utilities.base64Encode(new Date().getTime() + ':' + Math.random());
}
