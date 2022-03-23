game.UI.commands = {
  //3 PARAMETERS MAX
  help: function (a){
    return "help [me] - get help<br>kill [all|random|notplayer|me|entityType] - kill an entity<br>spawn [type] [position] [?rotation] - spawn an entity. <br>setBlock [type] [position] - change a block. <br>gamemode [0|1] - change the player's gamemode <br>delete [all|random|notplayer|me|entityType] - delete an entity<br>Position and rotation format: [x, y, z]<br>Block types: "+Object.keys(game.blockTypes)+".<br>Entity types: "+Object.keys(game.entityTypes)+"<br>ALL PARAMETERS ARE SEPERATED WITH SEMICOLONS!";
  },
  kill: function (selector){
    var kill = [];
    if(selector == "all"){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].health == 0){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].health = 0;
      };
      return "Killed "+kill;
    };
    if(selector == "notplayer"){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].health == 0){
          continue;
        };
        if(game.entities[i].type == "player"){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].health = 0;
      };
      return "Killed "+kill;
    };
    if(selector == "random"){
      var entities = [];
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].health == 0){
          continue;
        };
        entities.push(game.entities[i]);
      };
      var entity = entities[Math.floor(Math.random()*entities.length)];
      kill.push(entity.name);
      entity.health = 0;
      return "Killed "+kill;
    };
    if(selector == "me"){
      if(game.player.health == 0){
        return "Player is already dead";
      };
      kill.push(game.player.name);
      game.player.health = 0;
      return "Killed "+kill;
    };
    if(game.entityTypes[selector]){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].health == 0){
          continue;
        };
        if(game.entities[i].type != selector){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].health = 0;
      };
      return "Killed "+kill;
    };
    return "incorrect parameter.";
  },
  spawn: function (type, position, rotation){
    if(!game.entityTypes[type]){
      return "Unknown entity type."
    };
    if(typeof(eval(position)) != "object"){
      return "Invalid position.";
    };
    if(typeof(eval(rotation)) != "object"){
      rotation = "[0, 0, 0]";
    };
    new game.entity(type, eval(position), eval(rotation));
    return "Spawned new "+type+" at position "+position+" at rotation "+rotation;
  },
  setBlock: function (type, position) {
    if(typeof(eval(position)) != "object"){
      return "Invalid position.";
    };
    if(game.getBlock(eval(position)[0], eval(position)[1], eval(position)[2])){
      game.getBlock(position[0], position[1], position[2]).delete();
    };
    new game.block(eval(position)[0], eval(position)[1], eval(position)[2], type);
    return "Placed new block";
  },
  gamemode: function (type) {
    if(type != 0 && type != 1) {
      return "Invalid gamemode";
    };
    game.gamemode = type;
    return "Set player's gamemode to "+type;
  },
  delete: function (selector){
    var kill = [];
    if(selector == "all"){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].delete();
      };
      return "Deleted "+kill;
    };
    if(selector == "notplayer"){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].type == "player"){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].delete();
      };
      return "Deleted "+kill;
    };
    if(selector == "random"){
      var entities = [];
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        entities.push(game.entities[i]);
      };
      var entity = entities[Math.floor(Math.random()*entities.length)];
      kill.push(entity.name);
      entity.delete();
      return "Deleted "+kill;
    };
    if(selector == "me"){
      kill.push(game.player.name);
      game.player.delete();
      return "Deleted "+kill;
    };
    if(game.entityTypes[selector]){
      for(var i = 1; i <= Object.keys(game.entities).length; i++){
        if(game.entities[i][0]){
          continue;
        };
        if(game.entities[i].type != selector){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].delete();
      };
      return "Deleted "+kill;
    };
    return "incorrect parameter.";
  },
};
game.UI.selection = "Stone";
game.UI.respawn = function (){
  game.controls.selection = "FreeCam";
  game.player.delete();
  game.player = new game.entity('player',[10,15,10]);
  deathScreen.outerHTML = '';
  for(var i = 0; i < game.getEntitiesByName("cow").length; i++){
    if(game.getEntitiesByName("cow")[i].health != 0){
      game.getEntitiesByName("cow")[i].health = game.getEntitiesByName("cow")[i].maxHealth;
    };
  };  
  for(var i = 0; i < game.getEntitiesByName("bull").length; i++){
    if(game.getEntitiesByName("bull")[i].health != 0){
      game.getEntitiesByName("bull")[i].health = game.getEntitiesByName("bull")[i].maxHealth;
    };
  };
  for(var i = 0; i < game.getEntitiesByName("pig").length; i++){
    if(game.getEntitiesByName("pig")[i].health != 0){
      game.getEntitiesByName("pig")[i].health = game.getEntitiesByName("pig")[i].maxHealth;
    };
  };
};
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
    game.UI.add("Mud");
    game.UI.add("Tree");
    game.controls.selection = "FreeCam"
    game.UI.settings = document.createElement("div");
    game.UI.settings.style.top = "20%";
    game.UI.settings.style.left = "20%";
    game.UI.settings.style.position = "fixed";
    game.UI.settings.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.settings.style.backgroundSize = "100% 100%";
    game.UI.settings.style.width = "60%";
    game.UI.settings.style.height = "25%";
    game.UI.settings.innerHTML += "<h1 style=margin-top:2%;margin-left:5%>Settings</h1><button style=margin-top:2%;margin-left:5% onclick='if(game.controls.selection == `FreeCam`){game.controls.selection = `Orbit`; this.innerHTML = `Change controls to FreeCam`; this.blur()} else {game.controls.selection = `FreeCam`; this.innerHTML = `Change controls to Orbit`; this.blur()}'>Change controls to Orbit</button> FOV: <input type=number onkeyup=game.FOV=this.value value="+game.FOV+"> Block Range: <input type=number onkeyup=game.range=this.value value="+game.range+"> <br> <button style=margin-top:2%;margin-left:5% onclick='if(game.debug == true){game.debug = false; this.innerHTML = `Enable Debug`; this.blur()} else {game.debug = true; this.innerHTML = `Disable Debug`; this.blur()}'>Enable Debug</button> <button onclick='if(game.gamemode == 1){game.gamemode = 0; this.innerHTML = `Set to gamemode 1`; this.blur()} else {game.gamemode = 1; this.innerHTML = `Set to gamemode 0`; this.blur()}'>Set to gamemode 1</button><br><button style=margin-top:2%;margin-left:5% onclick=game.UI.settings.style.display=`none`;>close</button>";
    game.UI.settings.style.display = "none";
    game.UI.settingsButton = document.createElement("button")
    game.UI.settingsButton.onclick = function(){game.UI.settings.style.display=`block`;};
    game.UI.settingsButton.innerHTML = "Settings";
    game.UI.settingsButton.style.position = "absolute";
    game.UI.settingsButton.style.marginTop = "-5%";
    game.UI.settingsButton.style.marginLeft = "5%";
    document.body.appendChild(game.UI.settingsButton);
    document.body.appendChild(game.UI.settings);
    game.UI.Health = document.createElement("div");
    game.UI.Health.style.top = "65%";
    game.UI.Health.style.left = "20%";
    game.UI.Health.style.position = "fixed";
    game.UI.Health.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.Health.style.backgroundSize = "100% 100%";
    game.UI.Health.style.width = "25%";
    game.UI.Health.style.height = "10%";
    game.UI.Health.innerHTML = "<div style='background-color: red; width: 98%; height: 85%; text-align: center; font-size: 200%; margin-top: 2%; margin-left: 1%; transition: width 0.5s' id='health'>100</div>";
    document.body.appendChild(game.UI.Health);
    game.UI.lock = document.createElement("h1");
    game.UI.lock.style.position = "absolute";
    game.UI.lock.style.left = "40%";
    game.UI.lock.style.top = "40%";
    game.UI.lock.innerHTML = "click anywhere to lock mouse.";
    game.UI.lock.style.transition = "opacity 2s";
    document.body.appendChild(game.UI.lock);
    game.UI.console = document.createElement("div");
    game.UI.console.style.top = 0;
    game.UI.console.style.width = "30%";
    game.UI.console.style.height = "25%";
    game.UI.console.style.position = "fixed";
    game.UI.console.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.console.style.backgroundSize = "100% 100%";
    game.UI.console.innerHTML = "<div id='console_output' style='overflow-y: scroll; height: 75%; margin-left: 1%;'></div><input style=' margin-left: 1%; width: 97%; border: solid black 1px; font-size: 150%;' placeholder='/ to enter console' id='console_input'>";
    document.body.appendChild(game.UI.console);
};
game.UI.consoleMessage = function (message){
  document.getElementById("console_output").innerHTML += "<br>"+message;
  document.getElementById("console_output").scrollTop = document.getElementById("console_output").scrollHeight;
};
game.UI.add = function (type){
    var item = document.createElement("img");
    item.setAttribute("draggable", "false");
    item.style.marginTop = "2%";
    item.style.marginLeft = "5%";
    item.src = "textures/"+type+".png";
    item.id = type;
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
game.UI.sound = function (audio) {
  var sound = document.createElement("Audio");
  sound.src = "sounds/"+audio+".mp3";
  sound.play();
  return sound;
};
game.UI.die = function () {
  game.controls.PointerLock.unlock();
  game.controls.selection="DeathScreen"
  deathScreen = document.createElement("div");
  deathScreen.style.backgroundColor = "red";
  deathScreen.style.position = "fixed";
  deathScreen.innerHTML = "<h1>YOU ARE DEAD</h1><br><br><br<br><br><h1>Killed by "+game.lastAttacker.name+"</h1><br><br><br<br><br><button onclick=game.UI.respawn()><h1>respawn</h1></button>";
  deathScreen.style.width = "100%";
  deathScreen.style.height = "100%";
  deathScreen.style.top = 0;
  deathScreen.style.opacity = 0.5;
  deathScreen.style.textAlign = "center";
  document.body.appendChild(deathScreen);
  game.UI.consoleMessage(game.player.name+" was Killed by "+game.lastAttacker.name);
};
document.body.style.fontFamily = "BlockBuilder3D";
document.body.addEventListener("keydown", function(event) {
    if(event.keyCode == 13){
      game.UI.consoleMessage(document.getElementById("console_input").value);
      try{
        game.UI.consoleMessage(eval("game.UI.commands."+document.getElementById("console_input").value.split("/")[1].split(" ")[0]+"('"+document.getElementById("console_input").value.split(document.getElementById("console_input").value.split(" ")[0])[1].split(" ")[1].replace(";", "','").replace(";", "','")+"')"));
      } catch (error) {
        game.UI.consoleMessage("Unknown command. Use /help me for help.");
        if(game.debug){
          game.UI.consoleMessage(error);
          console.error(error);
        };
      };
      document.getElementById("console_input").value = "";
      document.getElementById("console_input").blur();
    };
    if(event.key == "/"){
      document.getElementById("console_input").focus();
    };
    if(isNaN(Number(event.key)) == false){
      if(game.UI.inventory[event.key-1] == undefined){
        return;
      };
      game.UI.selection = game.UI.inventory[event.key-1]
      for(loop = 0; loop <= document.getElementById(game.UI.inventory[event.key-1]).parentElement.getElementsByTagName("img").length-1; loop++){
        game.UI.toolbar.getElementsByTagName("img")[loop].style.opacity = 0.5;
      };
      document.getElementById(game.UI.inventory[event.key-1]).style.opacity = 2;
    };
});
document.body.addEventListener("wheel", function(event) {
  console.log(game.UI.inventory.indexOf(game.UI.selection)+event.deltaY/Math.abs(event.deltaY), game.UI.inventory.length);
  if(game.UI.inventory.indexOf(game.UI.selection)+event.deltaY/Math.abs(event.deltaY) > game.UI.inventory.length-1){
    game.UI.selection = game.UI.inventory[0];
  } else {
    if(game.UI.inventory.indexOf(game.UI.selection)+event.deltaY/Math.abs(event.deltaY) < 0){
      game.UI.selection = game.UI.inventory[game.UI.inventory.length-1];
    } else {
      game.UI.selection = game.UI.inventory[game.UI.inventory.indexOf(game.UI.selection)+event.deltaY/Math.abs(event.deltaY)];
    };
  };
  for(loop = 0; loop <= document.getElementById(game.UI.selection).parentElement.getElementsByTagName("img").length-1; loop++){
    game.UI.toolbar.getElementsByTagName("img")[loop].style.opacity = 0.5;
  };
  document.getElementById(game.UI.selection).style.opacity = 2;
});