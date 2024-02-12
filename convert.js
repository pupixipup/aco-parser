const converter = {
  rgb: (rgb) => {
    if (rgb.length !== 3) {
      throw new Error("Invalid RGBA array. It should contain 3 values [r, g, b ].");
  }
  const [r, g, b] = rgb;
  return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
  },
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
    if (hsb.length !== 3) {
      throw new Error("Invalid HSB array. It should contain 3 values.");
  }
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
  },
  greyscale: (greyscaleValue) => {
    if (greyscaleValue === undefined || greyscaleValue === null) {
      throw new Error("Invalid greyscale.");
  }
    let str = "rgb(";
    const colors = [];
    greyscaleValue = Math.max(0, Math.min(10000, greyscaleValue));
    const intensity = Math.round(greyscaleValue * 255 / 10000);
    for (let i = 0; i < 3; i+= 1) {
      // str += intensity;
      colors.push(intensity);
    } 
    return str + colors.join(",") + ")"
  }
}

module.exports = converter;