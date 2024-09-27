var QRCode = require('qrcode')

QRCode.toString('https://www.so.com', { type: 'terminal' }, function (err, url) {
  console.log(url)
}