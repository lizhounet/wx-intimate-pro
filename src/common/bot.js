const { delay } = require('../common/index')

/**
 * 获取所有联系人
 * @param {*} that 
 */
async function getContacts(that) {
    const contactSelf = that.currentUser
    const hasWeixin = !!contactSelf.handle()
    //获取联系人
    const contactList = await that.Contact.findAll()
    let contacts = contactList.filter((item) => {
        const payload = item.payload || item._payload
        return payload.type === 1 && payload.friend
    }).map(i => {
        let contact = i.payload || i._payload
        return {
            wxId: contact.id,
            wxCode: hasWeixin ? contact.weixin : '',
            name: contact.name,
            alias: contact.alias,
            avatarUrl: hasWeixin ? contact.avatar : '',
            gender: contact.gender
        }
    })
    await delay(5000);
    //获取群
    const roomList = await that.Room.findAll()
    const rooms = roomList.map(i => {
        let room = i.payload || i._payload
        return {
            wxId: room.id,
            wxCode: room.id,
            name: room.topic,
            alias: room.topic,
            avatarUrl: room.avatar,
            gender: 0
        }
    })
    return contacts.concat(rooms)
}
/**
 * 获取机器人用户信息
 * @param {*} that 
 * @returns 当前机器人用户信息
 */
async function getcurrentUser(that) {
    const contactSelf = that.currentUser
    const payload = contactSelf.payload || contactSelf._payload
    const file = await contactSelf.avatar()
    const base64 = await file.toBase64()
    return {
        ...payload,
        robotId: contactSelf.handle() || contactSelf.name(),
        avatarBase64: base64,
    }
}


module.exports = {
    getContacts,
    getcurrentUser,
}