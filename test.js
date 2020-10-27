console.show();


function click_bounds(obj) {
    var rect = obj.bounds();
    log("click bounds centerk:", rect.centerX(), "y:", rect.centerY());
    click(rect.centerX(), rect.centerY());
}

var adds = idContains("jmdd-react-smash").find()
log(adds.length)

for (var i = 0; i < 5; i++ ){
    adds[i].click();
    sleep(1000);
}