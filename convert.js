const converter = {
  cmyk: (cmyk) => {
    // Ensure the input array has exactly 4 values
    if (cmyk.length !== 4) {
        throw new Error("Invalid CMYK array. It should contain 4 values [c, m, y, k].");
    }
  
    // Convert CMYK to RGB
    const [c, m, y, k] = cmyk;
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
  
    // Convert RGB to Hex
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  
    return `#${hex.toUpperCase()}`;
  },
  hsb: (hsb) => {
    const [h, s, b] = hsb;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = b * (1 - s);
    var q = b * (1 - f * s);
    var t = b * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = b, g = t, b = p; break;
        case 1: r = q, g = b, b = p; break;
        case 2: r = p, g = b, b = t; break;
        case 3: r = p, g = q, b = b; break;
        case 4: r = t, g = p, b = b; break;
        case 5: r = b, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

module.exports = converter;