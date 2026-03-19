# Skyworth Vietnam 页面结构映射表

> 根据导航结构规划与页面类型分类的对应关系

---

## 页面结构分类参考

| 类型 | Class 名称 | 用途 |
|------|------------|------|
| 首页 | `home-main` | 主页 |
| 解决方案页 | `solu-page` | 户用/工商业光伏解决方案 |
| 产品详情页 | `product-page` | 产品介绍 |
| 案例列表页 | `list-page` | 项目案例列表 |
| 案例详情页 | `casedet-page` | 单个案例详情 |
| 表单页 | `form-page` | 联系我们/申请表单 |
| 合作伙伴页 | `partner-page` | 合作伙伴 |
| 关于我们页 | `exhi-page` | 公司介绍 |
| 支持页面 | `warr-page` | 保修/支持 |
| 软件/云服务 | `userware-page` | APP下载 |
| 招聘页 | `join-page` | 人才招聘 |
| 通用内页 | `inside-main` | 通用内容页 |

---

## 导航页面映射

### 1. 户用光伏 (Residential)

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| 首页 | Trang chủ | index.html | `home-main` | ✅ 已存在 |
| SolaMate 能亮站 | SolaMate | residential/sola-mate-vn.html | `solu-page` | ⚠️ 待完善 |
| ├─ 阳台款 | Ban công | residential/balcony-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 遮阳款 | Che nắng | residential/sunshade-vn.html | `solu-page` | 🔲 待创建 |
| └─ 地面款 | Mặt đất | residential/ground-vn.html | `solu-page` | 🔲 待创建 |
| SolaWard 阳老金 | SolaWard | residential/sola-ward-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 屋顶款 | Mái nhà | residential/solaroof-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 阳光房 | Phòng nắng | residential/solaloft-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 余电上网 | Bán điện lưới | residential/ongrid-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 自发自用 | Tự tiêu thụ | residential/offgrid-vn.html | `solu-page` | 🔲 待创建 |
| └─ 光储一体 | PV&ESS | residential/pv-ess-vn.html | `solu-page` | 🔲 待创建 |
| 户用APP | Cloud APP | software-cloud.html | `userware-page` | 🔲 待创建 |

---

### 2. 工商业光伏 (Business)

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| SolaWard Pro | SolaWard Pro | business/sola-ward-pro-vn.html | `solu-page` | 🔲 待创建 |
| ├─ 工商业解决方案 | Giải pháp C&I | business/ci-solutions-vn.html | `solu-page` | 🔲 待创建 |
| └─ 工商业APP | Cloud APP Pro | software-cloud-pro.html | `userware-page` | 🔲 待创建 |
| EPC Services | Dịch vụ EPC | business/epc-vn.html | `solu-page` | 🔲 待创建 |
| ├─ E企发 (Turnkey EPC) | Tổng thầu EPC | business/epc-turnkey-vn.html | `solu-page` | 🔲 待创建 |
| ├─ E企省 (Fixed-Rate PPA) | PPA Giá cố định | business/ppa-fixed-vn.html | `solu-page` | 🔲 待创建 |
| └─ E企赢 (Flexible PPA) | PPA Linh hoạt | business/ppa-flexible-vn.html | `solu-page` | 🔲 待创建 |
| 踏勘预约表单 | Khảo sát miễn phí | business/site-survey-vn.html | `form-page` | 🔲 待创建 |

---

### 3. 产品 (Products)

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| 光伏组件 | Tấm pin PV | product/pv-module-vn.html | `product-page` | 🔲 待创建 |
| ├─ M10 SERIES | M10 SERIES | product/modules/m10-vn.html | `product-page` | 🔲 待创建 |
| ├─ G12 SERIES | G12 SERIES | product/modules/g12-vn.html | `product-page` | 🔲 待创建 |
| └─ G12R SERIES | G12R SERIES | product/modules/g12r-vn.html | `product-page` | 🔲 待创建 |
| 光伏逆变器 | Inverter PV | product/pv-inverter-vn.html | `product-page` | 🔲 待创建 |
| ├─ SW 1-3.3KTL-S1 | SW 1-3.3KTL-S1 | product/inverter/sw-1-3ktl-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SW 4-6KTL-S1 | SW 4-6KTL-S1 | product/inverter/sw-4-6ktl-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SW 7-10KTL-S1 | SW 7-10KTL-S1 | product/inverter/sw-7-10ktl-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SW 10-25KTL-S1 | SW 10-25KTL-S1 | product/inverter/sw-10-25ktl-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SW 30-33KTL-S1 | SW 30-33KTL-S1 | product/inverter/sw-30-33ktl-s1-vn.html | `product-page` | 🔲 待创建 |
| └─ SW 40-60KTL-T1 | SW 40-60KTL-T1 | product/inverter/sw-40-60ktl-t1-vn.html | `product-page` | 🔲 待创建 |
| 户用储能系统 | Hệ thống lưu trữ gia đình | product/residential-ess-vn.html | `product-page` | 🔲 待创建 |
| ├─ SWH 3-6KH-S1 | SWH 3-6KH-S1 | product/ess/swh-3-6kh-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SWH 3-6KL-S1 | SWH 3-6KL-S1 | product/ess/swh-3-6kl-s1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SWH 5-15KH-T1 | SWH 5-15KH-T1 | product/ess/swh-5-15kh-t1-vn.html | `product-page` | 🔲 待创建 |
| └─ SWR5.12-20.48-H1 | SWR5.12-20.48-H1 | product/ess/swr-5-20k-h1-vn.html | `product-page` | 🔲 待创建 |
| 工商业储能系统 | Hệ thống lưu trữ C&I | product/ci-ess-vn.html | `product-page` | 🔲 待创建 |
| ├─ SVH 29-50KH-T1 | SVH 29-50KH-T1 | product/ess/svh-29-50kh-t1-vn.html | `product-page` | 🔲 待创建 |
| ├─ SWS-P50E100-HC | SWS-P50E100-HC | product/ess/sws-p50e100-hc-vn.html | `product-page` | 🔲 待创建 |
| └─ SWS-P100E215-HC | SWS-P100E215-HC | product/ess/sws-p100e215-hc-vn.html | `product-page` | 🔲 待创建 |
| 支架系统 | Hệ thống gắn kết | product/mounting-system-vn.html | `product-page` | 🔲 待创建 |
| ├─ For Tile Roof | Cho mái ngói | product/mounting/tile-roof-vn.html | `product-page` | 🔲 待创建 |
| └─ For Slate Roof | Cho mái ardoisa | product/mounting/slate-roof-vn.html | `product-page` | 🔲 待创建 |
| 全部产品 | Tất cả sản phẩm | product/all-products-vn.html | `product-page` | 🔲 待创建 |
| EPC服务 | Dịch vụ EPC | product/epc-service-vn.html | `product-page` | 🔲 待创建 |

---

### 4. 合作伙伴 (Partner)

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| 合作伙伴首页 | Trang chủ đối tác | partner-vn.html | `partner-page` | 🔲 待创建 |
| 商家加盟表单 | Đăng ký installer | partner/become-installer-vn.html | `form-page` | 🔲 待创建 |
| 资质和证书 | Chứng chỉ | partner/certificates-vn.html | `exhi-page` | 🔲 待创建 |
| 合作伙伴登录 | Đăng nhập đối tác | partner/login-vn.html | `form-page` | 🔲 待创建 |

---

### 5. 支持 (Support)

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| 问AI | Hỏi AI | support/ask-ai-vn.html | `userware-page` | 🔲 待创建 |
| 常见问题 | Câu hỏi thường gặp | support/faq-vn.html | `warr-page` | 🔲 待创建 |
| 光伏百科 | Wiki năng lượng mặt trời | support/wiki-vn.html | `inside-main` | 🔲 待创建 |
| 下载中心 | Tải xuống | support/download-vn.html | `warr-page` | 🔲 待创建 |
| 用户登录 | Đăng nhập người dùng | support/user-login-vn.html | `form-page` | 🔲 待创建 |

---

### 6. 其他页面

| 页面名称 | 越南语 | 文件名 | 页面类型 | 优先级 |
|----------|--------|--------|----------|--------|
| 收益计算器 | Máy tính ROI | roi-calculator-vn.html | `form-page` | 🔲 待创建 |
| 联系我们 | Liên hệ | contact-us-vn.html | `form-page` | 🔲 待创建 |
| 关于我们 | Về Chúng Tôi | about-us-vn.html | `exhi-page` | 🔲 待创建 |
| 隐私政策 | Chính Sách Bảo Mật | privacy-vn.html | `inside-main` | 🔲 待创建 |
| 法律声明 | Thông Báo Pháp Lý | legal-vn.html | `inside-main` | 🔲 待创建 |
| 网站地图 | Sơ Đồ Trang Web | sitemap-vn.html | `inside-main` | 🔲 待创建 |
| 招聘 | Tuyển Dụng | careers-vn.html | `join-page` | 🔲 待创建 |
| 案例展示 | Dự Án | cases-vn.html | `list-page` | 🔲 待创建 |

---

## 状态说明

| 符号 | 含义 |
|------|------|
| ✅ | 已存在，可直接使用 |
| ⚠️ | 存在但需完善 |
| 🔲 | 待创建 |

---

## 开发优先级建议

### 第一阶段 (MVP - 核心页面)
1. ✅ 首页 (已有框架)
2. ⚠️ SolaMate 页面
3. 🔲 SolaWard 页面
4. 🔲 Partner 首页
5. 🔲 Contact Us 表单
6. 🔲 踏勘预约表单

### 第二阶段 (产品展示)
1. 🔲 产品列表页
2. 🔲 热门产品详情页 (逆变器、储能)
3. 🔲 光伏组件

### 第三阶段 (完善支持)
1. 🔲 FAQ
2. 🔲 下载中心
3. 🔲 案例展示

### 第四阶段 (扩展)
1. 🔲 其他产品详情页
2. 🔲 百科
3. 🔲 招聘页
