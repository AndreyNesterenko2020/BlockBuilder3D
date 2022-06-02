game.UI.slots = [];
game.UI.commands = {
  //5 PARAMETERS MAX
  help: function (a){
    return "js [code] - run javascript code<br>kill [all|random|notplayer|me|entityType] - kill an entity<br>spawn [type] [?position] [?rotation] [?name] [?noUseAI] - spawn an entity. <br>setBlock [type] [position] - change a block. <br>gamemode [0|1] - change the player's gamemode <br>delete [all|random|notplayer|me|entityType] - delete an entity<br>give [item] [?amount] - give an item to the player<br>refresh [chunks] - refresh chunks.<br>Position and rotation format: [x, y, z]<br>Block types: "+Object.keys(game.blockTypes)+".<br>Entity types: "+Object.keys(game.entityTypes)+"<br>Item types: "+Object.keys(game.itemTypes)+"<br>ALL PARAMETERS ARE SEPERATED WITH SEMICOLONS!";
  },
  kill: function (selector){
    var kill = [];
    if(selector == "all"){
      for(var i = 0; i < game.entities.length; i++){
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
      for(var i = 0; i < game.entities.length; i++){
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
      for(var i = 0; i < game.entities.length; i++){
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
      for(var i = 0; i < game.entities.length; i++){
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
      position = JSON.stringify(game.player.getPosition().position);
    };
    if(typeof(eval(rotation)) != "object"){
      rotation = "[0, 0, 0]";
    };
    if(typeof(eval(noUseAI)) != "boolean"){
      noUseAI = "false";
    };
    if(!name){
      name = type;
    };
    new game.entity(type, eval(position), eval(rotation), name, eval(noUseAI));
    return "Spawned new "+type+" at position "+position+" at rotation "+rotation+" with name "+name+" with AI "+!eval(noUseAI);
  },
  setBlock: function (type, position) {
    if(typeof(eval(position)) != "object"){
      return "Invalid position.";
    };
    if(!game.blockTypes[type]){
      return "Invalid block type";
    };
    if(game.getBlock(eval(position)[0], eval(position)[1], eval(position)[2])){
      game.getBlock(eval(position)[0], eval(position)[1], eval(position)[2]).delete();
    };
    var block = new game.block(eval(position)[0], eval(position)[1], eval(position)[2], type);
    return "Placed new block";
  },
  gamemode: function (type) {
    if(type != 0 && type != 1) {
      return "Invalid gamemode";
    };
    if(type==0){
      var tmp = new game.block(game.player.getPosition().position[0],game.player.getPosition().position[1]-1,game.player.getPosition().position[2],"world_barrier");
    };
    game.gamemode = type;
    if(tmp&&tmp.delete)setTimeout(function(){tmp.delete()},100);
    return "Set player's gamemode to "+type;
  },
  delete: function (selector){
    var kill = [];
    if(selector == "all"){
      for(var i = 0; i < game.entities.length; i++){
        if(game.entities[i][0]){
          continue;
        };
        kill.push(game.entities[i].name);
        game.entities[i].delete();
      };
      return "Deleted "+kill;
    };
    if(selector == "notplayer"){
      for(var i = 0; i < game.entities.length; i++){
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
      for(var i = 0; i < game.entities.length; i++){
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
      for(var i = 0; i < game.entities.length; i++){
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
    };
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
  refresh: function (chunk) {
    game.refreshChunks();
    return "Refreshed all chunks.";
  },
};
game.UI.selection = "Stone";
game.UI.respawn = function (){
  if(!game.generation.respawn)return "no cheating death allowed. sorry.";
  game.refreshChunks();
  game.controls.selection = "FreeCam";
  if(!game.player[0]){
    game.player.delete();
  };
  game.player = new game.entity('player',[5,1.5,5]);
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
  for(var i = 0; i < game.getEntitiesByName("chicken").length; i++){
    if(game.getEntitiesByName("chicken")[i].health != 0){
      game.getEntitiesByName("chicken")[i].health = game.getEntitiesByName("chicken")[i].maxHealth;
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
    game.UI.settings.innerHTML += "<h1 style=margin-top:2%;margin-left:5%>Settings</h1><button style='position: relative' style=margin-top:2%;margin-left:5% onclick='if(game.controls.selection == `FreeCam`){game.controls.selection = `Orbit`; this.innerHTML = `Change controls to FreeCam`; this.blur()} else {game.controls.selection = `FreeCam`; this.innerHTML = `Change controls to Orbit`; this.blur()}'>Change controls to Orbit</button> FOV: <input type=number onkeyup=game.FOV=this.value value="+game.FOV+"> Block Range: <input type=number onkeyup=game.range=this.value value="+game.range+"> <br> <button style='position: relative' style=margin-top:2%;margin-left:5% onclick='if(game.debug == true){game.debug = false; this.innerHTML = `Enable Debug`; this.blur(); game.UI.consoleMessage(`Disabled debug`);} else {game.debug = true; this.innerHTML = `Disable Debug`; this.blur(); game.UI.consoleMessage(`Enabled debug`);}'>Enable Debug</button> <button style='position: relative' onclick='if(game.gamemode == 1){game.gamemode = 0;var tmp = new game.block(game.player.getPosition().position[0],game.player.getPosition().position[1]-1,game.player.getPosition().position[2],`world_barrier`);if(tmp&&tmp.delete)setTimeout(function(){tmp.delete()},100);this.innerHTML = `Set to gamemode 1`; this.blur()} else {game.gamemode = 1; this.innerHTML = `Set to gamemode 0`; this.blur()}'>Set to gamemode 1</button> <button style='position: relative' onclick='if(this.innerHTML == `particle quality: Medium`){game.maxBlockParticles = 10; this.innerHTML = `particle quality: High`} else if(this.innerHTML == `particle quality: High`){game.maxBlockParticles = 0; this.innerHTML = `particle quality: None`} else if(this.innerHTML == `particle quality: None`){game.maxBlockParticles = 2; this.innerHTML = `particle quality: Low`} else if(this.innerHTML == `particle quality: Low`){game.maxBlockParticles = 5; this.innerHTML = `particle quality: Medium`};'>particle quality: Medium</button> <button style='position: relative' onclick='if(game.renderMode == 1){game.renderMode = 2; this.innerHTML = `Render distance: large`} else {game.renderMode = 1; this.innerHTML = `Render distance: small`}'>Render distance: Small</button> Fog distance: <input type=number onkeyup=game.fogDistance=this.value value="+game.fogDistance+"> <button style='position: relative' onclick=game.save(2)>download world</button><br><button style='position: relative' style=margin-top:2%;margin-left:5% onclick=game.UI.settings.style.display=`none`;>close</button>";
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
    game.UI.console.style.pointerEvents = "none";
    game.UI.console.style.border = "solid black 10px";
    game.UI.console.style.backgroundColor = "white";
    game.UI.console.style.opacity = 0;
    game.UI.console.id = "console";
    game.UI.console.style.transition = "opacity 1s";
    game.UI.console.innerHTML = "<div id='console_output' style='overflow-y: scroll; height: 85%; margin-left: 1%;'></div><input style=' margin-left: 1%; width: 97%; border: solid black 1px; font-size: 150%;' placeholder='/ to enter console' id='console_input'>";
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
    game.UI.lag.innerHTML = "Is the game running slow? Try turning down your render distance.";
    game.UI.lag.style.transition = "opacity 2s";
    document.body.appendChild(game.UI.lag);
    game.UI.console = document.createElement("div");
    game.UI.inventory = [game.UI.add(1),game.UI.add(2),game.UI.add(3),game.UI.add(4),game.UI.add(5),game.UI.add(6)];
    game.UI.swing = document.createElement("img");
    game.UI.swing.src = "textures/swordswing.gif";
    game.UI.swing.style.position = "fixed";
    game.UI.swing.style.top = "10%";
    game.UI.swing.style.pointerEvents = "none";
    game.UI.swing.style.left = "20%";
    game.UI.swing.style.width = "50%";
    document.body.appendChild(game.UI.swing);
    game.UI.inventoryGUI = document.createElement("div");
    game.UI.inventoryGUI.style.left = "16.65%";
    game.UI.inventoryGUI.style.top = "5%";
    game.UI.inventoryGUI.style.width = "66.6%";
    game.UI.inventoryGUI.style.height = "70%";
    game.UI.inventoryGUI.style.position = "fixed";
    game.UI.inventoryGUI.style.border = "solid black 10px";
    game.UI.inventoryGUI.style.backgroundColor = "white";
    game.UI.inventoryGUI.style.textAlign = "center";
    game.UI.inventoryGUI.innerHTML = "<h1>Inventory</h1><h2>Backpack</h2>";
    game.UI.inventoryGUI.style.display = "none";
    game.UI.inventoryGUI.open = false;
    game.UI.inventoryGUI.id = "inventoryGUI";
    document.body.appendChild(game.UI.inventoryGUI);
    for(var i = 7; i < 19; i ++) game.UI.slot(i);
    var h2 = document.createElement("h2");
    h2.style.clear = "both";
    game.UI.inventoryGUI.appendChild(h2);
    h2.innerHTML = "Toolbar";
    for(var i = 1; i < 7; i ++) game.UI.slot(i);
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
    game.UI.toolbar.appendChild(item);
    if(type==1)item.style.border = "solid black 5px";
    return item;
};
game.UI.sound = function (audio, volume) {
  var sound = document.createElement("Audio");
  sound.src = "sounds/"+audio+".mp3";
  if(!volume) volume = 1;
  sound.volume = volume;
  sound.play();
  return sound;
};
game.UI.die = function () {
  game.save(1);
  game.controls.PointerLock.unlock();
  game.controls.selection="DeathScreen"
  deathScreen = document.createElement("div");
  deathScreen.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
  deathScreen.style.position = "fixed";
  if(game.generation.respawn){
    deathScreen.innerHTML = "<h1>YOU ARE DEAD</h1><br><br><br<br><br><h1>Killed by "+game.lastAttacker.name+"</h1><br><br><br><br><br><button style='position: relative' onclick=game.UI.respawn()><h1 style=font-family:BlockBuilder3D>respawn</h1></button>";
  } else {
    deathScreen.innerHTML = "<h1>YOU ARE DEAD</h1><br><br><br<br><br><h1>Killed by "+game.lastAttacker.name+"</h1><br><br><br><h1>NO RESPAWNING</h1><br><br><br><button style='position: relative' onclick=location.reload()><h1 style=font-family:BlockBuilder3D >leave game</h1></button>";
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
};
game.UI.itemPickedUp = function (amount, type) {
  var itemPickedUp = document.createElement("div");
  itemPickedUp.style.position = "fixed";
  itemPickedUp.style.top = "60%";
  itemPickedUp.style.left = "45%";
  itemPickedUp.innerHTML = "+"+amount+" "+type;
  itemPickedUp.style.opacity = 0;
  itemPickedUp.style.transition = "all 0.5s";
  document.body.appendChild(itemPickedUp);
  setTimeout(function (){
    itemPickedUp.style.opacity = 1;
    itemPickedUp.style.top = "40%";
  },10);
  setTimeout(function (){
    itemPickedUp.style.opacity = 0;
  },500);
  setTimeout(function (){
    itemPickedUp.style.opacity = 0;
    itemPickedUp.outerHTML = "";
  },1000);
};
game.UI.save = function () {
  var save = document.createElement("div");
  save.style.position = "fixed";
  save.style.top = "60%";
  save.style.left = "46.5%";
  save.innerHTML = "<h1>Game saved<h1>"
  save.style.opacity = 0;
  save.style.transition = "all 0.5s";
  document.body.appendChild(save);
  setTimeout(function (){
    save.style.opacity = 1;
  },10);
  setTimeout(function (){
    save.style.opacity = 0;
  },1000);
  setTimeout(function (){
    save.outerHTML = "";
  },2000);
};
game.UI.openInventory = function () {
  game.UI.inventoryGUI.style.display = "block";
  game.UI.inventoryGUI.open = true;
  game.controls.PointerLock.unlock();
  game.UI.toolbar.style.display = "none";
};
game.UI.closeInventory = function () {
  game.UI.inventoryGUI.style.display = "none";
  game.UI.inventoryGUI.open = false;
  game.controls.PointerLock.lock();
  game.UI.toolbar.style.display = "block";
};
game.UI.toggleInventory = function () {
  if(game.UI.inventoryGUI.open){
    game.UI.closeInventory();
  } else {
    game.UI.openInventory();
  };
};
game.UI.first = undefined;
game.UI.second = undefined;
game.UI.slot = function (id) {
  var slot = document.createElement("div");
  slot.style.backgroundImage = "url("+white+")";
  slot.className = "slot";
  slot.style.border = "solid black 5px";
  slot.style.backgroundSize = "100% 100%";
  slot.style.textAlign = "right";
  slot.style.float = "left";
  slot.style.width = "14%";
  slot.style.height = "22%";
  slot.style.margin = "0.1%";
  game.UI.inventoryGUI.appendChild(slot);
  slot.id = "slot"+id;
  slot.innerHTML = "";
  slot.onclick = function () {
    slot.style.border = "solid grey 5px";
    if(game.UI.first){
      game.UI.second = slot;
      var first = game.UI.first.id.split("slot")[1];
      var first_item = game.player.inventory.slots[game.UI.first.id.split("slot")[1]];
      var second = game.UI.second.id.split("slot")[1];
      var second_item = game.player.inventory.slots[game.UI.second.id.split("slot")[1]];
      if(first_item && second_item) {
        game.player.inventory.slots[game.UI.first.id.split("slot")[1]].slot = game.player.inventory.slots[game.UI.second.id.split("slot")[1]].slot;
        game.player.inventory.slots[game.UI.second.id.split("slot")[1]].slot = first;
      };
      game.player.inventory.slots[first] = second_item;
      game.player.inventory.slots[second] = first_item;
      a = game.UI.first;
      b = game.UI.second;
      game.UI.first = undefined;
      game.UI.second = undefined;
      setTimeout(function (){
        a.style.border = "solid black 5px";
        b.style.border = "solid black 5px";
      }, 300);
    } else {
      game.UI.first = slot;
    };
  };
  game.UI.slots.push(slot);
};
game.UI.updateSlots = function () {
  game.UI.slots.forEach(function (slot) {
    try {
      slot.style.backgroundImage = "url(textures/"+game.player.inventory.slots[slot.id.split("slot")[1]].type+".png)";
      slot.innerHTML = "<h1>"+game.player.inventory.slots[slot.id.split("slot")[1]].amount+"</h1>";
    } catch (error) {
      slot.style.backgroundImage = "url("+white+")";
      slot.innerHTML = "";
    };
  });
};
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
      setTimeout('document.getElementById("console").style.opacity = 0', 1000);
      document.getElementById("console_input").value = "";
      document.getElementById("console_input").blur();
      game.controls.PointerLock.lock();
    };
    if(event.key == "/"){
      document.getElementById("console").style.opacity = 1;
      document.getElementById("console_input").focus();
      game.controls.PointerLock.unlock();
    };
    if(document.activeElement == document.getElementById("console_input")) return;
    if(event.key == "e"){
      game.UI.toggleInventory();
    };
    if(event.key == "t"){
      game.player.inventory.drop(game.player.inventory.selection);
      game.player.playAnimation("handAction");
      setTimeout(function(){game.player.playAnimation("handAction", 1, 0)}, 250);
    };
    if(isNaN(Number(event.key)) == false && Number(event.key) != 0){
      if(event.key > 6){
        return;
      };
      game.UI.sound("select"+Math.round(Math.random()*2+1));
      game.player.inventory.selection = Number(event.key);
      for(var loop = 0; loop <= 5; loop++){
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
    game.player.inventory.selection = 6;
  };
  if(game.player.inventory.selection > 6){
    game.player.inventory.selection = 1;
  };
  for(var loop = 0; loop <= 5; loop++){
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
    document.getElementById("console").style.opacity = 0;
    document.getElementById("console_input").value = "";
    return;
  };
  var objects = Object.values(game.blocks);
  for(var loop = 1; loop <= Object.keys(game.entities).length; loop++){
    if(game.entities[loop] && game.entities[loop][0] != "deleted"){
      objects.push(game.entities[loop].hitboxCombat);
    };
  };
  var intersects = game.raycaster.intersectObjects(objects);
  if(!intersects[0]){
    intersects[0]={object:{position:{x:Infinity, y: Infinity, z: Infinity}}, face:{normal:{x:Infinity, y: Infinity, z: Infinity}}};
  };
  var playerPos = new THREE.Vector3(Math.round(game.player.getPosition().position[0]), Math.round(game.player.getPosition().position[1]), Math.round(game.player.getPosition().position[2]));
  var raycastPos = new THREE.Vector3(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z);
  if(event.button == 2){
    game.player.inventory.slots[game.player.inventory.selection].rightuse(playerPos, raycastPos, intersects[0].object, game.player);
  } else {
    game.player.inventory.slots[game.player.inventory.selection].leftuse(playerPos, raycastPos, intersects[0].object, game.player);
  };
})