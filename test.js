console.show();


function click_bounds(obj) {
    var rect = obj.bounds();
    log("click bounds centerk:", rect.centerX(), "y:", rect.centerY());
    click(rect.centerX(), rect.centerY());
}
var ts = textContains("寻宝箱").findOne().parent().child(2).children()
log("len:", ts.length)
for (let i = 0; i<ts.length; i++) {
    ts[i].click()
    sleep(3000)
    back()
    sleep(3000)
}