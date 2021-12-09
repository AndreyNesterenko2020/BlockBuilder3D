game.UI.selection = "Stone";
game.UI.inventory = [];
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
    game.controls.selection = "FreeCam"
    game.UI.settings = document.createElement("div");
    game.UI.settings.style.top = "20%";
    game.UI.settings.style.left = "20%";
    game.UI.settings.style.position = "fixed";
    game.UI.settings.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.settings.style.backgroundSize = "100% 100%";
    game.UI.settings.style.width = "60%";
    game.UI.settings.style.height = "15%";
    game.UI.settings.innerHTML += "<h1 style=margin-top:2%;margin-left:5%>Settings</h1><button style=margin-top:2%;margin-left:5% onclick='if(game.controls.selection == `FreeCam`){game.controls.selection = `Orbit`; this.innerHTML = `Change controls to FreeCam`; this.blur()} else {game.controls.selection = `FreeCam`; this.innerHTML = `Change controls to Orbit`; this.blur()}'>Change controls to Orbit</button> FOV: <input type=number onkeyup=game.FOV=this.value value="+game.FOV+"> Range: <input type=number onkeyup=game.range=this.value value="+game.range+"> <button onclick=game.UI.settings.style.display=`none`;>close</button>";
    game.UI.settings.style.display = "none";
    game.UI.settingsButton = document.createElement("button")
    game.UI.settingsButton.innerHTML = "Settings";
    game.UI.settingsButton.style.position = "absolute";
    game.UI.settingsButton.style.marginTop = "-5%";
    game.UI.settingsButton.style.marginLeft = "5%";
    document.body.appendChild(game.UI.settingsButton);
    document.body.appendChild(game.UI.settings);
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
    game.UI.inventory.push(type)
};
document.body.addEventListener("keydown", function(event) {
    if(isNaN(Number(event.key)) == false){
      if(game.UI.inventory[event.key-1] == undefined){
        return;
      };
      game.UI.selection = game.UI.inventory[event.key-1]
      for(loop = 0; loop <= document.getElementById(game.UI.inventory[event.key-1]).parentElement.getElementsByTagName("img").length-1; loop++){
        game.UI.toolbar.getElementsByTagName("img")[loop].style.opacity = 0.5;
      };
      document.getElementById(game.UI.inventory[event.key-1]).style.opacity = 2;
    }
});
