function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
// 实现水印
async function watermark(imgBase64, watermarkData) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const blob = dataURItoBlob(imgBase64);
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { text, font, color, alpha } = watermarkData;

    createImageBitmap(blob).then((bitmap) => {
      const width = bitmap.width;
      const height = bitmap.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(bitmap, 0, 0, width, height);

      const lineHeight = 20 * devicePixelRatio;
      const marginLeft = 30 * devicePixelRatio;
      const marginTop = 30 * devicePixelRatio;

      const yOffset = 20 * devicePixelRatio;
      const xOffset = Math.ceil(width / 2);

      const lineTexts = text.split("\n");
      const numLines = Math.ceil(height / lineHeight);
      const lineWidth = Math.max(
        ...lineTexts.map((txt) => ctx.measureText(txt).width)
      );
      const numCols = Math.ceil(width / (lineWidth + marginLeft));

      ctx.font = font;
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.rotate((-45 * Math.PI) / 180);

      for (let i = 0; i < numLines; i++) {
        for (let j = 0; j < numCols; j++) {
          lineTexts.forEach(function (line, index) {
            const x = j * (lineWidth + 2 * marginLeft) - xOffset;
            const y =
              (i * lineTexts.length + index + 1) * lineHeight +
              marginTop +
              i * yOffset;
            ctx.fillText(line, x, y);
          });
        }
      }
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    });
  });
}
