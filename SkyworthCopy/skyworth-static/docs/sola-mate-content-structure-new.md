# SolaMate 页面内容结构（基于 sola-mate-vn-new2.html）

> 页面区块结构与实际实现完全一致

---

## 一、页面区块结构（实际实现）

| # | 区块 | Class | 越南语标题 | 内容说明 |
|---|------|-------|-----------|---------|
| 1 | Hero | `.sm-hero` | SolaMate | 产品视频背景/标题/关键参数/认证徽章/按钮 |
| 2 | 痛点引入 | `.sm-problem` | Hóa đơn tiền điện khiến bạn đau đầu? | 5个痛点 + 解决方案引导 |
| 3 | 产品定义 | `.sm-what` | SolaMate là gì? | 产品定义/背景图/特点列表 |
| 4 | 核心优势 | `.sm-benefits` | Tại sao chọn SolaMate? | 4大核心卖点卡片 |
| 5 | 安装方式 | `.sm-install` #install | 3 Giải pháp lắp đặt | Tab切换：阳台款/遮阳款/庭院款 |
| 6 | 型号规格 | `.sm-models` #specs | Model & Thông số kỹ thuật | 6种配置规格表 |
| 7 | 发电量 | `.sm-power` | Sản lượng điện & Khả năng cấp điện | 供电能力展示（家电图标） |
| 8 | ROI分析 | `.sm-roi` #roi | Cắt giảm hóa đơn điện | 投资回报/收益对比/累积收益柱状图 |
| 9 | 认证质保 | `.sm-certs` | Chứng nhận & Bảo hành | 4个认证Logo (TUV/CE/RedDot/EVN) |
| 10 | 安装流程 | `.sm-process` | Quy trình lắp đặt | 6步骤展示（卡片式） |
| 11 | 用户案例 | `.sm-cases` | Ứng dụng thực tế | 3个真实场景卡片 |
| 12 | FAQ | `.sm-faq` | Câu hỏi thường gặp | 6个手风琴问题 |
| 13 | CTA | `.sm-cta` | Sẵn Sàng Tiết Kiệm Điện? | 联系按钮 |

---

## 二、字体规范（已验证）

```
字体族：'Be Vietnam Pro', -apple-system, sans-serif
字重：400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
来源：Google Fonts
```

---

## 三、样式继承关系

页面样式完全继承自 `sola-mate-vn-new.html`，无新增CSS。

---

## 四、图片资源清单

### 已替换的实际图片

| 区块 | 图片用途 | 路径 |
|------|---------|------|
| 痛点 | 越南家庭高额电费账单表情图 | `assets/images/Image_prhon0prhon0prho.jpg` |
| 产品定义 | 阳台实装效果图（背景） | `assets/images/vietnam_balcony.jpg` |
| 安装-阳台 | 实装整体图（支架+面板+盆栽） | `assets/images/rale.jpg` |
| 安装-阳台 | Microinverter + 防水接线盒 | `assets/images/microinv.jpg` |
| 安装-阳台 | 面板角度调节示意图 | `assets/images/raling.jpg` |
| 安装-阳台 | 安装套件包实物图 | `assets/images/antiback.jpg` |
| 安装-遮阳 | 停车位/走道遮阳光伏棚 | `assets/images/shade.jpg` |
| 安装-遮阳 | 支架结构特写 | `assets/images/sunshade.jpg` |
| 安装-遮阳 | 快速安装扣具细节 | `assets/images/store.jpg` |
| 安装-遮阳 | 光伏遮阳棚整体效果 | `assets/images/package.jpg` |
| 安装-庭院 | 独栋房屋庭院光伏亭 | `assets/images/ground.jpg` |
| 安装-庭院 | 可折叠光伏板收折状态 | `assets/images/camp.jpg` |
| 安装-庭院 | 可调支架角度范围示意 | `assets/images/adjustable.jpg` |
| 安装-庭院 | 便携移动轮子细节 | `assets/images/detail.jpg` |
| 认证 | TÜV Rheinland Logo | `assets/images/TUV.png` |
| 认证 | CE Certification Logo | `assets/images/ce.jpg` |
| 认证 | Red Dot Design Logo | `assets/images/reddot.jpg` |
| 认证 | EVN Approved Logo | `assets/images/EVN.jpg` |
| Hero视频 | SolaMate产品介绍视频 | `Public/Uploads/uploadfile/files/20250815/solamate-product-intro-en.mp4` |

### 占位图片（待替换）

| 区块 | 占位内容 | 规格 | 优先级 |
|------|---------|------|--------|
| 安装流程 | 6步骤实拍图 | 600×400px/步 | 高 |
| 用户案例 | 越南公寓阳台SolaMate安装前后对比照 | 800×600px | 高 |
| 用户案例 | 越南独栋房屋庭院光伏亭实拍图 | 800×600px | 高 |
| 用户案例 | 商铺门口光伏遮阳棚实拍图 | 800×600px | 高 |

---

## 五、CSS 修改记录

| 选择器 | 修改内容 |
|--------|---------|
| `.sm-hero` | 视频背景 + 渐变遮罩 |
| `.sm-hero-title` | Sola(橙色) + Mate(蓝色) 分色样式 |
| `.sm-hero-sub-title`, `.sm-hero-desc` | 白色文字 + 阴影增强可读性 |
| `.sm-hero-feature span` | 白色文字 + 阴影 |
| `.sm-spec-val`, `.sm-spec-label` | 白色文字 + 描边 |
| `.sm-product-line` | `background: rgb(0 107 192); color: #FFF;` |
| `.sm-problem-highlight` | 品牌渐变色文字 |
| `.sm-what` | 背景图 + 85%透明度深色渐变遮罩 |
| `.sm-what-grid.swap-desktop .sm-what-content` | `order: 1` 调换文字/图片位置 |
| `.sm-certs-grid` | 4列一行布局 |
| `.sm-cert-card` | 背景透明，垂直排列 |
| `.sm-cert-icon` | 80×80px，图片自适应 |
| `.sm-install-main-img` | 移除 aspect-ratio 限制 |

---

## 六、CTA 按钮分布

| 区块 | 按钮文字 | 样式 |
|------|---------|------|
| Hero | Nhận báo giá → | 渐变蓝背景，白色文字 |
| 痛点 | Nhận báo giá → | 渐变蓝背景，白色文字（在 sm-problem-text 内） |
| 产品定义 | Nhận báo giá → | 渐变蓝背景，白色文字（在 sm-what-content 内） |
| 核心优势 | Nhận báo giá → | 白色背景，深色文字 |
| 安装方式 | Nhận báo giá → | 渐变蓝背景，白色文字 |
| 型号规格 | Nhận báo giá → | 渐变蓝背景，白色文字 |
| ROI分析 | Tự tính toán → | 渐变蓝背景，白色文字 |
| 认证质保 | Nhận báo giá → | 渐变蓝背景，白色文字 |

---

## 七、下一步

1. 补充各区块缺失图片素材（安装流程6步骤、用户案例3张）
2. 根据越南市场定价微调ROI数值
3. 确认FAQ答案内容准确性
