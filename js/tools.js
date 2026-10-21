/* ============================================================
   Chemia fizyczna — współczynnik podziału
   Narzędzia obliczeniowe, formatowanie i rysowanie wykresów
   ============================================================ */
(function (global) {
  "use strict";

  const CF = {};
  const SUP = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "-": "⁻", "+": "⁺"
  };

  /* ---------- formatowanie ---------- */

  CF.sup = function (value) {
    return String(value).split("").map(function (ch) {
      return SUP[ch] || ch;
    }).join("");
  };

  CF.clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  CF.pl = function (text) {
    return String(text).replace(".", ",");
  };

  CF.fixed = function (value, decimals) {
    if (!Number.isFinite(value)) return "—";
    return CF.pl(value.toFixed(decimals));
  };

  CF.sig = function (value, digits) {
    digits = digits || 3;
    if (!Number.isFinite(value)) return "—";
    if (value === 0) return "0";
    const abs = Math.abs(value);
    if (abs >= 1e-3 && abs < 1e6) {
      let text = value.toPrecision(digits);
      if (text.indexOf("e") !== -1) {
        return CF.sci(value, Math.max(0, digits - 1));
      }
      return CF.pl(text);
    }
    return CF.sci(value, Math.max(0, digits - 1));
  };

  CF.sci = function (value, digits) {
    digits = digits == null ? 2 : digits;
    if (!Number.isFinite(value)) return "—";
    if (value === 0) return "0";
    let exponent = Math.floor(Math.log10(Math.abs(value)));
    let mantissa = value / Math.pow(10, exponent);
    let text = mantissa.toFixed(digits);
    if (Math.abs(parseFloat(text)) >= 10) {
      mantissa /= 10;
      exponent += 1;
      text = mantissa.toFixed(digits);
    }
    return CF.pl(text) + " × 10" + CF.sup(exponent);
  };

  CF.pct = function (value, digits) {
    if (!Number.isFinite(value)) return "—";
    return CF.fixed(value * 100, digits == null ? 1 : digits) + " %";
  };

  CF.mean = function (values) {
    if (!values.length) return NaN;
    return values.reduce(function (sum, v) { return sum + v; }, 0) / values.length;
  };

  CF.sd = function (values) {
    const n = values.length;
    if (n < 2) return NaN;
    const mean = CF.mean(values);
    const squares = values.reduce(function (sum, v) {
      return sum + Math.pow(v - mean, 2);
    }, 0);
    return Math.sqrt(squares / (n - 1));
  };

  CF.median = function (values) {
    if (!values.length) return NaN;
    const sorted = values.slice().sort(function (a, b) { return a - b; });
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };

  CF.range = function (values) {
    if (!values.length) return NaN;
    return Math.max.apply(null, values) - Math.min.apply(null, values);
  };

  /* ---------- parsowanie liczb z tekstu ---------- */

  CF.parseNumbers = function (text) {
    if (!text) return [];
    let cleaned = String(text)
      .replace(/\r/g, "\n")
      .replace(/;/g, "\n")
      .replace(/\t/g, " ");

    let tokens;
    if (cleaned.indexOf("\n") !== -1) {
      tokens = cleaned.split("\n");
    } else {
      tokens = cleaned.split(/[\s]+/);
    }

    const values = [];
    tokens.forEach(function (token) {
      token = token.trim().replace(/^[,]+|[,]+$/g, "");
      if (!token) return;
      if (token.indexOf(",") !== -1 && token.indexOf(".") === -1) {
        token = token.replace(",", ".");
      } else {
        token = token.replace(/,/g, "");
      }
      const value = Number(token);
      if (Number.isFinite(value)) values.push(value);
    });
    return values;
  };

  /* ---------- rozkład Studenta (95%) ---------- */

  CF.t95 = {
    1: 12.7062, 2: 4.3027, 3: 3.1824, 4: 2.7764, 5: 2.5706,
    6: 2.4469, 7: 2.3646, 8: 2.3060, 9: 2.2622, 10: 2.2281,
    11: 2.2010, 12: 2.1788, 13: 2.1604, 14: 2.1448, 15: 2.1314,
    16: 2.1199, 17: 2.1098, 18: 2.1009, 19: 2.0930, 20: 2.0860,
    21: 2.0796, 22: 2.0739, 23: 2.0687, 24: 2.0639, 25: 2.0595,
    26: 2.0555, 27: 2.0518, 28: 2.0484, 29: 2.0452, 30: 2.0423,
    40: 2.0211, 60: 2.0003, 120: 1.9799, 1000: 1.9623
  };

  CF.tValue = function (df) {
    if (df <= 0) return NaN;
    if (CF.t95[df] != null) return CF.t95[df];
    if (df <= 30) {
      const keys = Object.keys(CF.t95).map(Number).sort(function (a, b) { return a - b; });
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i] >= df) return CF.t95[keys[i]];
      }
    }
    return 1.96;
  };

  CF.formatUncertainty = function (value, uncertainty, unit) {
    unit = unit || "";
    if (!Number.isFinite(value) || !Number.isFinite(uncertainty) || uncertainty <= 0) {
      return (Number.isFinite(value) ? CF.sig(value, 4) : "—") + (unit ? " " + unit : "");
    }
    const exponent = Math.floor(Math.log10(uncertainty));
    const decimals = Math.max(0, 1 - exponent);
    const roundedU = Number(uncertainty.toFixed(decimals));
    const roundedValue = Number(value.toFixed(decimals));
    return CF.fixed(roundedValue, decimals) + " ± " + CF.fixed(roundedU, decimals) +
      (unit ? " " + unit : "");
  };

  /* ---------- obliczenia ćwiczenia ---------- */

  CF.alphaExact = function (concentration, Ka) {
    if (!Number.isFinite(concentration) || concentration <= 0 || !Number.isFinite(Ka) || Ka <= 0) {
      return NaN;
    }
    return CF.clamp((-Ka + Math.sqrt(Ka * Ka + 4 * Ka * concentration)) / (2 * concentration), 0, 1);
  };

  CF.alphaApprox = function (concentration, Ka) {
    if (!Number.isFinite(concentration) || concentration <= 0 || !Number.isFinite(Ka) || Ka <= 0) {
      return NaN;
    }
    return Math.sqrt(Ka / concentration);
  };

  CF.calcSample = function (options) {
    const mass = options.mass;
    const vNaOH = options.vNaOH;
    const cNaOH = options.cNaOH;
    const vAliquot = options.vAliquot;
    const vWater = options.vWater;
    const vToluene = options.vToluene;
    const molarMass = options.molarMass;
    const Ka = options.Ka;

    const nNaOH = cNaOH * vNaOH;                  // mmol
    const nAcidAliquot = nNaOH;                   // mmol, reakcja 1:1
    const cw = nAcidAliquot / vAliquot;           // mol/dm³ (mmol/mL)
    const mw = cw * (vWater / 1000) * molarMass;  // g
    const mt = mass - mw;                         // g
    const ct = mt / ((vToluene / 1000) * molarMass); // mol/dm³
    const alpha = CF.alphaExact(cw, Ka);
    const alphaApprox = CF.alphaApprox(cw, Ka);
    const proton = cw * alpha;
    const pH = proton > 0 ? -Math.log10(proton) : NaN;
    const Ksimple = ct / cw;
    const Kdiss = ct / (cw * (1 - alpha));
    const Kassoc = Math.sqrt(Math.max(ct, 0)) / cw;
    const Kscript = Math.sqrt(Math.max(ct, 0)) / (cw * (1 - alpha));

    return {
      mass: mass,
      vNaOH: vNaOH,
      nNaOH: nNaOH,
      nAcidAliquot: nAcidAliquot,
      cw: cw,
      mw: mw,
      mt: mt,
      ct: ct,
      alpha: alpha,
      alphaApprox: alphaApprox,
      proton: proton,
      pH: pH,
      Ksimple: Ksimple,
      Kdiss: Kdiss,
      Kassoc: Kassoc,
      Kscript: Kscript,
      valid: mass > 0 && vNaOH > 0 && cw > 0 && ct >= 0 && mt >= 0
    };
  };

  /* ---------- ekstrakcja ---------- */

  CF.extraction = function (mass, K, vAq, vOrgTotal, portions) {
    const n = Math.max(1, Math.round(portions));
    const vPortion = vOrgTotal / n;
    const q = vAq / (vAq + K * vPortion);
    const remaining = mass * Math.pow(q, n);
    const stages = [];
    let left = mass;
    for (let i = 1; i <= n; i += 1) {
      left = left * q;
      stages.push({ step: i, remaining: left, extracted: mass - left });
    }
    return {
      portions: n,
      vPortion: vPortion,
      q: q,
      remaining: remaining,
      efficiency: 1 - Math.pow(q, n),
      stages: stages,
      singlePortionEfficiency: 1 - (vAq / (vAq + K * vOrgTotal))
    };
  };

  /* ---------- regresja liniowa ---------- */

  CF.regression = function (points) {
    const data = points.filter(function (p) {
      return Number.isFinite(p.x) && Number.isFinite(p.y);
    });
    const n = data.length;
    if (n < 2) return { n: n, valid: false };
    const xbar = CF.mean(data.map(function (p) { return p.x; }));
    const ybar = CF.mean(data.map(function (p) { return p.y; }));
    let Sxx = 0;
    let Syy = 0;
    let Sxy = 0;
    data.forEach(function (p) {
      Sxx += Math.pow(p.x - xbar, 2);
      Syy += Math.pow(p.y - ybar, 2);
      Sxy += (p.x - xbar) * (p.y - ybar);
    });
    if (Sxx === 0) return { n: n, valid: false };
    const slope = Sxy / Sxx;
    const intercept = ybar - slope * xbar;
    let sse = 0;
    data.forEach(function (p) {
      const fitted = slope * p.x + intercept;
      sse += Math.pow(p.y - fitted, 2);
    });
    const r2 = Syy === 0 ? 1 : 1 - sse / Syy;
    const dof = n - 2;
    const variance = dof > 0 ? sse / dof : NaN;
    const seSlope = dof > 0 ? Math.sqrt(variance / Sxx) : NaN;
    const seIntercept = dof > 0
      ? Math.sqrt(variance * (1 / n + (xbar * xbar) / Sxx))
      : NaN;
    return {
      n: n,
      valid: true,
      slope: slope,
      intercept: intercept,
      r2: r2,
      sse: sse,
      dof: dof,
      seSlope: seSlope,
      seIntercept: seIntercept,
      xbar: xbar,
      ybar: ybar
    };
  };

  /* ---------- wykres punktowy z prostą ---------- */

  CF.charts = [];
  CF.registerChart = function (draw) {
    CF.charts.push(draw);
    draw();
  };
  CF.redrawCharts = function () {
    CF.charts.forEach(function (draw) {
      try { draw(); } catch (error) { /* wykres może już nie istnieć */ }
    });
  };

  function themeColors() {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    return dark ? {
      text: "#d2cec7",
      muted: "#a3a09a",
      grid: "rgba(242, 240, 236, 0.12)",
      axis: "rgba(242, 240, 236, 0.30)",
      point: "#e05a4a",
      pointFill: "#2a1b19",
      line: "#f2f0ec",
      background: "rgba(23, 23, 23, 0.35)"
    } : {
      text: "#333333",
      muted: "#666666",
      grid: "rgba(17, 17, 17, 0.08)",
      axis: "rgba(17, 17, 17, 0.28)",
      point: "#c53b2e",
      pointFill: "#f4e6e3",
      line: "#111111",
      background: "rgba(255, 255, 255, 0.55)"
    };
  }

  function niceStep(span, targetTicks) {
    if (!Number.isFinite(span) || span <= 0) return 1;
    const raw = span / targetTicks;
    const power = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / power;
    let step;
    if (normalized <= 1) step = 1;
    else if (normalized <= 2) step = 2;
    else if (normalized <= 2.5) step = 2.5;
    else if (normalized <= 5) step = 5;
    else step = 10;
    return step * power;
  }

  function axisTicks(min, max, target) {
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const step = niceStep(max - min, target);
    const start = Math.ceil(min / step) * step;
    const ticks = [];
    for (let value = start; value <= max + step * 0.001; value += step) {
      ticks.push(Number(value.toPrecision(12)));
    }
    return { ticks: ticks, step: step };
  }

  function tickLabel(value, step) {
    const abs = Math.abs(value);
    if (abs !== 0 && (abs < 1e-3 || abs >= 1e5)) {
      return CF.sci(value, 1);
    }
    let decimals = 0;
    if (step < 1) decimals = Math.min(4, Math.ceil(-Math.log10(step)));
    return CF.fixed(value, decimals);
  }

  CF.drawScatter = function (canvas, points, regression, options) {
    if (!canvas) return;
    options = options || {};
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(280, rect.width || canvas.parentElement.clientWidth || 600);
    const height = options.height || 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.height = height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const colors = themeColors();
    const data = points.filter(function (p) {
      return Number.isFinite(p.x) && Number.isFinite(p.y);
    });
    if (!data.length) {
      ctx.fillStyle = colors.muted;
      ctx.font = "14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Dodaj co najmniej dwa punkty, aby zobaczyć wykres.", width / 2, height / 2);
      return;
    }

    const pad = { top: 24, right: 22, bottom: 54, left: 72 };
    let xMin = Math.min.apply(null, data.map(function (p) { return p.x; }));
    let xMax = Math.max.apply(null, data.map(function (p) { return p.x; }));
    let yMin = Math.min.apply(null, data.map(function (p) { return p.y; }));
    let yMax = Math.max.apply(null, data.map(function (p) { return p.y; }));

    if (regression && regression.valid) {
      if (options.includeZeroX) xMin = Math.min(0, xMin);
      if (options.includeZeroY) yMin = Math.min(0, yMin);
      if (regression.slope !== 0) {
        xMin = Math.min(xMin, (yMin - regression.intercept) / regression.slope);
        xMax = Math.max(xMax, (yMax - regression.intercept) / regression.slope);
      }
    }

    if (xMin === xMax) { xMin -= 1; xMax += 1; }
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    const xPad = (xMax - xMin) * 0.08;
    const yPad = (yMax - yMin) * 0.10;
    xMin -= xPad; xMax += xPad; yMin -= yPad; yMax += yPad;

    if (!Number.isFinite(xMin) || !Number.isFinite(xMax) || !Number.isFinite(yMin) || !Number.isFinite(yMax)) return;

    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;
    const xScale = function (x) { return pad.left + (x - xMin) / (xMax - xMin) * plotW; };
    const yScale = function (y) { return pad.top + plotH - (y - yMin) / (yMax - yMin) * plotH; };

    const xTicks = axisTicks(xMin, xMax, 6);
    const yTicks = axisTicks(yMin, yMax, 5);

    ctx.fillStyle = colors.background;
    ctx.fillRect(pad.left, pad.top, plotW, plotH);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = colors.muted;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    xTicks.ticks.forEach(function (tick) {
      const x = xScale(tick);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + plotH);
      ctx.stroke();
      ctx.fillText(tickLabel(tick, xTicks.step), x, pad.top + plotH + 10);
    });

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    yTicks.ticks.forEach(function (tick) {
      const y = yScale(tick);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
      ctx.fillText(tickLabel(tick, yTicks.step), pad.left - 10, y);
    });

    ctx.strokeStyle = colors.axis;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    if (regression && regression.valid) {
      const x1 = xMin;
      const x2 = xMax;
      const y1 = regression.slope * x1 + regression.intercept;
      const y2 = regression.slope * x2 + regression.intercept;
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(xScale(x1), yScale(y1));
      ctx.lineTo(xScale(x2), yScale(y2));
      ctx.stroke();
    }

    data.forEach(function (point, index) {
      const x = xScale(point.x);
      const y = yScale(point.y);
      ctx.beginPath();
      ctx.arc(x, y, 5.2, 0, Math.PI * 2);
      ctx.fillStyle = colors.pointFill;
      ctx.fill();
      ctx.strokeStyle = colors.point;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (options.labelPoints) {
        ctx.fillStyle = colors.text;
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillText(String(index + 1), x + 7, y - 5);
      }
    });

    ctx.fillStyle = colors.text;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(options.xlabel || "x", pad.left + plotW / 2, height - 24);
    ctx.save();
    ctx.translate(17, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textBaseline = "middle";
    ctx.fillText(options.ylabel || "y", 0, 0);
    ctx.restore();
  };

  /* ---------- przechowywanie ---------- */

  const STORAGE_KEY = "chemia-fizyczna-przewodnik-v1";
  CF.loadState = function () {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  };
  CF.saveState = function (state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      return false;
    }
  };
  CF.clearState = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* brak dostępu */ }
  };

  /* ---------- drobne pomocniki UI ---------- */

  CF.escape = function (text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  CF.frac = function (numerator, denominator, extraClass) {
    return '<span class="frac ' + (extraClass || "") + '"><span class="frac-num">' +
      numerator + '</span><span class="frac-den">' + denominator + "</span></span>";
  };

  CF.sqrt = function (inner) {
    return '<span class="sqrt"><span class="sqrt-body">' + inner + "</span></span>";
  };

  CF.eq = function (inner, label) {
    return '<div class="equation">' + inner +
      (label ? '<span class="eq-label">' + label + "</span>" : "") + "</div>";
  };

  CF.download = function (filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      link.remove();
    }, 200);
  };

  global.CF = CF;
})(window);
