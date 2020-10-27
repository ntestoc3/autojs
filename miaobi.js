/**
 * 作者：ROCEYS
 * 时间：2020-10-21 01:01:53
 * Version：0.0.4
 * 增加去搜索功能
 * 增加自动撸猫功能（偶尔出现1600暴击）
 * 增加自动领奖励功能
 * 1021晚上发现淘宝增加了脚本检测 可能喵币只有1/100奖励了
 */

var skip_titles = ["邀请", "开通", "农场施肥"]
var height = device.height;
var width = device.width;
setScreenMetrics(width, height);
var speed = 1;

menu: while (true) {
    var choose = dialogs.select("选择脚本速度", "干就完了，给我上最快的", "网速不太好，别整太快了", "手机和网速都不咋滴", "我太难了，整个最慢的叭");
    switch (choose) {
        case -1:
            toast("请选择");
            continue menu;
        case 0:
            toast("牛批啊，火箭已准备就绪");
            speed = 0.75;
            break menu;
        case 1:
            toast("慢慢来，稳中求胜");
            speed = 1;
            break menu;
        case 2: ;
            toast("老铁666，自行车发车啦");
            speed = 1.5;
            break menu;
        case 3:
            toast("村通网，莫得办法")
            speed = 2;
            break menu;

        default:
            break;
    }
}

console.show();
try {
    auto.waitFor();
} catch (e) {
    dialogs.alert("当前auto.js版本为4.0以下版本，无法检测是否开启无障碍模式，请确保无障碍模式已经打开");
}
sleep(1000 * speed);
log("正在打开淘宝");
launch("com.taobao.taobao");
log("等待5秒...如有多开请尽快手动选择进入");
sleep(5000 * speed);

var act = descContains("主互动");
if (act != null) {
    log("正在自动进入活动页面");
    act.click();
    sleep(3000 * speed);
} else {
    log("正在等待进入吸猫活动页面");
    log("请手动进入活动页面");
}

className("android.widget.Button").text("赚喵币").waitFor()
sleep(1000);
if (!textContains("累计任务奖励").exists()) {
    className("android.widget.Button").text("赚喵币").findOne().click();
    log("进入活动成功");
}
sleep(1500 * speed);
if (!textContains("签到").exists()) { log("已签到"); }
sleep(1500 * speed);

function get_task() {
    sleep(3000 * speed);
    var obj = text("去完成").findOnce();
    var ts = obj.parent().parent().children();
    for (let i = 1; i < ts.length; i++) {
        let view = ts[i].children();
        let title = view[0].child(0).text()
        let target = view[1];
        let skip = false;
        for (let j = 0; j < skip_titles.length; j++) {
            if (title.includes(skip_titles[j])) {
                log("跳过", title);
                skip = true;
                break;
            }
        }
        if (skip) {
            continue;
        }
        if (target.text().includes('去完成')) {
            return {
                title: title,
                target: target
            };
        }
    }
    return null;
}

while (true) {
    var t = get_task();

    if (t == null) {
        log("任务全部完成!")
        break;
    }
    log("进行任务：", t.title);
    t.target.click();
    sleep(1500 * speed)

    if (textContains("签到").exists()) {
        log("签到完成！");
        continue;
    }

    if (id("taolive_follow_text").exists() || textContains("赚金币").exists()) {
        sleep(15000 * speed);
    } else {
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(3500 * speed);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(12000 * speed);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
    }

    textContains("完成").findOne(1500 * speed);

    back();

    sleep(2000 * speed);
}

var catCoins = text("已领取").find();
if (catCoins == null || (catCoins != null && catCoins.size() < 4)) {
    sleep(1500 * speed);
    click('领取奖励');
    sleep(1500 * speed);
    click('领取奖励');
    sleep(1500 * speed);
    click('领取奖励');
}
log("奖励已领取完成!");

sleep(3000 * speed);
var close = text("关闭").findOnce();
if (null != close) {
    close.click();
    log("开始撸猫");
    if (dialogs.confirm("撸猫?", "开始撸猫300次")) {
        for (var i = 1; i <= 300; i++) {
            click(width / 2, height / 2);
            log(i + "喵喵喵~");
        }
    } else {
        log("取消撸猫")
    }
    if (!textContains("明天7点可领").exists()) {
        id("_3vkSFX").click();
        log("领取每日喵币完成!");
    }
} else {
    log("请关闭任务界面并手动运行撸猫脚本");
}

log("Done!");
exit();