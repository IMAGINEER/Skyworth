/**
 * Solar ROI Calculator Component — Vietnam Edition with Lead Unlock
 * Usage: <div id="solar-calculator-app"></div>
 *        <link href="assets/css/solar-calculator.css" rel="stylesheet">
 *        <script src="assets/js/solar-calculator.js"></script>
 */
(function () {
  'use strict';

  /* ========== City Data (Vietnam) ========== */
  var CITIES = {
    'Ho Chi Minh City':  { peakHours: 1460 },
    'Hanoi':             { peakHours: 1150 },
    'Da Nang':           { peakHours: 1380 },
    'Hai Phong':         { peakHours: 1180 },
    'Can Tho':           { peakHours: 1420 },
    'Nha Trang':         { peakHours: 1500 },
    'Binh Duong':        { peakHours: 1440 },
    'Dong Nai':          { peakHours: 1430 }
  };

  var PRODUCTS = [
    { name: 'SolaMate 1-to-2 (900W)',    power: 900,    cost: 16600000 },
    { name: 'SolaMate 1-to-4 (1800W)',   power: 1800,   cost: 29900000 },
    { name: 'SolaWard 5kW (5670W)',      power: 5670,   cost: 110960000 },
    { name: 'SolaWard 10kW (11930W)',    power: 11930,  cost: 208000000 },
    { name: 'SolaWard 15kW (17600W)',    power: 17600,  cost: 298000000 },
    { name: 'SolaWard 20kW (23860W)',    power: 23860,  cost: 385000000 },
    { name: 'SolaWard 25kW (29530W)',    power: 29530,  cost: 468000000 },
    { name: 'SolaWard 30kW (35790W)',    power: 35790,  cost: 550000000 }
  ];

  var CURRENCY = 'VND';
  var DEFAULT_GRID_PRICE = 2103;
  var DEFAULT_FIT_PRICE = 0;

  /* ========== Helpers ========== */
  function fmtVND(v) {
    var abs = Math.abs(v);
    if (abs >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return (v / 1e3).toFixed(0) + 'K';
    return v.toFixed(0);
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') node.className = attrs[k];
      else if (k === 'innerHTML') node.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    if (children) children.forEach(function (c) {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  /* ========== State ========== */
  var state = {
    city: 'Ho Chi Minh City',
    productIdx: 0,
    gridPrice: DEFAULT_GRID_PRICE,
    selfUse: 80,
    fitPrice: DEFAULT_FIT_PRICE,
    unlocked: false
  };

  function getCity() { return CITIES[state.city]; }
  function getProduct() { return PRODUCTS[state.productIdx]; }

  /* ========== Calculation ========== */
  function calc() {
    var city = getCity();
    var prod = getProduct();
    var powerKW = prod.power / 1000;
    var annualGen = powerKW * city.peakHours;
    var selfRate = state.selfUse / 100;
    var annualRev = (annualGen * selfRate * state.gridPrice) + (annualGen * (1 - selfRate) * state.fitPrice);
    var payback = annualRev > 0 ? prod.cost / annualRev : Infinity;
    var roi30 = annualRev > 0 ? (annualRev * 30) / prod.cost : 0;
    var lcoe = annualGen > 0 ? prod.cost / (annualGen * 30) : 0;
    var total30 = annualRev * 30;
    return {
      annualGen: annualGen,
      annualRev: annualRev,
      payback: payback,
      roi30: roi30,
      lcoe: lcoe,
      total30: total30,
      cost: prod.cost
    };
  }

  /* ========== Refs ========== */
  var refs = {};

  /* ========== Build Sidebar ========== */
  function buildSidebar() {
    var sidebar = el('div', { className: 'sc-sidebar' });

    sidebar.appendChild(el('div', { className: 'sc-sidebar-title', innerHTML: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00e2e0" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> ROI Calculator' }));
    sidebar.appendChild(el('p', { className: 'sc-sidebar-sub' }, ['Vietnam solar investment estimator']));

    // City
    var citySel = el('select', { className: 'sc-select', onChange: onCityChange });
    Object.keys(CITIES).forEach(function (c) {
      citySel.appendChild(el('option', { value: c }, [c]));
    });
    sidebar.appendChild(field('City', citySel));
    refs.citySel = citySel;

    // Product
    refs.productSel = el('select', { className: 'sc-select', onChange: onProductChange });
    PRODUCTS.forEach(function (p, i) {
      refs.productSel.appendChild(el('option', { value: String(i) }, [p.name]));
    });
    sidebar.appendChild(field('Product', refs.productSel));

    // Grid price
    refs.gridInput = el('input', { className: 'sc-input', type: 'number', step: 'any', value: String(DEFAULT_GRID_PRICE), onInput: onGridPrice });
    var gridGroup = el('div', { className: 'sc-input-group' }, [refs.gridInput, el('span', { className: 'sc-input-unit' }, ['VND/kWh'])]);
    sidebar.appendChild(field('Grid Electricity Price', gridGroup));

    // Self-use slider
    refs.selfSlider = el('input', { className: 'sc-slider', type: 'range', min: '0', max: '100', value: '80', onInput: onSelfUse });
    refs.selfVal = el('span', { className: 'sc-slider-val' }, ['80%']);
    sidebar.appendChild(field('Self-use Rate', el('div', { className: 'sc-slider-wrap' }, [refs.selfSlider, refs.selfVal])));

    // FIT price
    refs.fitInput = el('input', { className: 'sc-input', type: 'number', step: 'any', value: String(DEFAULT_FIT_PRICE), onInput: onFitPrice });
    var fitGroup = el('div', { className: 'sc-input-group' }, [refs.fitInput, el('span', { className: 'sc-input-unit' }, ['VND/kWh'])]);
    sidebar.appendChild(field('Feed-in Tariff', fitGroup));

    return sidebar;
  }

  function field(label, control) {
    var wrap = el('div', { className: 'sc-field' });
    wrap.appendChild(el('label', { className: 'sc-label' }, [label]));
    wrap.appendChild(control);
    return wrap;
  }

  /* ========== Build Main (with lead overlay) ========== */
  function buildMain() {
    var main = el('div', { className: 'sc-main' });
    main.appendChild(el('div', { className: 'sc-main-title' }, ['Investment Analysis']));
    refs.mainSub = el('div', { className: 'sc-main-sub' });
    main.appendChild(refs.mainSub);

    // Results container (blurred initially)
    refs.resultsWrap = el('div', { className: 'sc-results-wrap sc-locked' });

    // KPI grid
    refs.kpiGrid = el('div', { className: 'sc-kpi-grid' });
    var kpis = [
      { id: 'annualRev', label: 'Annual Revenue',  hl: false },
      { id: 'payback',   label: 'Payback Period',  hl: false },
      { id: 'total30',   label: '30-Year Return',  hl: true },
      { id: 'roi30',     label: 'ROI Multiple',    hl: true },
      { id: 'lcoe',      label: 'LCOE',            hl: false }
    ];
    refs.kpis = {};
    kpis.forEach(function (k) {
      var card = el('div', { className: 'sc-kpi' + (k.hl ? ' highlight' : '') });
      card.appendChild(el('div', { className: 'sc-kpi-label' }, [k.label]));
      var valEl = el('div', { className: 'sc-kpi-val' }, ['\u2014']);
      card.appendChild(valEl);
      refs.kpis[k.id] = valEl;
      refs.kpiGrid.appendChild(card);
    });
    refs.resultsWrap.appendChild(refs.kpiGrid);

    // Bar chart
    var chart = el('div', { className: 'sc-chart' });
    chart.appendChild(el('div', { className: 'sc-chart-title' }, ['Cumulative Return Timeline']));
    refs.chartBars = el('div', { className: 'sc-chart-bars' });
    chart.appendChild(refs.chartBars);
    refs.resultsWrap.appendChild(chart);

    refs.resultsWrap.appendChild(el('div', { className: 'sc-note' }, ['* Simplified model \u2014 does not account for panel degradation, inflation, or maintenance costs.']));

    main.appendChild(refs.resultsWrap);

    // Lead overlay
    refs.overlay = buildOverlay();
    main.appendChild(refs.overlay);

    return main;
  }

  /* ========== Lead Overlay ========== */
  function buildOverlay() {
    var overlay = el('div', { className: 'sc-overlay' });
    var card = el('div', { className: 'sc-lead-card' });

    card.appendChild(el('div', { className: 'sc-lead-icon', innerHTML: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#006BC0" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/></svg>' }));
    card.appendChild(el('h3', { className: 'sc-lead-title' }, ['Get Your Detailed ROI Report']));
    card.appendChild(el('p', { className: 'sc-lead-sub' }, ['Fill in your details to unlock the full analysis.']));

    var form = el('form', { className: 'sc-lead-form', onSubmit: onLeadSubmit });

    form.appendChild(leadInput('text', 'Full Name', 'sc-lead-name', true));
    form.appendChild(leadInput('email', 'Email', 'sc-lead-email', true));

    // Verification code row
    var codeRow = el('div', { className: 'sc-lead-code-row' });
    codeRow.appendChild(leadInput('text', 'Verification Code', 'sc-lead-code', true));
    refs.codeBtn = el('button', { type: 'button', className: 'sc-lead-code-btn', onClick: onSendCode }, ['Send Code']);
    codeRow.appendChild(refs.codeBtn);
    form.appendChild(codeRow);

    refs.leadMsg = el('div', { className: 'sc-lead-msg' });
    form.appendChild(refs.leadMsg);

    form.appendChild(el('button', { type: 'submit', className: 'sc-lead-submit' }, ['Calculate Now \u2192']));
    card.appendChild(form);
    overlay.appendChild(card);
    return overlay;
  }

  function leadInput(type, placeholder, id, required) {
    var attrs = { className: 'sc-lead-input', type: type, placeholder: placeholder, id: id };
    if (required) attrs.required = 'required';
    return el('input', attrs);
  }

  function onSendCode() {
    var emailEl = document.getElementById('sc-lead-email');
    if (!emailEl || !emailEl.value || !emailEl.validity.valid) {
      refs.leadMsg.textContent = 'Please enter a valid email first.';
      refs.leadMsg.className = 'sc-lead-msg error';
      return;
    }
    refs.codeBtn.disabled = true;
    refs.codeBtn.textContent = 'Sent!';
    refs.leadMsg.textContent = 'A simulated code has been sent. Enter any 4+ digits.';
    refs.leadMsg.className = 'sc-lead-msg info';
    setTimeout(function () {
      refs.codeBtn.disabled = false;
      refs.codeBtn.textContent = 'Resend';
    }, 15000);
  }

  function onLeadSubmit(e) {
    e.preventDefault();
    var name = document.getElementById('sc-lead-name').value.trim();
    var email = document.getElementById('sc-lead-email').value.trim();
    var code = document.getElementById('sc-lead-code').value.trim();
    if (!name || !email || code.length < 4) {
      refs.leadMsg.textContent = 'Please fill in all fields (code must be 4+ characters).';
      refs.leadMsg.className = 'sc-lead-msg error';
      return;
    }
    // Unlock
    state.unlocked = true;
    refs.overlay.classList.add('sc-hidden');
    refs.resultsWrap.classList.remove('sc-locked');
    refs.resultsWrap.classList.add('sc-fadein');
    render();
  }

  /* ========== Render Results ========== */
  function render() {
    var r = calc();
    var city = getCity();

    refs.mainSub.textContent = getProduct().name + ' \u00b7 ' + state.city + ' (' + city.peakHours + 'h peak sun)';

    refs.kpis.annualRev.innerHTML = fmtVND(r.annualRev) + '<span class="sc-kpi-unit"> ' + CURRENCY + '</span>';
    refs.kpis.payback.innerHTML = (r.payback === Infinity ? '\u2014' : r.payback.toFixed(1)) + '<span class="sc-kpi-unit"> years</span>';
    refs.kpis.total30.innerHTML = fmtVND(r.total30) + '<span class="sc-kpi-unit"> ' + CURRENCY + '</span>';
    refs.kpis.roi30.innerHTML = r.roi30.toFixed(1) + '<span class="sc-kpi-unit">x</span>';
    refs.kpis.lcoe.innerHTML = r.lcoe.toFixed(0) + '<span class="sc-kpi-unit"> ' + CURRENCY + '/kWh</span>';

    // Bar chart
    refs.chartBars.innerHTML = '';
    var years = [5, 10, 15, 20, 25, 30];
    var max30 = r.annualRev * 30;
    var paybackYear = r.payback === Infinity ? -1 : Math.ceil(r.payback);

    years.forEach(function (y) {
      var cumul = r.annualRev * y;
      var pct = max30 > 0 ? Math.min(100, (cumul / max30) * 100) : 0;

      // Determine if this bar bracket contains the payback year
      var prevY = y - 5;
      var isPB = paybackYear > 0 && paybackYear > prevY && paybackYear <= y;
      var isFull = y === 30;

      var fillCls = 'sc-bar-fill' + (isPB ? ' payback' : '') + (isFull && !isPB ? ' full' : '');
      var fill = el('div', { className: fillCls, style: 'width:' + pct + '%' });
      var track = el('div', { className: 'sc-bar-track' }, [fill]);

      var valText = fmtVND(cumul) + ' ' + CURRENCY;
      if (isPB) valText += ' \u2190 payback';

      refs.chartBars.appendChild(el('div', { className: 'sc-bar-row' }, [
        el('span', { className: 'sc-bar-label' }, ['Year ' + y]),
        track,
        el('span', { className: 'sc-bar-val' + (isPB ? ' sc-bar-val-pb' : '') }, [valText])
      ]));
    });
  }

  /* ========== Event Handlers ========== */
  function onCityChange() {
    state.city = refs.citySel.value;
    if (state.unlocked) render();
  }
  function onProductChange() {
    state.productIdx = parseInt(refs.productSel.value, 10);
    if (state.unlocked) render();
  }
  function onGridPrice() {
    state.gridPrice = parseFloat(refs.gridInput.value) || 0;
    if (state.unlocked) render();
  }
  function onSelfUse() {
    state.selfUse = parseInt(refs.selfSlider.value, 10);
    refs.selfVal.textContent = state.selfUse + '%';
    if (state.unlocked) render();
  }
  function onFitPrice() {
    state.fitPrice = parseFloat(refs.fitInput.value) || 0;
    if (state.unlocked) render();
  }

  /* ========== Init ========== */
  function init() {
    var root = document.getElementById('solar-calculator-app');
    if (!root) return;
    root.className = (root.className ? root.className + ' ' : '') + 'sc-root';
    root.appendChild(buildSidebar());
    root.appendChild(buildMain());
    // Pre-render placeholder values behind the blur
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
