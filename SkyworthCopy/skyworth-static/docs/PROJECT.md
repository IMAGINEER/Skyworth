# Skyworth Vietnam Website - Project Documentation

> Last Updated: 2026-03-16

---

## 一、项目概述

越南语版本网站 (Vietnamese Version) 是 Skyworth Solar 官网的本地化版本，主要面向越南市场推广太阳能产品及解决方案。

**网站地址**: `https://vn.skyworth-pv.com/` (待部署)

**源文件位置**: `D:\SkyworthCopy\SkyworthCopy\skyworth-static\`

---

## 二、核心组件

### 2.1 导航组件

| 文件 | 说明 |
|------|------|
| `components/header-nav-vn.html` | 越南语导航栏（含 PC 端和移动端） |
| `build-components-vn.mjs` | 构建脚本，生成 `components-vn.js` |

**构建命令**:
```bash
node build-components-vn.mjs
```

### 2.2 特色组件

| 组件 | 文件 | 说明 |
|------|------|------|
| ROI Calculator | `assets/js/solar-calculator.js` | 太阳能投资回报计算器 |
| Solar Simulation | `pages/software-cloud.html` | 太阳能家庭能源系统模拟器 |

---

## 三、导航结构 (PC端 - 越南语)

### 3.1 Dân Dụng (户用光伏)

```
┌─────────────────────────────────────────────────────────────┐
│ SolaMate [阳台图标]     │  SolaMate Series                │
│ SolaWard [同SolaMate图标] │  - Balcony                     │
│                         │  - Sunshade                     │
│ [Cloud APP 按钮]       │  - Ground                       │
│                         ├───────────────────────────────────│
│                         │  SolaWard Series                │
│                         │  - SolaRoof                     │
│                         │  - SolaLoft                     │
│                         │  - On-Grid                      │
│                         │  - Off-Grid                     │
│                         │  - PV&ESS                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Doanh Nghiệp (工商业光伏)

```
┌─────────────────────────────────────────────────────────────┐
│ SolaWard Pro [xiala04] │  One-stop C & I Solutions        │
│                       │  - AI Data Infrastructure          │
│ [Cloud APP Pro 按钮]  │  - Cold Storage                   │
│ [EPC Service 按钮]    │  - EV Charger                     │
│                       │  - Office Building                 │
│                       │  - Healthcare                      │
│                       │  - Financial Solution             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Sản Phẩm (Products)

```
┌─────────────────────────────────────────────────────────────┐
│ Tấm Pin PV [icon21]    │  PV Module                     │
│ Inverter PV [icon19]   │  - M10 SERIES (420-645W)        │
│ Lưu Trữ Gia Đình [icon20] │  - G12 SERIES (630-720W)    │
│ Lưu Trữ C&I [icon20]   │  - G12R SERIES (440-630W)       │
│ Hệ Thống Gắn Kết [icon22]                                │
│                         ├───────────────────────────────────│
│ [Tất Cả Sản Phẩm 按钮] │  Inverter PV Gia Đình           │
│                         │  - SW 1-3.3KTL-S1                │
│                         │  - SW 4-6KTL-S1                  │
│                         │  - SW 7-10KTL-S1                 │
│                         │  - SW 10-25KTL-S1                │
│                         ├───────────────────────────────────│
│                         │  Inverter PV Công Nghiệp        │
│                         │  - SW 30-33KTL-S1                │
│                         │  - SW 40-60KTL-T1                │
│                         ├───────────────────────────────────│
│                         │  Lưu Trữ Gia Đình               │
│                         │  - SWH 3-6KH-S1                  │
│                         │  - SWH 3-6KL-S1                  │
│                         │  - SWH 5-15KH-T1                 │
│                         │  - SWR5.12-20.48-H1              │
│                         ├───────────────────────────────────│
│                         │  Lưu Trữ C&I                    │
│                         │  - SVH 29-50KH-T1                │
│                         │  - SWS-P50E100-HC                │
│                         │  - SWS-P100E215-HC               │
│                         ├───────────────────────────────────│
│                         │  Tấm Pin PV                     │
│                         ├───────────────────────────────────│
│                         │  Hệ Thống Gắn Kết               │
│                         │  - For Tile Roof                 │
│                         │  - For Slate Roof                │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Kênh đối tác (合作伙伴)

| 菜单项 | 图标 |
|--------|------|
| Partner Home | xiala04.svg |
| Become an Installer | icon07.svg |
| Certificates | icon43-317.svg |
| Đăng Nhập Đối Tác | icon05-300.svg |

### 3.5 Hỗ Trợ (支持)

| 菜单项 | 图标 |
|--------|------|
| Hỏi AI | a1_icon_08.svg |
| Câu Hỏi Thường Gặp | xiala03.svg |
| Wiki | icon08.svg |
| Tải Xuống (Downloads) | xiala01.svg |
| User Login | icon05-300.svg |

---

## 四、历史更新记录

### 2026-03-16

- **导航语言统一为越南语**: 主导航标题和产品菜单使用越南语
- **Products 菜单结构调整**:
  - 移除 Residential Solar
  - Battery Storage System 拆分为 Lưu Trữ Gia Đình 和 Lưu Trữ C&I
  - 菜单顺序调整为: Tấm Pin PV → Inverter PV → Lưu Trữ Gia Đình → Lưu Trữ C&I → Hệ Thống Gắn Kết
- **Business 菜单更新**: Free Site Audit 替换为 EPC Service
- **合作伙伴/支持菜单图标更新**:
  - Partner: xiala04.svg, icon07.svg, icon43-317.svg, icon05-300.svg
  - Support: a1_icon_08.svg, xiala03.svg, icon08.svg, xiala01.svg, icon05-300.svg

### 2026-03-12

- **Free Site Audit 按钮**: 在 Business 菜单添加 "📏 Free Site Audit" 按钮
- **图标更新**: SolaMate 使用阳台线条图标，SolaWard 使用 SolaMate 图标
- **跳动修复**: 添加 `.hpsr-list { min-height: 400px; }` 修复子产品切换时的DOM跳动问题

### 2026-03-11

- **导航文字修改**: Product → Products, SolaWard Pro Series → One-stop C & I Solutions
- **子产品更新**:
  - Residential: SolaWard 增加 SolaRoof、SolaLoft 子产品
- **解决方案移除**: 移除 Residential 和 Business 菜单中的 Solutions 内容

### 早期更新

- 创建越南语导航 `header-nav-vn.html`
- 实现与英文版一致的 Product 下拉样式
- 修复 jQuery hover 事件作用域问题

---

## 五、技术要点

### 5.1 下拉菜单交互

```javascript
// 作用域 hover 事件到当前下拉容器
$('.head-pull-second-cont').each(function() {
    var $container = $(this);
    var $leftItems = $container.find('.head-pull-second-le .hpsl-list-item');
    var $rightItems = $container.find('.head-pull-second-ri .hpsr-list-item');

    $leftItems.hover(function(){
        var idx = $(this).index();
        $(this).addClass('yxnav-active2').siblings().removeClass('yxnav-active2');
        $rightItems.eq(idx).show().siblings().hide();
    });
});
```

### 5.2 CSS 注意事项

- `head-pull-second-ri` 需要设置 `overflow:visible; max-height:none;` 以显示 Solutions 内容
- `.hpsr-list` 设置 `min-height` 防止切换时跳动

### 5.3 Footer 社交工具 (越南语)

- 仅显示 WhatsApp 和 Zalo
- 图标使用 CSS background 方式:
  - WhatsApp: `20250830/whatsapp-icon.svg`
  - Zalo: `20250830/zalo-icon.svg`

---

## 六、相关资源

### 图片资源

| 文件 | 说明 |
|------|------|
| `Public/Uploads/uploadfile/images/20250830/icon-balcony.svg` | 阳台图标 (SolaMate) |
| `Public/Uploads/uploadfile/images/20250830/a1icon24.svg` | 太阳能板图标 (SolaWard) |
| `Public/Uploads/uploadfile/images/20250830/a1icon25.svg` | 电池图标 |
| `Public/Uploads/uploadfile/images/20250830/a1icon28.svg` | SolaWard Pro 图标 |
| `Public/Uploads/uploadfile/images/20250901/xiala04.svg` | Partner Home 图标 |
| `Public/Uploads/uploadfile/images/20250901/icon07.svg` | Become an Installer 图标 |
| `Public/Uploads/uploadfile/images/20250901/icon43-317.svg` | Certificates 图标 |
| `Public/Uploads/uploadfile/images/20250902/icon05-300.svg` | Login 图标 |
| `Public/Uploads/uploadfile/images/20250901/icon08.svg` | Wiki 图标 |
| `Public/Uploads/uploadfile/images/20250901/xiala01.svg` | Downloads 图标 |
| `Public/Uploads/uploadfile/images/20250901/xiala03.svg` | FAQ 图标 |
| `Public/En/images/a1_icon_08.svg` | Ask AI 图标 |
| `Public/Uploads/uploadfile/images/20250830/whatsapp-icon.svg` | WhatsApp 图标 |
| `Public/Uploads/uploadfile/images/20250830/zalo-icon.svg` | Zalo 图标 |

### 技术文档

- [导航结构文档 (越南语)](docs/nav-structure-vn.md)
- [三语对照导航结构](docs/nav-structure-vn-3lang.md)
- [ROI Calculator 技术文档](docs/roi-calculator.md)
- [Solar Simulation 技术文档](docs/solar-simulation.md)

---

## 七、待办事项

- [ ] 部署越南语网站到生产环境
- [ ] 配置 vn.skyworth-pv.com 域名
- [ ] 验证所有链接有效性
- [ ] 测试移动端导航
