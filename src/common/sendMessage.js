const template = require('art-template');
const { FileBox } = require('file-box')
/**
 * 发送消息
 * @param {*} that 
 * @param {*} contact 发消息的人
 * @param {*} room room对象(私聊为空)
 * @param {*} messageData 消息data
 */
async function sendMessage(that, contact, room, messageData) {
    try {
        const arrayContent = await analyzeResult(messageData);
        arrayContent.forEach(async (value, index, array) => {
            let r = value;
            if (!r) return;
            if (messageData.messageType == 2) {
                //发送内容为图片
                r = await toFileBox(r);
            }
            if (room) {
                if (contact) {
                    await room.say(r, contact);
                }
                else {
                    await room.say(r);
                }
            }
            else {
                await contact.say(r);
            }
        });
    } catch (e) {
        console.error("发送消息异常:")
        console.error(e);
        return messageData.result;
    }
}
async function analyzeResult(messageData) {
    if (messageData.isAnalyze) {
        try {
            //解析
            const result = template.render(messageData.analyzeExpression, { R: JSON.parse(messageData.result) });
            console.log('result', result);
            return stringToJson(result);
        }
        catch (e) {
            return ['语法解析失败,请检查语法是否错误:' + messageData.result];
        }
    }
    return [messageData.result];
}

async function stringToJson(result) {
    try {
        return JSON.parse(result);
    }
    catch (e) {
        console.log('转换JSON出错', e)
        return [result];
    }
}
async function toFileBox(fileUrl) {
    try {
        return FileBox.fromUrl(fileUrl);
    }
    catch (e) {
        console.log('转换FileBox出错', e)
        return fileUrl;
    }
}
module.exports = {
    sendMessage
}