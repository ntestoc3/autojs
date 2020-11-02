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

speed = 1

function choujiang(){
    let chou = textContains("可抽奖次数").findOnce()
    if (chou != null) {
        let info = chou.parent()
        while (info.child(1).text() != "0") {
            log("抽奖:", info.child(1).text())
            info.child(3).click()
            sleep(6000*speed)
            textContains("恭喜你").waitFor()
            let f = textContains("恭喜你").findOnce().parent().parent().parent()
            if (f != null) {
                f.child(1).click()
            }
            sleep(1000*speed)
        }

    }
}

choujiang()

log("over.") 