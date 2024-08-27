export interface RGBValues {
  r: string;
  g: string;
  b: string;
}

export interface HSLValues {
  h: string;
  s: string;
  l: string;
}

export interface CMYKValues {
  c: string;
  m: string;
  y: string;
  k: string;
}

export interface HSVValues {
  h: string;
  s: string;
  v: string;
}

export type ColorValue = RGBValues | HSLValues | CMYKValues | HSVValues | string;

export const isValidHex = (hex: string) => {
  const pattern = /^#?[a-fA-F0-9]{6}$/;

  return pattern.test(hex);
};

export const isRGBValueValid = (value: number) => {
  return !isNaN(value) && value >= 0 && value <= 255;
};

export const convertToRGB = (hex: string): RGBValues => {
  const normalizedHex = hex.startsWith("#") ? hex.slice(1) : hex;

  const r = parseInt(normalizedHex.substring(0, 2), 16).toString();
  const g = parseInt(normalizedHex.substring(2, 4), 16).toString();
  const b = parseInt(normalizedHex.substring(4, 6), 16).toString();

  return { r, g, b };
};

export const convertToHex = (r: string, g: string, b: string) => {
  return `#${[r, g, b]
    .map((value) => {
      const intValue = parseInt(value);
      if (isNaN(intValue)) {
        return "00";
      }

      return intValue.toString(16).padStart(2, "0");
    })
    .join("")}`;
};

export const toCss = (rgb: RGBValues) => {
  if (!rgb || typeof rgb.r === 'undefined' || typeof rgb.g === 'undefined' || typeof rgb.b === 'undefined') {
    return 'rgba(0, 0, 0, 1)';
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
};

const valueToFixed = (value: string) => (parseInt(value) / 255).toFixed(2);

export const toIOS = (rgb: RGBValues, lang: "swift" | "c"): string => {
  if (!rgb || typeof rgb.r === 'undefined' || typeof rgb.g === 'undefined' || typeof rgb.b === 'undefined') {
    return lang === "swift" ? 'UIColor(red: 0, green: 0, blue: 0, alpha: 1.00)' : '[UIColor colorWithRed: 0 green: 0 blue: 0 alpha: 1.0]';
  }
  const red = valueToFixed(rgb.r);
  const green = valueToFixed(rgb.g);
  const blue = valueToFixed(rgb.b);

  if (lang === "swift") {
    return `UIColor(red: ${red}, green: ${green}, blue: ${blue}, alpha: 1.00)`;
  }

  return `[UIColor colorWithRed: ${red} green: ${green} blue: ${blue} alpha: 1.0]`;
};

export const toAndroidColor = (rgb: RGBValues) => {
  if (!rgb || typeof rgb.r === 'undefined' || typeof rgb.g === 'undefined' || typeof rgb.b === 'undefined') {
    return 'Color.rgb(0, 0, 0)';
  }
  return `Color.rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const convertToHSL = (rgb: RGBValues): HSLValues => {
  const r = parseInt(rgb.r) / 255;
  const g = parseInt(rgb.g) / 255;
  const b = parseInt(rgb.b) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360).toString(),
    s: Math.round(s * 100).toString(),
    l: Math.round(l * 100).toString()
  };
};

export const convertToCMYK = (rgb: RGBValues): CMYKValues => {
  const r = parseInt(rgb.r) / 255;
  const g = parseInt(rgb.g) / 255;
  const b = parseInt(rgb.b) / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return {
    c: Math.round(c * 100).toString(),
    m: Math.round(m * 100).toString(),
    y: Math.round(y * 100).toString(),
    k: Math.round(k * 100).toString()
  };
};

export const convertCMYKtoRGB = (cmyk: CMYKValues): RGBValues => {
  const c = parseInt(cmyk.c) / 100;
  const m = parseInt(cmyk.m) / 100;
  const y = parseInt(cmyk.y) / 100;
  const k = parseInt(cmyk.k) / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {
    r: r.toString(),
    g: g.toString(),
    b: b.toString()
  };
};

export const convertToHSV = (rgb: RGBValues): HSVValues => {
  const r = parseInt(rgb.r) / 255;
  const g = parseInt(rgb.g) / 255;
  const b = parseInt(rgb.b) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360).toString(),
    s: Math.round(s * 100).toString(),
    v: Math.round(v * 100).toString()
  };
};

export const convertHSVtoRGB = (hsv: HSVValues): RGBValues => {
  const h = parseInt(hsv.h) / 360;
  const s = parseInt(hsv.s) / 100;
  const v = parseInt(hsv.v) / 100;

  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  if (typeof r === 'undefined' || typeof g === 'undefined' || typeof b === 'undefined') {
    return { r: "0", g: "0", b: "0" };
  }

  return {
    r: Math.round(r * 255).toString(),
    g: Math.round(g * 255).toString(),
    b: Math.round(b * 255).toString()
  };
};