
speed = 1
var height = device.height;
var width = device.width;
setScreenMetrics(width, height);

console.show();
try {
    auto.waitFor();
} catch (e) {
    dialogs.alert("当前auto.js版本为4.0以下版本，无法检测是否开启无障碍模式，请确保无障碍模式已经打开");
}

sleep(1000 * speed);
log("正在打开京东");
launch("com.jingdong.app.mall");
log("等待5秒...如有多开请尽快手动选择进入");
sleep(5000 * speed);

function click_bounds(obj) {
    var rect = obj.bounds();
    log("click bounds centerk:", rect.centerX(), rect.centerY());
    click(rect.centerX(), rect.centerY());
}

function get_task() {
    sleep(3000*speed);
    var obj = text("去完成").findOnce();
    var ts = obj.parent().children();
    for (var i = 0; i < ts.length; i += 4) {
        var title = ts[i + 1].text();
        var desc = ts[i + 2].text();
        var target = ts[i + 3];
        if (title.includes("邀请")) {
            log("跳过邀请!");
            continue;
        }
        if (title.includes("商圈")) {
            log("跳过商圈!");
            continue;
        }
        return {
            title: title,
            desc: desc,
            target: target
        };
    }
    return null;
}

var act = desc("浮层活动");
if (act != null) {
    log("正在自动进入活动页面");
    click_bounds(act.findOne());
    click_bounds(act.findOne());
    sleep(3000 * speed);
} else {
    log("正在等待进入活动页面");
    log("请手动进入活动页面");
}
text("领金币").findOne().click();

var t = get_task();
var i = 1;

while (t != null) {
    log("开始第" + i + "次任务!");
    log("开始任务:", t.title);
    t.target.click();
    if (t.desc.includes("8秒")) {
        log("浏览并等待8秒...")
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        textContains("获得").findOne(1500 * speed);
    } else {
        log("等待...")
        sleep(1000 * speed);
    }
    back();
    t = get_task();
}

log("over!");