game.UI.commands = {
  //5 PARAMETERS MAX
  help: function (a){
    return "js [code] - run javascript code<br>kill [all|random|notplayer|me|entityType] - kill an entity<br>spawn [type] [position] [?rotation] [?name] [?noUseAI] - spawn an entity. <br>setBlock [type] [position] - change a block. <br>gamemode [0|1] - change the player's gamemode <br>delete [all|random|notplayer|me|entityType] - delete an entity<br>give [item] [amount] - give an item to the player<br>Position and rotation format: [x, y, z]<br>Block types: "+Object.keys(game.blockTypes)+".<br>Entity types: "+Object.keys(game.entityTypes)+"<br>Item types: "+Object.keys(game.itemTypes)+"<br>ALL PARAMETERS ARE SEPERATED WITH SEMICOLONS!";
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
  spawn: function (type, position, rotation, name, noUseAI){
    if(!game.entityTypes[type]){
      return "Unknown entity type."
    };
    if(typeof(eval(position)) != "object"){
      return "Invalid position.";
    };
    if(typeof(eval(rotation)) != "object"){
      rotation = "[0, 0, 0]";
    };
    if(typeof(eval(noUseAI)) != "boolean"){
      noUseAI = "false";
    };
    new game.entity(type, eval(position), eval(rotation), name, eval(noUseAI));
    return "Spawned new "+type+" at position "+position+" at rotation "+rotation+" with name "+name+" with AI "+!eval(noUseAI);
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
  js: function (code){
    try {
      return eval(code);
    } catch (error) {
      return error;
    }
  },
  give: function (item, amount){
    if(isNaN(Number(amount))){
      amount = "1";
    };
    if(game.itemTypes[item]) {
      new game.item(item, game.player.inventory, Number(amount));
      return "gave "+amount+" of "+item+" to the player.";
    } else {
      return "Invalid item.";
    }
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
    game.controls.selection = "FreeCam"
    game.UI.settings = document.createElement("div");
    game.UI.settings.style.top = "20%";
    game.UI.settings.style.left = "20%";
    game.UI.settings.style.position = "fixed";
    game.UI.settings.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.settings.style.backgroundSize = "100% 100%";
    game.UI.settings.style.width = "60%";
    game.UI.settings.style.height = "25%";
    game.UI.settings.innerHTML += "<h1 style=margin-top:2%;margin-left:5%>Settings</h1><button style=margin-top:2%;margin-left:5% onclick='if(game.controls.selection == `FreeCam`){game.controls.selection = `Orbit`; this.innerHTML = `Change controls to FreeCam`; this.blur()} else {game.controls.selection = `FreeCam`; this.innerHTML = `Change controls to Orbit`; this.blur()}'>Change controls to Orbit</button> FOV: <input type=number onkeyup=game.FOV=this.value value="+game.FOV+"> Block Range: <input type=number onkeyup=game.range=this.value value="+game.range+"> <br> <button style=margin-top:2%;margin-left:5% onclick='if(game.debug == true){game.debug = false; this.innerHTML = `Enable Debug`; this.blur(); game.UI.consoleMessage(`Disabled debug`);} else {game.debug = true; this.innerHTML = `Disable Debug`; this.blur(); game.UI.consoleMessage(`Enabled debug`);}'>Enable Debug</button> <button onclick='if(game.gamemode == 1){game.gamemode = 0; this.innerHTML = `Set to gamemode 1`; this.blur()} else {game.gamemode = 1; this.innerHTML = `Set to gamemode 0`; this.blur()}'>Set to gamemode 1</button><br><button style=margin-top:2%;margin-left:5% onclick=game.UI.settings.style.display=`none`;>close</button>";
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
    game.UI.console.style.height = "30%";
    game.UI.console.style.position = "fixed";
    game.UI.console.style.backgroundImage = "url('textures/hotbar.png')";
    game.UI.console.style.backgroundSize = "100% 100%";
    game.UI.console.innerHTML = "<div id='console_output' style='overflow-y: scroll; height: 75%; margin-left: 1%;'></div><input style=' margin-left: 1%; width: 97%; border: solid black 1px; font-size: 150%;' placeholder='/ to enter console' id='console_input'>";
    document.body.appendChild(game.UI.console);
    game.UI.debug = document.createElement("div");
    game.UI.debug.style.top = 0;
    game.UI.debug.style.width = "35%";
    game.UI.debug.style.height = "25%";
    game.UI.debug.style.left = "65%";
    game.UI.debug.style.top = "10%";
    game.UI.debug.style.position = "fixed";
    document.body.appendChild(game.UI.debug);
    document.body.style.position = "fixed";
    game.UI.lag = document.createElement("h1");
    game.UI.lag.style.position = "absolute";
    game.UI.lag.style.left = "30%";
    game.UI.lag.style.top = "20%";
    game.UI.lag.innerHTML = "Is the game running slow? Try chromebook friendly mode.";
    game.UI.lag.style.transition = "opacity 2s";
    document.body.appendChild(game.UI.lag);
    game.UI.console = document.createElement("div");
    game.UI.inventory = [game.UI.add(1),game.UI.add(2),game.UI.add(3),game.UI.add(4),game.UI.add(5),game.UI.add(6)];
};
game.UI.consoleMessage = function (message){
  document.getElementById("console_output").innerHTML += "<br>"+message;
  document.getElementById("console_output").scrollTop = document.getElementById("console_output").scrollHeight;
};
game.UI.add = function (type){
    var item = document.createElement("div");
    item.setAttribute("draggable", "false");
    item.style.marginTop = "2%";
    item.style.marginLeft = "5%";
    //item.src = "textures/"+type+".png";
    item.id = type;
    item.style.textAlign = "right";
    item.style.float = "left";
    item.onerror = function (){
        item.src = missing;
    };
    item.innerHTML = "";
    item.style.height = "70%";
    item.style.width = "10%";
    item.onclick = function (){
        for(loop = 0; loop <= item.parentElement.getElementsByTagName("img").length-1; loop++){
            game.UI.toolbar.getElementsByTagName("img")[loop].style.opacity = 0.5;
        };
        item.style.opacity = 2;
        game.UI.selection = item.blocktype;
    };
    game.UI.toolbar.appendChild(item);
    return item;
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
  deathScreen.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
  deathScreen.style.position = "fixed";
  if(game.generation.respawn){
    deathScreen.innerHTML = "<h1>YOU ARE DEAD</h1><br><br><br<br><br><h1>Killed by "+game.lastAttacker.name+"</h1><br><br><br><br><br><button onclick=game.UI.respawn()><h1 style=font-family:BlockBuilder3D>respawn</h1></button>";
  } else {
    deathScreen.innerHTML = "<h1>YOU ARE DEAD</h1><br><br><br<br><br><h1>Killed by "+game.lastAttacker.name+"</h1><br><br><br><h1>NO RESPAWNING</h1><br><br><br><button onclick=location.reload()><h1 style=font-family:BlockBuilder3D >leave game</h1></button>";
  };
  deathScreen.style.width = "100%";
  deathScreen.style.height = "100%";
  deathScreen.style.top = 0;
  deathScreen.style.textAlign = "center";
  deathScreen.style.opacity = 0;
  deathScreen.style.transition = "opacity 1s";
  document.body.appendChild(deathScreen);
  game.UI.consoleMessage(game.player.name+" was Killed by "+game.lastAttacker.name);
  setTimeout(function (){
    deathScreen.style.opacity = 1;
  },100);
};
game.UI.damage = function () {
  if(game.UI.damageScreen) {
    return;
  };
  if(game.player.health <= 0){
    return
  };
  var damage = document.createElement("div");
  game.UI.damageScreen = true;
  damage.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
  damage.style.position = "fixed";
  damage.style.width = "100%";
  damage.style.height = "100%";
  damage.style.top = 0;
  damage.style.textAlign = "center";
  damage.style.opacity = 0;
  damage.style.transition = "opacity 0.5s";
  document.body.appendChild(damage);
  setTimeout(function (){
    damage.style.opacity = 1;
  },10);
  setTimeout(function (){
    damage.style.opacity = 0;
  },500);
  setTimeout(function (){
    damage.style.opacity = 0;
    damage.outerHTML = "";
    game.UI.damageScreen = false;
  },1000);
}
document.body.style.fontFamily = "BlockBuilder3D";
document.body.addEventListener("keydown", function(event) {
    if(event.keyCode == 13){
      game.UI.consoleMessage(document.getElementById("console_input").value);
      try{
        game.UI.consoleMessage(eval("game.UI.commands."+document.getElementById("console_input").value.split("/")[1].split(" ")[0]+"('"+document.getElementById("console_input").value.split(document.getElementById("console_input").value.split(" ")[0])[1].split(" ")[1].replace(";", "','").replace(";", "','").replace(";", "','").replace(";", "','")+"')"));
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
    if(event.key == "t"){
      game.player.inventory.drop(game.player.inventory.selection);
      game.player.playAnimation("handAction");
      setTimeout(function(){game.player.playAnimation("handAction", 1, 0)}, 250);
    };
    if(isNaN(Number(event.key)) == false && Number(event.key) != 0){
      if(event.key > game.player.inventory.maxSlots){
        return;
      };
      game.UI.sound("select"+Math.round(Math.random()*2+1));
      game.player.inventory.selection = event.key;
      for(var loop = 0; loop <= Object.keys(game.player.inventory.slots).length-1; loop++){
        game.UI.inventory[loop].style.opacity = 0.5;
        game.UI.inventory[loop].style.border = "none";
      };
      try {
        document.getElementById(game.player.inventory.selection).style.opacity = 2;
        document.getElementById(game.player.inventory.selection).style.border = "solid black 5px";
      } catch(e){
        
      };
    };
});
document.body.addEventListener("wheel", function(event) {
  game.player.inventory.selection+=event.deltaY/Math.abs(event.deltaY);
  if(game.player.inventory.selection < 1){
    game.player.inventory.selection = game.player.inventory.maxSlots;
  };
  if(game.player.inventory.selection > game.player.inventory.maxSlots){
    game.player.inventory.selection = 1;
  };
  for(var loop = 0; loop <= Object.keys(game.player.inventory.slots).length-1; loop++){
    game.UI.inventory[loop].style.opacity = 0.5;
    game.UI.inventory[loop].style.border = "none";
  };
  try {
    document.getElementById(game.player.inventory.selection).style.opacity = 2;
    document.getElementById(game.player.inventory.selection).style.border = "solid black 5px";
  } catch(e){
    
  };
  game.UI.sound("select"+Math.round(Math.random()*2+1));
});
game.renderer.domElement.addEventListener("mousedown", () => {
  if(game.controls.PointerLock.isLocked == false){
    return;
  };
   var objects = Object.values(game.blocks)
  for(var loop = 1; loop <= Object.keys(game.entities).length; loop++){
    if(game.entities[loop] && game.entities[loop][0] != "deleted"){
      objects.push(game.entities[loop].hitboxCombat);
    };
  };
  var intersects = game.raycaster.intersectObjects(objects);
  var playerPos = new THREE.Vector3(Math.round(game.player.getPosition().position[0]), Math.round(game.player.getPosition().position[1]), Math.round(game.player.getPosition().position[2]));
  var raycastPos = new THREE.Vector3(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z)
  if(event.button == 2){
    game.player.inventory.slots[game.player.inventory.selection].rightuse(playerPos, raycastPos, intersects[0].object);
  } else {
    game.player.inventory.slots[game.player.inventory.selection].leftuse(playerPos, raycastPos, intersects[0].object);
  };
})