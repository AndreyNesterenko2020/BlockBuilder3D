game.UI.selection = null;
game.UI.init = function (){
    game.UI.toolbar = document.createElement("div");
    game.UI.toolbar.style.top = "80%";
    game.UI.toolbar.style.left = "20%";
    game.UI.toolbar.style.position = "fixed";
    game.UI.toolbar.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.toolbar.style.backgroundSize = "100% 100%";
    game.UI.toolbar.style.width = "60%";
    game.UI.toolbar.style.height = "17%";
    document.body.appendChild(game.UI.toolbar);
    game.UI.add("Stone");
    game.UI.add("Dirt");
    game.UI.add("Plant");
    game.UI.add("Wood");
};
game.UI.add = function (type){
    var item = document.createElement("img");
    item.setAttribute("draggable", "false");
    item.style.marginTop = "2%";
    item.style.marginLeft = "5%";
    item.src = "textures/"+type+".png";
    item.blocktype = type;
    item.onerror = function (){
        item.src = missing;
    };
    item.style.height = "70%";
    item.onclick = function (){
        for(loop = 0; loop <= item.parentElement.getElementsByTagName("img").length-1; loop++){
            game.UI.toolbar.getElementsByTagName("img")[loop].style.opacity = 0.5;
        };
        item.style.opacity = 2;
        game.UI.selection = item.blocktype;
    };
    game.UI.toolbar.appendChild(item);
};