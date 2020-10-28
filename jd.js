
var speed = 1
var height = device.height;
var width = device.width;
setScreenMetrics(width, height);


//启用按键监听，按下音量下键脚本结束
function keyDetector() {
    threads.start(function () { //在子进程中运行监听事件
        events.observeKey();
        events.on("key", function (code, event) {
            var keyCodeStr = event.keyCodeToString(code);
            if (keyCodeStr == "KEYCODE_VOLUME_DOWN") {
                log("检测到音量下键，程序已结束。");
                exit();
            }
        });
    });
}

keyDetector();

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
    let rect = obj.bounds();
    let x = rect.centerX()
    let y = rect.centerY()
    log("click,bounds:", rect)
    if (y >= height - 20) {
        log("点击超出范围")
        swipe(width / 1, height, width / 2, height - 500, 800 * speed);
        sleep(1000 * speed)
        click_bounds(obj)
    } else {
        log("click bounds pos x:", x, " y:", y);
        click(x, y)
    }
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

function check_net() {
    if (text("重新连接").exists()) {
        text("重新连接").click()
        sleep(3000 * speed)
    }
}

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
    } else if (t.desc.includes('浏览5个商品')) {
        t.target.click();
        sleep(3000 * speed);
        var shops = textContains(".jpg").findOne().parent().parent().parent().children();
        for (var i = 0; i < 5; i++) {
            shops[i].show();
            sleep(2000 * speed);
            click_bounds(shops[i]);
            sleep(2000 * speed);
            back();
            sleep(2000 * speed);
        }
    } else if (t.desc.includes('成功加购')) {
        log("加购操作...")
        t.target.click();
        sleep(3000 * speed);
        check_net()
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
        check_net()
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

    check_net()
    while (!text("去完成").exists()) {
        back();
        sleep(3000 * speed);
    }
}

log("开宝箱")
var ts = textContains("寻宝箱").findOne().parent().child(2).children()
log("待开宝箱:", ts.length, "个")
for (let i = 0; i < 30; i++) {
    log("宝箱", i)
    ts[i].click()
    sleep(2000 * speed)
    back()
    sleep(2000 * speed)
}
log("开宝箱结束!")


var city_count = 0

function bantu_jinbi(cities) {
    cities.forEach(function (city) {
        if (city.childCount() >= 3) {
            let c = city.child(2)
            log("访问城市:", c.text())
            c.click()
            sleep(3000 * speed)

            text("免费领金币").waitFor()
            var ts = text("去完成").find()
            for (let i = 0; i < ts.length; i++) {
                ts[i].click()
                sleep(1000 * speed)
                while (!text("免费领金币").exists()) {
                    back();
                    sleep(3000 * speed);
                }
            }
            back();
            log("结束访问 ", c.text())
            city_count++
            sleep(3000 * speed)
        }
    })
}

log("开始营业版图")
text("可领金币").click()
sleep(3000 * speed)
var bantu = text("北京").findOne().parent().parent().children()
bantu_jinbi(bantu)
bantu = text("热爱城").findOne().parent().parent().children()
bantu_jinbi(bantu)
log("共访问", city_count, "个城市")
sleep(1000 * speed)
back()
sleep(3000 * speed)
log("结束营业版图")

while (text("立即解锁").exists()) {
    text("立即解锁").click()
    sleep(3000 * speed)
}
text("收取金币").click()

log("over!");