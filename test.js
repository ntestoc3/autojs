console.show();


function click_bounds(obj) {
    var rect = obj.bounds();
    log("click bounds centerk:", rect.centerX(), "y:", rect.centerY());
    click(rect.centerX(), rect.centerY());
}

var skip_titles = ["邀请", "开通"]
var obj = text("去完成").findOnce();

var ts = obj.parent().parent().children();
for (var i = 1; i < ts.length; i++) {

    var view = ts[i].children();
    var title = view[0].child(0).text()
    var target = view[1];
    var skip = false;
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
    if (target.text().includes('已完成')) {
        continue;
    }

    log("title:", title, "target:", target.text(), target.enable())


}