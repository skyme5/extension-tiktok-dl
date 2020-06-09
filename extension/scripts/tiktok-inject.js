function addHelperText(id, username, fullname) {
  if (document.querySelector(".share-id") === null) {
    var div = document.createElement("DIV");
    div.className = "share-id";
    div.innerHTML = `<code>tikadd "${id}" "${username}" "${fullname}"</code><br><button>Download</button>`;
    div.style.cssText = `
    position: fixed;
    top: 5rem;
    left: 9px;
    z-index: 11111111;
    background: rgb(255, 255, 255);
    max-width: 15rem;
    border: 1px solid rgb(0, 0, 0);
    padding: 10px;
    `;
    div.querySelector('button').onclick = function() {
      document.body.setAttribute('data-start', 'start');
    }
    
    var parent = document.querySelector(".share-info")
    if (parent == null)
      parent = document.body;
    
    parent.prepend(div);
  }
}

var data = JSON.parse(document.querySelector("#__NEXT_DATA__").innerText).props.pageProps.userData;
var id = data.userId;
var username = data.uniqueId;
var fullname = data.nickName;
document.body.setAttribute("data-id", id);
addHelperText(id, username, fullname);