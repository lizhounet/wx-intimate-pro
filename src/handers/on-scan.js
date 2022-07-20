
const qrTerm = require('qrcode-terminal');

function onScan(qrcode, status) {
    console.log('请扫描二维码登录')
    qrTerm.generate(qrcode, { small: true });  // show qrcode on console
    const qrImgUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log(qrImgUrl)

}

module.exports = onScan