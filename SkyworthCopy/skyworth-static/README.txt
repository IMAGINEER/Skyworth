========================================================
  SKYWORTH-PV 静态站点 — 项目说明文档
  最后更新：2026-03-16
========================================================


一、项目文件结构说明
──────────────────────────────────────────────────────
skyworth-static/
│
├── index.html              首页（已改造为组件化结构）
│
├── components/             ★ 公共组件（所有页面共用）
│   ├── header-nav.html     英文导航栏 HTML（人工维护源文件）
│   ├── footer.html         英文页脚 HTML（人工维护源文件）
│   ├── header-nav-vn.html  越南语导航栏 HTML（人工维护源文件）
│   └── footer-vn.html      越南语页脚 HTML（人工维护源文件）
│
├── templates/              ★ 页面模板 + 测试页
│   ├── product-template.html    产品详情页模板
│   ├── solution-template.html   解决方案页模板
│   ├── case-template.html       案例详情页模板
│   └── test.html                ROI 计算器组件测试页
│
├── pages/                  真实页面（产品页、案例页、解决方案页等）
│   ├── sola-mate.html            SolaMate 产品页（英文）
│   ├── sola-mate-vn.html         SolaMate 产品页（越南语）
│   ├── sola-ward.html            SolaWard 产品页
│   └── software-cloud.html       Software Cloud 页面（越南语头尾）
│
├── assets/
│   ├── css/
│   │   └── solar-calculator.css  ROI 计算器组件样式
│   ├── images/             （预留，当前未使用）
│   └── js/
│       ├── components.js      ★ 英文版自动生成（注入英文 header/footer）
│       ├── components-vn.js   ★ 越南语版自动生成（注入越南语 header/footer + 动态加载 ROI 计算器）
│       └── solar-calculator.js  ROI 计算器组件（越南分城市 + 线索解锁）
│                               【components*.js 不要手动编辑】
│
├── Public/                 原网站静态资源（CSS/JS/图片/字体/视频）
│   └── En/
│       ├── css/            样式文件（main.css、public.css 等）
│       ├── js/             脚本文件（jquery、swiper 等）
│       ├── fonts/          Figtree 字体
│       ├── images/         UI 图标（SVG/PNG）
│       └── ...
│   └── Uploads/
│       └── uploadfile/
│           ├── images/     业务图片（按日期子目录存放）
│           └── files/      视频文件（mp4/webm）
│
├── En/                     HTTrack 抓取的下载文件（PDF 产品手册等）
│   └── Skippower/          产品资料 PDF
│
│── build-components.mjs    ★ 英文版构建脚本（本地开发用，不上传）
├── build-components-vn.mjs ★ 越南语版构建脚本（含动态 JS 加载逻辑）
├── translate-gemini.mjs    Gemini API 翻译工具
├── check-paths.mjs         路径检查工具（本地开发用，不上传）
└── list-files.mjs          文件清单工具（本地开发用，不上传）


关键设计原则：
  - 导航和页脚通过 components.js 注入，全站只需改一处
  - 多语言支持：英文页面用 components.js，越南语页面用 components-vn.js
  - components-vn.js 额外动态加载 ROI 计算器（因 innerHTML 不执行 script 标签）
  - 所有路径均为相对路径，上传到任意子目录均可正常工作
  - templates/ 和 pages/ 下的页面使用 <base href="../"> 确保路径正确解析


页面结构说明：
──────────────────────────────────────────────────────
  templates/    存放页面模板，不直接访问。
                模板中的内容用中括号占位，如 [产品名称]、[参数值]。

  pages/        存放真实页面，例如产品页、案例页、解决方案页。
                这些是实际对外展示的页面。

  创建新页面流程：
    1）从 templates/ 复制一个模板
    2）粘贴到 pages/ 目录并重命名
    3）修改页面内容和图片


二、如何新增一个产品页
──────────────────────────────────────────────────────
【步骤 1】复制模板文件

  将 templates/product-template.html 复制并重命名到 pages/，例如：
  pages/sky-inverter-x3-pro.html

【步骤 2】替换所有占位符

  在编辑器中全局搜索 [ ，找到所有占位符并替换为真实内容：

  常见占位符示例：
    [产品名称]         →  SkyInverter X3 Pro
    [产品简介]         →  High-efficiency single-phase hybrid inverter...
    [参数值1]          →  6
    [单位1]            →  kW
    [参数名称1]        →  Rated Power
    [特性名称1]        →  High Efficiency
    [文件下载链接1]    →  En/Skippower/inverter-datasheet.pdf

【步骤 3】替换图片

  产品主图：
    找到 <div class="tpl-img-placeholder"> 占位块，
    删除整个占位 div，替换为：
    <img src="Public/Uploads/uploadfile/images/[日期]/[图片名].jpg"
         alt="[产品名称]" />

  若要上传新图片：
    - 将图片放入 Public/Uploads/uploadfile/images/[YYYYMMDD]/ 目录
    - 路径格式：Public/Uploads/uploadfile/images/20260306/product-img.jpg

【步骤 4】修改页面标题和 SEO

  在 <head> 中修改：
    <title>[产品名称] - SKYWORTH</title>
    <meta name="description" content="[产品SEO描述]" />
    <meta name="keywords" content="[关键词1], [关键词2]" />

【步骤 5】更新导航中的当前页高亮（可选）

  如果需要导航高亮当前菜单项，在注入后可用 JS 添加 act 类：
  在页面底部 <script> 中加入：

    document.addEventListener('DOMContentLoaded', function() {
      // 示例：高亮 Product 菜单
      var items = document.querySelectorAll('.head-nav-item');
      items[2].classList.add('yxnav-active1'); // 第3项 = Product
    });

【步骤 6】检查并上传

  上传新增的 HTML 文件以及 Public/Uploads/ 中的新图片即可，
  其他文件无需重新上传。


三、FTP 上传文件清单
──────────────────────────────────────────────────────
【首次完整上传（约 831 MB）】
  上传以下目录和文件到服务器根目录（通常为 /public_html/ 或 /www/）：

  ✅ index.html
  ✅ components/           （4 个文件，含英文+越南语导航和页脚）
  ✅ templates/             （3 个模板 + 1 个测试页）
  ✅ pages/                （4 个页面文件）
  ✅ assets/               （含 components.js/components-vn.js + ROI 计算器）
  ✅ Public/               （约 703 MB，含所有 CSS/JS/图片/视频）
  ✅ En/                   （约 128 MB，含 PDF 产品手册）

  ❌ 以下文件【不需要上传】（仅本地开发工具）：
     build-components.mjs
     build-components-vn.mjs
     build-components.ps1
     translate-gemini.mjs
     check-paths.mjs
     list-files.mjs
     README.txt（本文件）

【后续增量更新】
  - 新增产品页：只上传新的 HTML 文件 + 新图片
  - 修改导航/页脚：上传 assets/js/components.js 或 components-vn.js（见第四节）
  - 更新 ROI 计算器：上传 assets/js/solar-calculator.js + assets/css/solar-calculator.css
  - 更新首页内容：只上传 index.html
  - 更新样式：只上传对应的 CSS 文件（Public/En/css/）

【注意】Public/Uploads/uploadfile/files/ 中有大视频文件（mp4），
  如果服务器带宽有限可先跳过，页面仍可正常显示（视频区域为空白）。


四、如何修改导航（header-nav）
──────────────────────────────────────────────────────
导航和页脚的工作原理：

  英文版：
  components/header-nav.html  ←  人工编辑 → assets/js/components.js（自动生成）
  components/footer.html      ←  人工编辑 ↗

  越南语版：
  components/header-nav-vn.html ← 人工编辑 → assets/js/components-vn.js（自动生成）
  components/footer-vn.html     ← 人工编辑 ↗

  页面加载时，根据引用的 JS 文件自动注入对应语言的 header 和 footer

【修改步骤】

  Step 1：用编辑器打开并修改源文件
    - 增加导航菜单项：编辑 components/header-nav.html
    - 修改页脚链接：  编辑 components/footer.html
    - 修改版权信息：  编辑 components/footer.html（搜索 "Copyright"）
    - 修改 Logo：     编辑 components/header-nav.html（搜索 "LOGOfanbai"）

  Step 2：重新生成 components.js
    在 skyworth-static/ 目录中，打开终端执行：

      node build-components.mjs

    执行成功后会输出：
      header-nav.html written (XXXX lines)
      footer.html written (XX lines)
      components.js written (XXXXXX bytes)
      index.html rewritten (XXXX lines)

  Step 3：上传更新的文件
    只需上传：assets/js/components.js
    所有页面（index.html 及 pages/ 下的所有页面）将自动使用新导航。

  【越南语版构建】
    修改 components/header-nav-vn.html 或 footer-vn.html 后，执行：

      node build-components-vn.mjs

    此脚本额外注入动态加载逻辑（solar-calculator.js/css + ROI 弹窗事件绑定），
    因为 innerHTML 注入的 <script> 标签不会被浏览器执行。
    上传：assets/js/components-vn.js


五、ROI 计算器组件
──────────────────────────────────────────────────────
  文件：assets/js/solar-calculator.js + assets/css/solar-calculator.css

  功能：
  - 越南分城市 ROI 计算（8 城市，各有独立峰值日照时数）
  - 8 个产品预设（SolaMate ×2 + SolaWard ×6）
  - 线索解锁机制（姓名/邮箱/验证码表单，提交后结果淡入展示）
  - 5 个 KPI 卡片 + 6 条累积收益时间轴柱状图

  集成方式：
  - 越南语页面：已通过 header 中 "ROI Calculator" 按钮弹窗触发
  - 独立使用：在任意页面添加：
      <link href="assets/css/solar-calculator.css" rel="stylesheet">
      <div id="solar-calculator-app"></div>
      <script src="assets/js/solar-calculator.js"></script>

  测试页：templates/test.html


六、导航菜单结构说明（2026-03-16 更新）
──────────────────────────────────────────────────────
【主导航 - 越南语】
1. Dân Dụng (户用光伏)
2. Doanh Nghiệp (工商业光伏)
3. Sản Phẩm (Products)
4. Kênh đối tác (合作伙伴)
5. Hỗ Trợ (支持)

Dân Dụng (户用) 菜单：
  - SolaMate：使用阳台线条图标 (icon-balcony.svg)
  - SolaWard：使用 SolaMate 图标 (a1icon24.svg)
  - Cloud APP 按钮
  - 子产品：Balcony / Sunshade / Ground (SolaMate)
  - 子产品：SolaRoof / SolaLoft / On-Grid / Off-Grid / PV&ESS (SolaWard)

Doanh Nghiệp (工商业) 菜单：
  - SolaWard Pro
  - Cloud APP Pro 按钮
  - EPC Service 按钮
  - 子产品：One-stop C & I Solutions (AI Data Infrastructure, Cold Storage, EV Charger, Office Building, Healthcare, Financial Solution)

Sản Phẩm (Products) 菜单：
  - Tấm Pin PV (光伏组件)
  - Inverter PV (光伏逆变器)
  - Lưu Trữ Gia Đình (户用储能)
  - Lưu Trữ C&I (工商业储能)
  - Hệ Thống Gắn Kết (支架系统)
  - Tất Cả Sản Phẩm 按钮
  - 子产品：PV Module / Residential PV Inverter / Business PV Inverter / Residential ESS / C&I ESS / Mounting System

Kênh đối tác (合作伙伴) 菜单：
  - Partner Home (xiala04.svg)
  - Become an Installer (icon07.svg)
  - Certificates (icon43-317.svg)
  - Đăng Nhập Đối Tác (icon05-300.svg)

Hỗ Trợ (支持) 菜单：
  - Hỏi AI (a1_icon_08.svg)
  - Câu Hỏi Thường Gặp (xiala03.svg)
  - Wiki (icon08.svg)
  - Tải Xuống / Downloads (xiala01.svg)
  - User Login (icon05-300.svg)

注意事项：
  - head-pull-second-ri 需要设置 overflow:visible; max-height:none; 显示子产品
  - .hpsr-list 设置 min-height:400px 防止切换时跳动


七、Solar System Simulation 太阳能系统模拟器
──────────────────────────────────────────────────────
  位置：pages/software-cloud.html

  功能：
  - Hero 区域 CTA 按钮，点击打开太阳能系统模拟器
  - 模拟器展示家庭能源场景：可选择空调、热水器等设备
  - 实时可视化发电/耗电数据，播放进度条可拖动
  - 视频播放结束后弹出报告预览弹窗
  - 报告包含：场景摘要、能源战报、自给率、植树量、经济预测、专业建议
  - 线索获取表单：用户填写姓名/邮箱后解锁完整报告
  - 响应式设计：PC端显示文字+图标，移动端仅显示图标

  按钮样式：
  - 带光晕动画效果 (ctaGlow keyframes)
  - 右侧添加指向手指图标 👉
  - 使用 std-btn1 wow ys-fadeup1 样式类

  播放速度：0.25x (约32秒播完)


八、Help 插件（右下角客服组件）
──────────────────────────────────────────────────────
  位置：components/footer-vn.html 中的 mod-help

  功能：
  - 社交工具菜单：鼠标悬停时向上展开，仅显示 WhatsApp/Zalo（越南语版）
  - 图标使用 CSS background 方式加载
  - 在线客服聊天窗口：点击主按钮打开
    - 客服头像和在线状态指示
    - 欢迎消息（越南语+英语双语）
    - 快捷回复按钮（了解产品/询价/技术支持）
    - 消息输入框和发送按钮
    - 模拟自动回复功能

  图标资源：
  - whatsapp-icon.svg (20250830/whatsapp-icon.svg)
  - zalo-icon.svg (20250830/zalo-icon.svg)
  - logo-circle.svg（客服头像）


九、常见问题
──────────────────────────────────────────────────────
Q: 页面打开后导航/页脚没有显示？
A: 检查 assets/js/components.js 是否已上传；
   检查页面中是否有 id="header-nav-placeholder" 和
   id="footer-placeholder" 的 div；
   检查浏览器控制台是否有 JS 报错。

Q: 页面样式错乱？
A: 检查 Public/En/css/ 目录是否完整上传；
   检查页面的 <base href="../"> 设置是否正确（pages/ 下的页面需要）；
   index.html 不需要 <base href>。

Q: 图片不显示？
A: 检查 Public/Uploads/uploadfile/images/ 目录是否上传；
   检查图片路径大小写（Linux 服务器区分大小写）。

Q: 视频加载慢或不显示？
A: 视频文件在 Public/Uploads/uploadfile/files/ 目录，
   大文件可能需要服务器配置 mp4 MIME 类型；
   建议将视频迁移到 CDN 并修改 src 路径。

Q: 如何给 pages/ 下的新页面配置域名访问？
A: 服务器上配置 URL Rewrite，将 /pages/xxx.html 映射为
   友好 URL，或直接通过目录路径访问。


========================================================
  如有问题，联系技术支持
  技术栈：HTML5 + CSS3（CSS Variables）+ jQuery
  构建工具：Node.js 18+
========================================================
