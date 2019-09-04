var uiSearch = document.getElementById('ui-search');
var uiSearchSelscted = document.getElementById('ui-search-selected');
var uiSearchSelecteList = document.getElementById('ui-search-selecte-list');
var a = uiSearchSelecteList.getElementsByTagName('a');
var list = true;


/* uiSearchSelscted.onclick = function() {
    
} */

document.addEventListener("click", function() {
    uiSearchSelecteList.style.display = 'none';
    list = !list; //引入list布尔值实现div点击显示与隐藏无bug
    // console.log(1)
})
uiSearchSelscted.addEventListener("click", function(event) {
    event = event || widow.event;
    event.stopPropagation();

    if (list) {
        uiSearchSelecteList.style.display = 'block';
        list = !list;
    } else {
        uiSearchSelecteList.style.display = 'none';
        list = !list;
    }
    // console.log(2)//测试是否实现
})

for (let b of a) {
    b.onclick = function() {
        uiSearchSelscted.innerText = this.innerText;
        uiSearchSelecteList.style.display = 'none';
    }
} //for...of实现a标签传递值需要获取a标签即getElementsByTagName('a').