# Solar System Simulation 组件技术文档

> 文档创建日期：2026-03-11
> 文件位置：`pages/software-cloud.html`

---

## 一、概述

Solar System Simulation 是一个交互式太阳能家庭能源系统模拟器，提供以下核心功能：

- 全屏视频动画展示家庭太阳能系统运行场景
- 可交互设备选择（空调、电动车、泳池、厨房）
- 实时发电/耗电数据可视化
- 时间滑块控制（6:00 - 18:00）
- 视频结束后弹出报告预览弹窗
- 线索获取表单（用户填写信息解锁完整报告）

---

## 二、场景与条件

### 2.1 系统参数

| 参数 | 值 | 说明 |
|-----|-----|------|
| PV系统容量 | 5.67 kWp | 太阳能板装机容量 |
| 电池容量 | 10 kWh | ESS 储能系统 |
| 初始SOC | 20% | 电池初始荷电状态 |
| 电网电价 | var 2,103 VND/kWh | 越南平均电价 |

### 2.2 可控设备

| 设备 | 图标 | 功率 (kW) |
|-----|------|----------|
| 空调 | ❄️ AC | 1.5 |
| 电动车 | 🚗 EV | 3.0 |
| 泳池泵 | 🏊 Pool | 0.8 |
| 厨房设备 | 🍳 Kit | 0.5 |

**初始负载**：0.5 kW（默认开启状态）

### 2.3 时间范围

- 起始时间：06:00 (360)
- 结束 分钟时间：18:00 (1080 分钟)
- 总时长：12 小时 = 720 分钟

---

## 三、计算逻辑

### 3.1 发电量计算

```javascript
// 当前发电功率 (kW)
// 使用正弦曲线模拟日出到日落的发电曲线
var currentPv = Math.max(0, PV_MAX * Math.sin(progress * Math.PI));

// 发电效率百分比
var pvEffPercent = Math.round(currentPv / PV_MAX * 100);

// 累积发电量 (kWh)
// 使用积分公式：∫0^t PV_MAX * sin(π*t/T) dt
var cumulativeGen = (PV_MAX * 12 / Math.PI) * (1 - Math.cos(Math.PI * progress));
```

### 3.2 电池 SOC 计算

```javascript
// 净能量变化 (kWh)
// 假设平均发电为峰值的一半，减去负载
var energyNet = (currentPv / 2 - activeLoad) * (progress * 12);

// 电池荷电状态 (5% - 100%)
var currentSoc = Math.max(5, Math.min(100, 20 + energyNet / 10 * 100));
```

### 3.3 电网功率计算

```javascript
var loadGap = activeLoad - currentPv;
var gridPower = 0;

if (loadGap > 0) {
  // 需要从电网或电池获取电力
  if (currentSoc > 10) {
    // 优先使用电池
    gridPower = Math.min(loadGap, 3.0); // 电池最大放电 3kW
    loadGap -= gridPower;
  }
  // 剩余缺口从电网获取
  gridPower += loadGap;
}
```

### 3.4 自给率计算

```javascript
// 自给率 = (负载 - 电网取电) / 负载 * 100%
var selfSufficiency = (activeLoad > 0)
  ? ((activeLoad - gridPower) / activeLoad * 100)
  : 100;
```

### 3.5 收益计算

```javascript
// 累积收益 (VND)
var profit = cumulativeGen * TARIFF;  // TARIFF = 2103 VND/kWh
```

### 3.6 系统状态判定

```javascript
if (gridPower > 0) {
  status = "Grid Importing";  // 从电网取电
} else if (currentPv > activeLoad) {
  status = "ESS Charging";    // 电池充电中
} else {
  status = "Self-Sustaining"; // 自给自足
}
```

---

## 四、用户交互流程

### 4.1 打开模拟器

1. 用户点击 Hero 区域的 "Solar System Simulation" 按钮
2. 页面滚动到顶部
3. 全屏模拟器区域渐变显示 (opacity: 0 → 1)
4. 背景视频暂停，模拟器视频开始播放
5. 播放速度：0.25x（约 32 秒播完）

### 4.2 交互操作

| 操作 | 说明 |
|-----|------|
| 点击设备按钮 | 开启/关闭对应设备，实时更新负载和计算结果 |
| 拖动时间滑块 | 调整时间（6:00-18:00），同步更新所有数据 |
| 点击关闭按钮 | 关闭模拟器，恢复背景视频播放 |

### 4.3 视频结束事件

1. 视频播放完毕 (`video.ended` 事件)
2. 自动弹出报告预览弹窗
3. 弹窗动态获取当前模拟数据：
   - 自给率
   - 每日收益（从profit计算）
   - 每年收益（每日 × 365）
   - 植树量（每年收益/1000×12）

### 4.4 线索获取

弹窗包含两个 CTA：
- **WhatsApp 咨询**：跳转 WhatsApp 联系页面
- **再次体验**：关闭弹窗和模拟器，重置状态

---

## 五、UI 组件结构

### 5.1 布局 (PC)

```
+------------------------------------------------------------------+
|  [关闭按钮]                                                       |
|                                                                   |
|    [PV: 5.67kWp 80%]        [Energy: 10kWh 45%]                |
|                                                                   |
| +-------------+                           +------------------+   |
| | Grid        |                           | Profit           |   |
| | 0.00 kW     |                           | 125,400 VND      |   |
| | 2,103/kWh  |                           | [=====      ]    |   |
| +-------------+                           +------------------+   |
| | Load        |                                                   |
| | 0.50 kW    |                                                   |
| | [❄️AC][🚗EV]|                                                 |
| | [🏊][🍳]   |                                                   |
| +-------------+                                                   |
|                                                                   |
| +--------------------------------------------------------------+ |
| |  🌅6AM  [=================]  🌇6PM      12:30              | |
| +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

### 5.2 布局 (移动端)

```
+------------------+
| [X]              |
|                  |
| [PV] [Energy]    |
|                  |
| Profit: 125,400  |
| [=====      ]    |
|                  |
| [❄️][🚗][🏊][🍳] |
|                  |
| [===== 12:30 ===]|
+------------------+
```

### 5.3 视频背景

- 视频源：`Public/Uploads/uploadfile/files/20250815/simulation-video-back.mp4`
- 渲染方式：`object-fit: cover` 全屏覆盖
- 遮罩：半透明深色背景 `rgba(5, 7, 10, 0.92)`

---

## 六、关键技术点

### 6.1 视频播放控制

```javascript
// 设置播放速度为 0.25x (32秒播完)
video.playbackRate = 0.25;

// 监听时间更新，同步滑块和数据
video.addEventListener('timeupdate', () => {
  var progress = video.currentTime / video.duration;
  var minutes = 360 + progress * 720;
  scrubber.value = minutes;
  updateLogic(progress, minutes);
});
```

### 6.2 滑块与视频同步

```javascript
// 用户拖动滑块时，同步视频播放位置
scrubber.addEventListener('input', () => {
  var progress = (scrubber.value - 360) / 720;
  video.currentTime = progress * video.duration;
  updateLogic(progress, parseInt(scrubber.value));
});
```

### 6.3 弹窗动态数据注入

```javascript
function createPopupModal() {
  // 从模拟器获取实时数据
  var selfSufficiency = document.getElementById('val-self').innerText;
  var dailyProfit = document.getElementById('val-profit').innerText;

  // 计算派生数据
  var yearlyProfit = Math.round(parseFloat(dailyProfit.replace(/[^0-9.]/g, '')) * 365);
  var treesPlanted = Math.round(parseFloat(dailyProfit.replace(/[^0-9.]/g, '')) / 1000 * 12);
  var needsBattery = parseInt(selfSufficiency.replace('%', '')) < 80;

  // 返回弹窗 HTML 字符串
  return `...`;
}
```

---

## 七、相关文件

| 文件 | 说明 |
|-----|------|
| `pages/software-cloud.html` | 主页面（含模拟器 HTML/CSS/JS） |
| `components/header-nav-vn.html` | 越南语导航（含 ROI Calculator） |
| `assets/js/solar-calculator.js` | ROI 计算器逻辑 |
| `assets/css/solar-calculator.css` | ROI 计算器样式 |
| `Public/Uploads/uploadfile/files/20250815/simulation-video-back.mp4` | 模拟器背景视频 |

---

## 八、响应式断点

| 断点 | 布局变化 |
|-----|---------|
| > 768px (PC) | 三栏布局，设备显示文字+图标 |
| ≤ 768px (移动端) | 单栏布局，设备仅显示图标 |

---

## 九、动画效果

| 效果 | 实现方式 |
|-----|---------|
| 模拟器渐显 | CSS transition: opacity 0.4s |
| 弹窗出现 | CSS keyframes popupFadeIn |
| CTA 按钮光晕 | CSS keyframes ctaGlow (2s infinite) |
| 柱状图变化 | CSS transition: height 0.6s |
| 数值变化 | jQuery 实时更新 DOM |
