console.show();


function click_bounds(obj) {
    var rect = obj.bounds();
    log("click bounds centerk:", rect.centerX(), "y:", rect.centerY());
    click(rect.centerX(), rect.centerY());
}

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
function todays() {
    let d = new Date()
    return d.toDateString()
}

var storage = storages.create("JD_AUTO")


storage.put("baoxiang", todays())
speed = 1
log(currentPackage());
log(currentActivity())
log("over.") 