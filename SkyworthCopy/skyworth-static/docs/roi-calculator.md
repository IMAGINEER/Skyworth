# ROI Calculator 组件技术文档

> 文档创建日期：2026-03-11
> 文件位置：`assets/js/solar-calculator.js`

---

## 一、概述

ROI Calculator 是一个面向越南市场的太阳能投资回报计算器组件，提供以下核心功能：

- 8 个越南城市的峰值日照时数数据
- 8 种产品型号选择（SolaMate 2 款 + SolaWard 6 款）
- 自给率、电费单价等参数可调
- 线索获取机制（用户需填写信息解锁完整报告）
- 5 个 KPI 卡片 + 30 年累积收益时间轴

---

## 二、数据结构

### 2.1 城市数据 (CITIES)

```javascript
var CITIES = {
  'Ho Chi Minh City': { peakHours: 1460 },  // 胡志明市
  'Hanoi':             { peakHours: 1150 },  // 河内
  'Da Nang':           { peakHours: 1380 },  // 岘港
  'Hai Phong':         { peakHours: 1180 },  // 海防
  'Can Tho':           { peakHours: 1420 },  // 芹苴
  'Nha Trang':         { peakHours: 1500 },  // 芽庄
  'Binh Duong':        { peakHours: 1440 },  // 平阳
  'Dong Nai':          { peakHours: 1430 }   // 同奈
};
```

**说明**：peakHours 为年峰值日照时数（hours/year），数据来源于越南各城市平均太阳辐照度。

### 2.2 产品数据 (PRODUCTS)

| 产品名称 | 功率 (W) | 价格 (VND) |
|---------|---------|-----------|
| SolaMate 1-to-2 (900W) | 900 | 16,600,000 |
| SolaMate 1-to-4 (1800W) | 1800 | 29,900,000 |
| SolaWard 5kW (5670W) | 5670 | 110,960,000 |
| SolaWard 10kW (11930W) | 11930 | 208,000,000 |
| SolaWard 15kW (17600W) | 17600 | 298,000,000 |
| SolaWard 20kW (23860W) | 23860 | 385,000,000 |
| SolaWard 25kW (29530W) | 29530 | 468,000,000 |
| SolaWard 30kW (35790W) | 35790 | 550,000,000 |

### 2.3 默认参数

```javascript
var DEFAULT_GRID_PRICE = 2103;  // 电网电价 (VND/kWh)
var DEFAULT_FIT_PRICE = 0;      // 上网电价 (VND/kWh)
var DEFAULT_SELF_USE = 80;     // 默认自用率 80%
```

---

## 三、计算逻辑

### 3.1 核心公式

```javascript
function calc() {
  // 1. 年发电量 (kWh/年)
  var annualGen = powerKW * city.peakHours;

  // 2. 年收益 (VND/年)
  var annualRev = (annualGen * selfRate * gridPrice)    // 自用部分
                + (annualGen * (1-selfRate) * fitPrice); // 上网部分

  // 3. 投资回收期 (年)
  var payback = prod.cost / annualRev;

  // 4. 30 年 ROI (%)
  var roi30 = (annualRev * 30) / prod.cost * 100;

  // 5. 平准化度电成本 LCOE (VND/kWh)
  var lcoe = prod.cost / (annualGen * 30);

  // 6. 30 年总收益 (VND)
  var total30 = annualRev * 30;
}
```

### 3.2 参数说明

| 参数 | 说明 | 单位 |
|-----|------|------|
| powerKW | 产品功率 | kW |
| city.peakHours | 城市年峰值日照时数 | hours/year |
| selfRate | 自用率 (用户可调) | % |
| gridPrice | 电网电价 | VND/kWh |
| fitPrice | 上网电价 | VND/kWh |
| prod.cost | 产品价格 | VND |

---

## 四、用户交互流程

### 4.1 触发方式

- **导航栏按钮**：`header-nav-vn.html` 中的 "ROI Calculator" 链接
- 点击后显示弹窗：`#roi-modal-overlay`

### 4.2 表单界面

1. **城市选择**：下拉菜单，选择越南 8 个城市
2. **产品选择**：下拉菜单，选择 8 种产品型号
3. **参数调节**：
   - 电网电价 (VND/kWh) - 默认 2103
   - 自用率 (%) - 默认 80%
   - 上网电价 (VND/kWh) - 默认 0

### 4.3 线索解锁机制

- **锁定状态**：初始只显示部分结果（年发电量、预估年收益）
- **解锁条件**：用户填写姓名、邮箱后，点击"获取完整报告"
- **解锁后**：显示完整 5 个 KPI + 30 年累积收益柱状图

### 4.4 KPI 指标

| 指标 | 说明 |
|-----|------|
| 年发电量 | Annual Generation (kWh) |
| 年收益 | Annual Revenue |
| 投资回收期 | Payback Period (年) |
| 30 年 ROI | 30-Year ROI (%) |
| LCOE | 平准化度电成本 (VND/kWh) |

---

## 五、UI 组件结构

### 5.1 布局

```
+--------------------------------------------------+
|  [城市选择]  [产品选择]              [重置]      |
+--------------------------------------------------+
|                    |                               |
|   参数调节面板      |        KPI 展示区            |
|   - 电网电价        |   [年发电量] [年收益]        |
|   - 自用率          |   [回收期] [30年ROI]        |
|   - 上网电价        |   [LCOE]                    |
|                    |                               |
+--------------------+-------------------------------+
|                30年累积收益柱状图                  |
|  █ █ █ █ █ █ █                            |
+--------------------------------------------------+
|   [姓名] [邮箱] [获取完整报告] (锁定时显示)      |
|   或                                           |
|   [下载报告] [分享] (解锁后显示)                |
+--------------------------------------------------+
```

### 5.2 样式

- 使用 CSS Variables 定义主题色
- 玻璃拟态效果 (backdrop-filter: blur)
- 响应式设计（移动端自适应）

---

## 六、触发与集成

### 6.1 组件加载

组件通过 `components-vn.js` 动态注入到页面，HTML 结构如下：

```html
<!-- 触发按钮 -->
<a href="javascript:void(0);" id="roi-calc-trigger-ph">ROI Calculator</a>

<!-- 弹窗容器 -->
<div id="roi-modal-overlay" style="display:none;">
  <div id="solar-calculator-app"></div>
</div>
```

### 6.2 动态加载

由于组件通过 innerHTML 注入，`<script>` 标签不会自动执行，因此 `components-vn.js` 中包含以下逻辑：

```javascript
// 动态加载 solar-calculator.js
var script = document.createElement('script');
script.src = 'assets/js/solar-calculator.js';
document.head.appendChild(script);

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'assets/css/solar-calculator.css';
document.head.appendChild(link);
```

---

## 七、相关文件

| 文件 | 说明 |
|-----|------|
| `components/header-nav-vn.html` | 越南语导航栏（含触发按钮和弹窗） |
| `assets/js/solar-calculator.js` | ROI 计算器核心逻辑 |
| `assets/css/solar-calculator.css` | ROI 计算器样式 |
| `assets/js/components-vn.js` | 越南语组件注入脚本 |
| `templates/test.html` | 测试页面 |
