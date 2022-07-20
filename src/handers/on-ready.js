const { updateContacts } = require('../service/intimateService');
async function onReady() {
  try {
    //上传联系人
    await updateContacts(this);
  } catch (e) {
    console.log('on ready error:', e)
  }
}

module.exports = onReady