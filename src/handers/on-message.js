const { loadBotConfigAll, startTask, getKeywordReply, getBotReply, updateContacts } = require('../service/intimateService');
const { getBotConfig } = require('../common/botConfigDb')
const { sendMessage } = require('../common/sendMessage')
const { FileBox } = require('file-box')
/**
 * 根据消息类型过滤私聊消息事件
 * @param {*} that bot实例
 * @param {*} msg 消息主体
 */
async function dispatchFriendFilterByMsgType(that, msg) {
    const type = msg.type()
    const contact = msg.talker() // 发消息人
    const isOfficial = contact.type() === that.Contact.Type.Official
    let content = ''
    switch (type) {
        case that.Message.Type.Text:
            content = msg.text()
            if (!isOfficial) {
                console.log(`发消息人${await contact.name()}:${content}`)
                //更新配置拦截
                if (content.indexOf("更新配置") > -1) {
                    await loadBotConfigAll();
                    await startTask(that);
                    await contact.say(`配置更新成功`);
                    return;
                }
                //更新配置拦截
                if (content.indexOf("更新联系人") > -1) {
                    await updateContacts(that);
                    await contact.say(`更新联系人成功`);
                    return;
                }
                //获取配置
                const botConfig = await getBotConfig();
                //是否开启私聊
                if (botConfig.wxBotConfig.talkPrivateAutoReplyFlag == 1) {
                    //获取关键字回复
                    let replyContent = await getKeywordReply(content);
                    if (replyContent != null) {
                        console.log(`关键字回复：${replyContent}`);
                        await sendMessage(that,contact,null,replyContent);
                    }
                    else {
                        //调用机器人回复
                        let replyContent = await getBotReply(content, contact.name());
                        console.log(`机器人回复：${replyContent}`);
                        await contact.say(replyContent);
                    }
                }

            } else {
                console.log('公众号消息')
            }
            break
        case that.Message.Type.Emoticon:
            console.log(`发消息人${await contact.name()}:发了一个表情`)
            break
        case that.Message.Type.Image:
            console.log(`发消息人${await contact.name()}:发了一张图片`)
            break
        case that.Message.Type.Url:
            console.log(`发消息人${await contact.name()}:发了一个链接`)
            break
        case that.Message.Type.Video:
            console.log(`发消息人${await contact.name()}:发了一个视频`)
            break
        case that.Message.Type.Audio:
            console.log(`发消息人${await contact.name()}:发了一个视频`)
            break
        default:
            break
    }

}

/**
 * 根据消息类型过滤群消息事件
 * @param {*} that bot实例
 * @param {*} room room对象
 * @param {*} msg 消息主体
 */
async function dispatchRoomFilterByMsgType(that, room, msg) {
    const contact = msg.talker() // 发消息人
    const contactName = contact.name()
    const roomName = await room.topic()
    const type = msg.type()
    const userSelfName = that.currentUser?.name() || that.userSelf()?.name()
    let content = ''
    switch (type) {
        case that.Message.Type.Text:
            content = msg.text()
            console.log(`群名: ${roomName} 发消息人: ${contactName} 内容: ${content}`)
            const mentionSelf = content.includes(`@${userSelfName}`)
            //是否艾特我
            if (mentionSelf) {
                content = content.replace(/@[^,，：:\s@]+/g, '').trim()
                if (content == null || content == '') {
                    content = "\n1.毒鸡汤(发送“毒鸡汤”，随机干了这碗鸡汤)\n"
                        + "2.天气查询(发送“上海天气”，查询Ta的天气)\n"
                        + "3.故事大全(发送“故事、讲个故事”，即可随机获得一个故事)\n"
                        + "4.成语接龙(发送“成语接龙”，即可进入成语接龙模式)\n"
                        + "5.歇后语(发送“歇后语”，返回短小风趣又像谜语的句子)\n"
                        + "6.笑话大全(发送“笑话、讲个笑话”，让我陪你笑开心)\n"
                        + "7.土味情话(发送“情话、讲个情话”，让我陪你撩心里的TA)\n"
                        + "8.顺口溜(发送“顺口溜”，好听的民俗有趣的轶事)\n"
                        + "9.舔狗日记(发送“舔狗”，随机返回一个舔狗日记)\n"
                        + "10.彩虹屁(发送“彩虹屁”，随机返回一个彩虹屁句子)\n\n";
                    await room.say(content, contact)
                } else {
                    //获取关键字回复
                    let replyContent = await getKeywordReply(content);
                    if (replyContent != null) {
                        console.log(`群聊关键字回复：${replyContent}`);
                        await sendMessage(that,contact,room,replyContent);
                    }
                    else {
                        //获取配置
                        const botConfig = await getBotConfig()
                        //是否开启群聊回复
                        if (botConfig.wxBotConfig.groupAutoReplyFlag == 1) {
                            //调用机器人回复
                            let replyContent = await getBotReply(content, contact.name());
                            console.log(`群聊机器人回复：${replyContent}`);
                            await room.say(replyContent, contact);
                        }
                    }
                }
            }
            break
        case that.Message.Type.Emoticon:
            content = msg.text()
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个表情 ${content}`)
            break
        case that.Message.Type.Image:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一张图片`)
            break
        case that.Message.Type.Url:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个链接`)
            break
        case that.Message.Type.Video:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个视频`)
            break
        case that.Message.Type.Audio:
            console.log(`群名: ${roomName} 发消息人: ${contactName} 发了一个语音`)
            break
        default:
            break
    }

}

async function onMessage(msg) {
    try {
        const room = msg.room() // 是否为群消息
        const msgSelf = msg.self() // 是否自己发给自己的消息
        if (msgSelf) return
        //群聊消息
        if (room) {
            await dispatchRoomFilterByMsgType(this, room, msg)
        } else {
            //私聊消息
            await dispatchFriendFilterByMsgType(this, msg)
        }
    } catch (e) {
        console.log('监听消息失败', e)
    }
}

module.exports = onMessage