
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

function click_bounds(obj) {
    let rect = obj.bounds();
    let x = rect.centerX()
    let y = rect.centerY()
    log("click,bounds:", rect)
    if (y >= height - 20) {
        log("点击超出范围")
        let dist = Math.abs(rect.height())
        log("dist:", dist)
        swipe(width / 2, height - 100, width / 2, height - 100 - dist, 800 * speed);
        sleep(1000 * speed)
        click(x, y - dist)
    } else {
        log("click bounds pos x:", x, " y:", y);
        click(x, y)
    }
}

function get_task() {
    sleep(3000 * speed);
    var obj = text("去完成").findOnce(2);
    if (obj == null) {
        return null;
    }
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
        if (title.includes("小程序")) {
            log("跳过小程序")
            continue
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

const jd_package = "com.jingdong.app.mall"

function go_jdview(data) {
    app.startActivity({
        action: "android.intent.action.VIEW",
        data: "openapp.jdmobile://virtual?params=" + encodeURI(JSON.stringify(data)),
        packageName: jd_package
    });
}

function open_yingye() {
    sleep(1000 * speed);
    log("正在打开京东全民营业");
    go_jdview({
        "category": "jump",
        "action": "to",
        "des": "m",
        "url": "https://wbbny.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?babelChannel=",
        "sourceType": "JSHOP_SOURCE_TYPE",
        "sourceValue": "JSHOP_SOURCE_VALUE",
        "M_sourceFrom": "mxz",
        "msf_type": "auto"
    })
    sleep(5000 * speed);
    text("领金币").waitFor()
    text("领金币").findOne().click();
}

function check_net() {
    if (text("重新连接").exists()) {
        text("重新连接").click()
        sleep(3000 * speed)
    }
}


open_yingye()
var i = 0;

while (true) {
    var t = get_task();
    if (t == null) {
        break;
    }
    i++;
    log("开始第" + i + "次任务!");
    log("开始任务:", t.title, "desc:", t.desc);
    check_net()
    t.target.click();
    sleep(3000 * speed)
    check_net()
    if (t.desc.includes('8秒')) {
        log("浏览并等待8秒...")
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        swipe(width / 2, height - 500, width / 2, 0, 800 * speed);
        sleep(5000 * speed);
        textContains("获得").findOne(1500 * speed);
    } else if (t.desc.includes('浏览5个商品')) {
        log("浏览商品")
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
        log("加购操作")
        var adds = idContains("jmdd-react-smash").find()
        for (var i = 0; i < 5; i++) {
            adds[i].click();
            sleep(1000 * speed);
        }
        back();
        sleep(1000 * speed);
    } else if (t.desc.includes('成功入会')) {
        log("入会任务")
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
        if (currentPackage() != jd_package) {
            open_yingye()
        }
    }
}

while (text("领取奖励").exists()) {
    text("领取奖励").click()
    sleep(3000 * speed)
}

function todays() {
    let d = new Date()
    return d.toDateString()
}

var storage = storages.create("JD_AUTO")
let baoxiang_day = storage.get("baoxiang", false)

if (!baoxiang_day || baoxiang_day != todays()) {
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
    storage.put("baoxiang", todays())
} else {
    log("今天宝箱已经开过")
}

function choujiang() {
    let chou = textContains("可抽奖次数").findOnce()
    if (chou != null) {
        let info = chou.parent()
        while (info.child(1).text() != "0") {
            log("抽奖:", info.child(1).text())
            info.child(3).click()
            sleep(6000 * speed)
            textContains("恭喜你").waitFor()
            let f = textContains("恭喜你").findOnce().parent().parent().parent()
            if (f != null) {
                f.child(1).click()
            }
            sleep(1000 * speed)
        }

    }
}

var city_count = 0

function to_bantu() {
    log("开始营业版图")
    text("可领金币").click()
    sleep(3000 * speed)
}

function to_city(c) {
    c.click()
    sleep(3000 * speed)
    text("免费领金币").waitFor()
}

function bantu_jinbi(cities) {
    cities.forEach(function (city) {
        if (city.childCount() >= 3) {
            let c = city.child(2)
            log("访问城市:", c.text())
            to_city(c)
            var ts = text("去完成").find()
            for (let i = 0; i < ts.length; i++) {
                ts[i].click()
                sleep(3000 * speed)
                while (!text("已完成").exists()) {
                    back();
                    sleep(3000 * speed);
                    if (textContains("开店进度").exists()) {
                        to_city(c)
                        break
                    }
                }
            }
            choujiang()
            back();
            log("结束访问 ", c.text())
            city_count++
            sleep(3000 * speed)
        }
    })
}


to_bantu()
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