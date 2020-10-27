
var speed = 1
var height = device.height;
var width = device.width;
setScreenMetrics(width, height);

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
    sleep(3000 * speed);
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
        if (target.text().includes("已完")) {
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
    click_bounds(act.findOne())
    sleep(1000 * speed);
    if (act.exists()) {
        click_bounds(act.findOne());
    }
    sleep(3000 * speed);;
} else {
    log("正在等待进入活动页面");
    log("请手动进入活动页面");
}
text("领金币").findOne().click();

var i = 0;

while (true) {
    var t = get_task();
    if (t == null) {
        break;
    }
    i++;
    log("开始第" + i + "次任务!");
    log("开始任务:", t.title, "desc:", t.desc);
    t.target.click();
    if (t.desc.includes('8秒')) {
        log("浏览并等待8秒...")
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        textContains("获得").findOne(1500 * speed);
    } else if (t.desc.includes('浏览５个商品')) {
        t.target.click();
        sleep(3000 * speed);
        var shops = textContains(".jpg").findOne().parent().parent().parent().children();
        for (var i = 0; i < 5; i++) {
            shops[i].show();
            sleep(1000 * speed);
            click_bounds(shops[i]);
            sleep(1000 * speed);
            back();
            sleep(1000 * speed);
        }
    } else if (t.desc.includes('成功加购')) {
        log("加购操作...")
        t.target.click();
        sleep(3000 * speed);
        var adds = idContains("jmdd-react-smash").find()
        for (var i = 0; i < 5; i++) {
            adds[i].click();
            sleep(1000 * speed);
        }
        back();
        sleep(1000 * speed);
    } else if (t.desc.includes('成功入会')) {
        t.target.click();
        sleep(3000 * speed);
        if (text("去完成").exists()) {
            log("已入会");
            continue;
        }
        textContains("确认授权并加入").findOne().click();
        sleep(5000 * speed);
    } else {
        log("等待...")
        sleep(1000 * speed);
    }
    while (!text("去完成").exists()) {
        back();
        sleep(3000 * speed);
    }
}

var ts = textContains("寻宝箱").findOne().parent().child(2).children()
log("待开宝箱:", ts.length, "个")
for (let i = 0; i<ts.length; i++) {
    log("宝箱",i)
    ts[i].click()
    sleep(2000*speed)
    back()
    sleep(2000*speed)
}
log("over!");