# ROI Calculator 组件技术文档

> 文档创建日期：2026-03-11
> 文件位置：`assets/js/solar-calculator.js`

---

## 一、概述

ROI Calculator 是一个面向越南市场的太阳能投资回报计算器组件，提供以下核心功能：

- 17个越南城市的峰值日照时数数据
- 10 种产品型号选择（SolaMate 2 款 + SolaHome 4 款 + SolaHome Pro 4 款）
- 自给率、电费单价等参数可调
- **SolaHome Pro 系列自动拉满自用率至 100%**（配储产品）
- 考虑光伏系统衰减率（每年 0.4827%，30 年累计发电为无衰减的 93%）
- 线索获取机制（用户需填写信息解锁完整报告）
- 5 个 KPI 卡片 + 30 年累积收益时间轴

---

## 二、数据结构

### 2.1 城市数据 (CITIES)

```javascript
var CITIES = {
  'Ho Chi Minh City': { peakHours: 1580 },  // ↑ 实测略高
  'Hanoi':             { peakHours: 1100 },  // ↑ 北部修正
  'Da Nang':           { peakHours: 1480 },  // ↑ 中部优化
  'Hai Phong':         { peakHours: 1120 },  // ↑ 同北部
  'Can Tho':           { peakHours: 1550 },  // ↑ 南部
  'Nha Trang':         { peakHours: 1620 },  // ↑ 高辐射带
  'Binh Duong':        { peakHours: 1560 },  // ↑ 工业区
  'Dong Nai':          { peakHours: 1540 }，   // ↑ 工业区
  'Ninh Thuan':   { peakHours: 1750 },  // 全国最高辐射
  'Binh Thuan':   { peakHours: 1680 },  // 极优光照+低降雨
  'Tay Ninh':     { peakHours: 1580 },  // 南部高辐射带
  'Binh Phuoc':   { peakHours: 1600 },  // 全国潜力最大（47GW）
  'Gia Lai':      { peakHours: 1550 },  // 高原高辐射
  'Dak Lak':      { peakHours: 1530 },  // 稳定高日照

  'Ba Ria-Vung Tau': { peakHours: 1500 }, // 沿海稳定高辐射
  'Long An':      { peakHours: 1520 },  // 工商业+南部辐射
  'Khanh Hoa':    { peakHours: 1600 }   // 含芽庄高辐射区
};

```
**说明**：peakHours 为年峰值日照时数（hours/year），数据来源于越南各城市平均太阳辐照度。
**数据源**：https://energydata.info/dataset/vietnam-solar-radiation-measurement-data（2026年更新）

### 2.2 产品数据 (PRODUCTS)

| 产品名称 | 功率 (W) | 价格 (VND) | 配储 |
|---------|---------|-----------|------|
SolaMate系列
| SolaMate 1-to-2 (900W) | 900 | 16,600,000 | 否 |
| SolaMate 1-to-4 (1800W) | 1800 | 30,000,000 | 否 |
SolaHome系列
| SolaRoof 5kW (5.04kWp) | 5040 | 69,000,000 | 否 |
| SolaRoof 10kW (10.08kWp) | 10080 | 129,000,000 | 否 |
| SolaLoft 5kW (5.04kWp) | 5040 | 79,000,000 | 否 |
| SolaLoft 10kW (10.08kWp) | 10080 | 149,000,000 | 否 |
SolaHome Pro系列 (配储)
| SolaRoof 5kW Pro (5.04kWp) | 5040 | 76,000,000 | **是** |
| SolaRoof 10kW Pro (10.08kWp) | 10080 | 136,000,000 | **是** |
| SolaLoft 5kW Pro (5.04kWp) | 5040 | 89,000,000 | **是** |
| SolaLoft 10kW Pro (11.34kW) | 11340 | 169,000,000 | **是** |

> **配储说明**：选择 SolaHome Pro 系列时，自用率自动设置为 100%

### 2.3 默认参数

```javascript
var DEFAULT_GRID_PRICE = 2103;  // 电网电价 (VND/kWh)
var DEFAULT_FIT_PRICE = 0;      // 上网电价 (VND/kWh)
var DEFAULT_SELF_USE = 80;     // 默认自用率 80%
```

---

## 三、计算逻辑

### 3.1 衰减率 (Degradation)

光伏系统考虑线性衰减，参数如下：

| 参数 | 值 | 说明 |
|-----|-----|------|
| Year 1 | 100% | 完整发电 |
| Year 2 | 99% | 首年衰减 1% |
| 衰减率 | 0.4827%/年 | 线性衰减 |
| Year 30 | ~85% | 30年累计发电为无衰减的 93% |

```javascript
var DEG_RATE = 0.004827; // ~0.4827% per year

function getDegradation(year) {
  if (year <= 1) return 1.0;
  if (year === 2) return 0.99;
  return 0.99 - (year - 2) * DEG_RATE;
}
```

### 3.2 核心公式

```javascript
function calc() {
  // 1. 每年发电量 (kWh/年) - 考虑衰减率
  // Year N 发电量 = powerKW * peakHours * degradation(N)

  // 2. 30年循环累加
  for (var y = 1; y <= 30; y++) {
    var deg = getDegradation(y);
    var gen = powerKW * city.peakHours * deg;
    var rev = (gen * selfRate * gridPrice) + (gen * (1-selfRate) * fitPrice);
    totalGen30 += gen;
    totalRev30 += rev;

    // 3. 逐年计算回收期
    cumulativeRev += rev;
    if (payback === Infinity && cumulativeRev >= cost) {
      payback = y - 1 + (cost - (cumulativeRev - rev)) / rev;
    }
  }

  // 4. 30 年 ROI
  var roi30 = totalRev30 / cost;

  // 5. 平准化度电成本 LCOE (VND/kWh)
  var lcoe = cost / totalGen30;
}
```

### 3.3 参数说明

| 参数 | 说明 | 单位 |
|-----|------|------|
| powerKW | 产品功率 | kW |
| city.peakHours | 城市年峰值日照时数 | hours/year |
| selfRate | 自用率 (用户可调，SolaHome Pro 自动 100%) | % |
| gridPrice | 电网电价 | VND/kWh |
| fitPrice | 上网电价 | VND/kWh |
| prod.cost | 产品价格 | VND |
| degradation | 衰减系数 (0~1) | - |
| totalGen30 | 30年累计发电量 | kWh |
| totalRev30 | 30年累计收益 | VND |

---

## 四、用户交互流程

### 4.1 触发方式

- **导航栏按钮**：`header-nav-vn.html` 中的 "ROI Calculator" 链接
- 点击后显示弹窗：`#roi-modal-overlay`

### 4.2 表单界面

1. **城市选择**：下拉菜单，选择越南 17 个城市
2. **产品选择**：下拉菜单，选择 10 种产品型号
3. **参数调节**：
   - 电网电价 (VND/kWh) - 默认 2103
   - 自用率 (%) - 默认 80%，选择 SolaHome Pro 系列时自动 100%
   - 上网电价 (VND/kWh) - 默认 0

### 4.3 线索解锁机制

- **锁定状态**：初始只显示部分结果（年发电量、预估年收益）
- **解锁条件**：用户填写姓名、邮箱后，点击"获取完整报告"
- **解锁后**：显示完整 5 个 KPI + 30 年累积收益柱状图

### 4.4 KPI 指标

| 指标 | 说明 |
|-----|------|
| 年发电量 | Year 1 发电量 (kWh)，未考虑衰减 |
| 年收益 | Year 1 收益 (VND)，全额自用/上网 |
| 投资回收期 | 累计收益首次超过成本的年份 (年) |
| 30 年 ROI | 30年累计总收益 / 成本 |
| LCOE | 平准化度电成本 (VND/kWh)，考虑30年衰减 |
| 30年总收益 | 30年累计发电收益 (VND) |

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
