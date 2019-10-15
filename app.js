const remote = require('electron').remote
let win = remote.getCurrentWindow()

// document.getElementById("ext-btn").addEventListener("click", function (e) {
//     window.close();
// }); 

$('.exitButton').on('click',() => {win.close()})
$('.minimizeButton').on('click',() => {win.minimize()})