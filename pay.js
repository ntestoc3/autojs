
var speed = 1

launch("com.eg.android.AlipayGphone");
sleep(3000 * speed);

function click_bounds(obj) {
    var rect = obj.bounds();
    log("center:", rect.centerX(), rect.centerY());
    click(rect.centerX(), rect.centerY());
}

console.show();
try {
    auto.waitFor();
}catch(e) {
    dialogs.alert("当前auto.js版本为4.0以下版本，无法检测是否开启无障碍模式，请确保无障碍模式已经打开");
}

var act = descContains("双11狂欢节").findOne();
if(act != null){
    log("正在自动进入活动页面");
    var target = act.parent();
    log("target:", target);
    click_bounds(target);
    sleep(3000 * speed);
}else{
    log("正在等待进入双11狂欢节活动页面");
    log("请手动进入活动页面");
}

sleep(1000*speed);
id("alimod-2020-1111-game").click();
