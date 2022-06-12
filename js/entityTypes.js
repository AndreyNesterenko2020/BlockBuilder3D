//maxHealth, attackDamage, hitboxscale, oncreate, ondamage, ondeath, movementSpeed, range, jumpHeight, hitboxAngularFactor, attackable
game.entityTypes = {
  cow: [50,15,[2.3,1.5,1], function(){
    new game.inventory(this, 1);
    if(!this.inventory.slots[1]) {
      new game.item("meat", this.inventory);
    };
    var this_ = this;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[0]=0;
        return;
      };
      var objects = Object.values(game.loadedBlocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        this_.jump();
      };
      this_.playAnimation("walk", 2, 0);
      setTimeout(function() {
        this_.playAnimation("walk", 0.5);
        setTimeout(animLoop, 500)}, 200)
      };
      function walkLoop(){
        if(this_.health == 0 || this_.health == undefined){
          return
        };
        var closestEntity = undefined;
        var closestDistance = Infinity;
        for(var i = 0; i < game.entities.length; i++){
            if(game.entities[i].type != "bull" || game.entities[i].health == 0){
                continue;
            };
            if(closestDistance > game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position)){
                closestDistance = game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position);
                closestEntity = game.entities[i];
            };
        };
        if(game.bullAnger == false) {
          this_.movementSpeed = 1.5;
          this_.lookAt(closestEntity.getPosition().position, true);
        } else {
          this_.movementSpeed = 4;
          this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        };
        this_.movement[0] = 1;
        setTimeout(walkLoop, Math.random()*5000);
      };
      function healLoop(){
        if(this_.health <= 0){
          return;
        };
        this_.health += 2;
        setTimeout(healLoop, 2000);
      };
      animLoop();
      setTimeout(walkLoop, 200);
      healLoop();
    }, function(){
      this.hitboxPhysics.velocity.y = 2;
      if(!game.bullAnger){
        game.UI.sound("bull_anger");
      };
      game.bullAnger = true;
      game.UI.sound("cow"+Math.round(Math.random()*2+1));
    }, function(){
      this.inventory.dropAll();
      this.inventory.delete();
      game.UI.sound("cow"+Math.round(Math.random()*2+1));
      this.stopAnimations();
      this.playAnimation("death");
      setTimeout(this.delete, 2000);
    },1.5, 2, 3, [1, 1, 1], true],
  bull: [50,25,[2.5,1.75,1.25], function(){
    new game.inventory(this, 1);
    if(!this.inventory.slots[1]) {
      new game.item("meat", this.inventory);
    };
    var this_ = this;
    game.bullThrowOff = false;
    var attack = true;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[2] = 0;
        return;
      };
      var objects = Object.values(game.loadedBlocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        this_.jump();
      };
      this_.playAnimation("walk", 2, 0);
      setTimeout(function() {
        this_.playAnimation("walk", 0.5);
        setTimeout(animLoop, 500)}, 200)
      };
      function walkLoop(){
        if(this_.health == 0 || this_.health == undefined){
          return
        };
        game.bullThrowOff = false;
        if(!game.bullAnger) {
          this_.movementSpeed = 2;
          this_.animations[2] = 0;
          this_.animations[3] = 0;
          this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        } else {
          if(this_.animations[2] == 0){
            this_.playAnimation("charge");
            this_.movementSpeed = 9;        
          };
          if(attack){
            var objects = [];
            for(var loop = 0; loop < game.entities.length; loop++){
              if(game.entities[loop] != this_ && game.entities[loop][0] != "deleted"){
                objects.push(game.entities[loop].hitboxCombat);
              };
            };
            var raycaster = new THREE.Raycaster();
            raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0).applyQuaternion(this_.hitboxCombat.quaternion), 0, Infinity);
            var intersects = raycaster.intersectObjects(objects);
            if(intersects[0]){
              if(intersects[0].object.entity.type == "player") {
                var result = this_.attack();
                if(result){   
                  this_.animations[2] = 0;
                  this_.playAnimation("attack");
                  setTimeout(function(){this_.playAnimation("attack", 1, 0), 100});
                  if(game.player.health <= 0){
                    game.bullAnger = false;
                    walkLoop();
                    return;
                  };
                };
                attack = false;
                setTimeout(function(){attack = true;}, 1000);
              };
            };
          };
          try {
            this_.lookAt(game.player.getPosition().position, true);
          } catch (e){
            game.bullAnger = false;
          };
        };
        this_.movement[0] = 1;
        try {
          if(Math.round(game.player.getPosition().position[0]) == Math.round(this_.getPosition().position[0]) && Math.round(game.player.getPosition().position[1]) == Math.round(this_.getPosition().position[1]+1) && Math.round(game.player.getPosition().position[2]) == Math.round(this_.getPosition().position[2])) {
            game.bullThrowOff = true;
            this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
          };
          if(Math.round(game.player.getPosition().position[0]) == Math.round(this_.getPosition().position[0]) && Math.round(game.player.getPosition().position[1]) == Math.round(this_.getPosition().position[1]+2) && Math.round(game.player.getPosition().position[2]) == Math.round(this_.getPosition().position[2])) {
            game.bullThrowOff = true;
            this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
          };
          if(Math.round(game.player.getPosition().position[0]) == Math.round(this_.getPosition().position[0]) && Math.round(game.player.getPosition().position[1]) == Math.round(this_.getPosition().position[1]-1) && Math.round(game.player.getPosition().position[2]) == Math.round(this_.getPosition().position[2])) {
            game.bullThrowOff = true;
            this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
          };
          if(Math.round(game.player.getPosition().position[0]) == Math.round(this_.getPosition().position[0]) && Math.round(game.player.getPosition().position[1]) == Math.round(this_.getPosition().position[1]-2) && Math.round(game.player.getPosition().position[2]) == Math.round(this_.getPosition().position[2])) {
            game.bullThrowOff = true;
            this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
          };
        } catch (e) {
          game.bullThrowOff = true;
        };
        if(!game.bullAnger){
          setTimeout(walkLoop, Math.random()*5000);
        } else {
          if(game.bullThrowOff){
            setTimeout(walkLoop, 1000);
          } else {
            setTimeout(walkLoop, 100);
          };
        };
      };
      function healLoop(){
        if(this_.health <= 0){
          return;
        };
        this_.health += 2;
        setTimeout(healLoop, 2000);
      };
      animLoop();
      setTimeout(walkLoop, 200);
      healLoop();
    }, function(){
      this.hitboxPhysics.velocity.y = 1;
      if(!game.bullAnger){
        game.UI.sound("bull_anger");
      };
      game.bullAnger = true;
      game.UI.sound("cow"+Math.round(Math.random()*2+1));
    }, function(){
      this.inventory.dropAll();
      this.inventory.delete();
      game.UI.sound("cow"+Math.round(Math.random()*2+1));
      this.stopAnimations();
      this.playAnimation("death");
      setTimeout(this.delete, 2000);
    },2, 3, 3, [1, 1, 1], true],
  pig: [30,10,[1.5,0.9,0.6], function(){
    new game.inventory(this, 1);
    if(!this.inventory.slots[1]) {
      new game.item("meat", this.inventory);
    };
    var this_ = this;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[0]=0;
        return;
      };
      var objects = Object.values(game.loadedBlocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 0.45){
        this_.jump();
      };
      this_.playAnimation("walk", 2, 0);
      setTimeout(function() {
        this_.playAnimation("walk", 0.5);
        setTimeout(animLoop, 500)}, 200)
      };
      function walkLoop(){
        if(this_.health == 0 || this_.health == undefined){
          return
        };
        if(game.bullAnger){
          this_.movementSpeed = 4;
          this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        } else {
          this_.movementSpeed = 2;
          if(game.generation.puddle){
            this_.lookAt(game.generation.puddle, true);
          } else {
            this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
          };
        };
        this_.movement[0] = 1;
        setTimeout(walkLoop, Math.random()*5000);
      };
      function healLoop(){
        if(this_.health <= 0){
          return;
        };
        this_.health += 2;
        setTimeout(healLoop, 2000);
      };
      animLoop();
      setTimeout(walkLoop, 200);
      healLoop();
    }, function(){
      this.hitboxPhysics.velocity.y = 2;
      if(!game.bullAnger){
        game.UI.sound("bull_anger");
      };
      game.bullAnger = true;
      game.UI.sound("pig"+Math.round(Math.random()*2+1));
    }, function(){
      this.inventory.dropAll();
      this.inventory.delete();
      game.UI.sound("pig"+Math.round(Math.random()*2+1));
      this.stopAnimations();
      this.playAnimation("death");
      setTimeout(this.delete, 2000);
    },2, 2, 3, [1, 1, 1], true],
  player: [100,1,[0.6,1.95,0.6], function(){
    new game.inventory(this, 18, function(item, amount){game.UI.itemPickedUp(item, amount)});
    this.entityData.handActionCooldown = false;
    this.entityData.attackCooldown = false;
    if(!game.player) game.player = this;
    var this_ = this;
    var sin = 0;
    var walk = game.UI.sound("walk");
    var fire = game.UI.sound("fire");
    walk.loop = true;
    walk.muted = true;
    fire.loop = true;
    fire.muted = true;
    this_.entityData.lastAttacker = {name: "void"};
    game.renderer.domElement.addEventListener("mousedown", function (event){
      if(this_.health == 0 || this_[0] == "deleted" || game.controls.PointerLock.isLocked == false){
        return;
      };
      if(this_.entityData.attackCooldown){
        return;
      };
      if(!this_.entityData.handActionCooldown){
        this_.entityData.handActionCooldown = true;
        if(this_.inventory.slots[this_.inventory.selection] && this_.inventory.slots[this_.inventory.selection].type == "sword") {
          this_.stopAnimations();
          this_.playAnimation("sword", 1);
          setTimeout(function(){this_.playAnimation("sword", 1, 0)}, 500);
          setTimeout(function(){this_.entityData.handActionCooldown = false}, 700);
        } else {
          this_.stopAnimations();
          this_.playAnimation("handAction", 5);
          setTimeout(function(){this_.playAnimation("handAction", 3, 0)}, 130);
          setTimeout(function(){this_.entityData.handActionCooldown = false}, 100);
        };
      };
      var result = this_.attack();
      if(result && result.health > 0) {
        game.UI.sound("attack"+Math.round(Math.random()*2+1));
      };
    });
    document.body.addEventListener("keydown", function (event){
      if(this_.health == 0 || this_[0] == "deleted"){
        return;
      };
      if(document.activeElement == document.getElementById("console_input")) return;
      if(event.key == "w"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[0] = 1;
      };
      if(event.key == "s"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[1] = 1;
      };
      if(event.key == "d"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[2] = 1;
      };
      if(event.key == "a"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[3] = 1;
      };
      if(event.key == " "){
        sin += 0.2;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.jump();
      };
    });
    document.body.addEventListener("keyup", function (event){
      if(this_.health == 0 || this_[0] == "deleted"){
        return;
      };
      if(event.key == "w"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[0] = 0;
      };
      if(event.key == "s"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[1] = 0;
      };
      if(event.key == "d"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[2] = 0;
      };
      if(event.key == "a"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[1] = Math.abs(Math.sin(sin));
        this_.movement[3] = 0;
      };
    });
    function walkLoop(){
      var rotation = [game.quaternionEuler(game.camera.quaternion)[2], game.quaternionEuler(game.camera.quaternion)[1]+90, game.quaternionEuler(game.camera.quaternion)[0]]
      if(this_.health == 0){
        walk.muted = true;
        fire.muted = true;
        return;
      };
      if(game.gamemode == 0){
        game.controls.selection = "Player";
        this_.physicsEnabled = true;
        game.camera.position.x = this_.getPosition().position[0];
        game.camera.position.y = this_.getPosition().position[1];
        game.camera.position.z = this_.getPosition().position[2];
        this_.setPosition(this_.getPosition().position, rotation);
      };
      if(game.gamemode == 1){
        game.controls.selection = "FreeCam";
        this_.physicsEnabled = false;
        this_.setPosition([game.camera.position.x, game.camera.position.y, game.camera.position.z], rotation);
      };
      if(this_.inventory && this_.inventory.slots[this_.inventory.selection]){
        if(!game.materials[this_.inventory.slots[this_.inventory.selection].heldTexture+"_playerHand"]) game.materials[this_.inventory.slots[this_.inventory.selection].heldTexture+"_playerHand"] = new THREE.MeshPhongMaterial({map: game.textureLoader.load("textures/"+this_.inventory.slots[this_.inventory.selection].heldTexture+".png"), alphaTest: 0.1});
        this_.object.children[1].material = game.materials[this_.inventory.slots[this_.inventory.selection].heldTexture+"_playerHand"];
        this_.object.children[1].visible = true;
      } else {
        this_.object.children[1].visible = false;
      };
      setTimeout(walkLoop, 1);
    };
    function healLoop(){
      if(this_.health <= 0){
        return;
      };
      this_.health += 2;
      setTimeout(healLoop, 2000);
    };
    function fireDetect () {
      if(this_.health <= 0) {
        return;
      };
      if(game.getBlock(Math.round(this_.getPosition().position[0]), Math.round(this_.getPosition().position[1]), Math.round(this_.getPosition().position[2]))) {
        if(game.getBlock(Math.round(this_.getPosition().position[0]), Math.round(this_.getPosition().position[1]), Math.round(this_.getPosition().position[2])).type == "lava") {
          this_.entityData.lastAttacker = {name: "lava"};
          this_.health -= 10;
          game.UI.sound("damage"+Math.round(Math.random()*2+1));
          this_.jumpHeight = 0.75;
          this_.movementSpeed = 0.5;
          game.UI.fire.style.display = "block";
          fire.muted = false;
        };
      } else {
        fire.muted = true;
        this_.movementSpeed = game.entityTypes.player[6];
          this_.jumpHeight = game.entityTypes.player[8];
          game.UI.fire.style.display = "none";
      };
      if(game.getBlock(Math.round(this_.getPosition().position[0]), Math.round(this_.getPosition().position[1]-1), Math.round(this_.getPosition().position[2]))) {
        if(game.getBlock(Math.round(this_.getPosition().position[0]), Math.round(this_.getPosition().position[1]-1), Math.round(this_.getPosition().position[2])).type == "lava") {
          this_.entityData.lastAttacker = {name: "lava"};
          this_.health -= 10;
          game.UI.sound("damage"+Math.round(Math.random()*2+1));
          this_.jumpHeight = 0.75;
          this_.movementSpeed = 0.5;
          game.UI.fire.style.display = "block";
          fire.muted = false;
        };
      } else {
        fire.muted = true;
        this_.movementSpeed = game.entityTypes.player[6];
          this_.jumpHeight = game.entityTypes.player[8];
          game.UI.fire.style.display = "none";
      };
      setTimeout(fireDetect, 500);
    };
    setTimeout(fireDetect, 100);
    setTimeout(walkLoop, 100);
    healLoop();
  },
  function (entity){
    this.entityData.lastAttacker = entity;
    var this_ = this;
    setTimeout(function(){
      if(this_.entityData.lastAttacker == entity) {
        this_.entityData.lastAttacker = {name: "void"};
      };
    }, 7000);
    game.UI.damage();
    this.hitboxPhysics.velocity.y = 2;
    game.UI.sound("damage"+Math.round(Math.random()*2+1));
  },
  function (){
    this.inventory.dropAll();
    this.inventory.delete();
    game.UI.die();
    game.UI.sound("damage"+Math.round(Math.random()*2+1));
  },3, 4, 4.5, [0, 0, 0], true],
  item: [5,1,[0.25,0.25,0.25], function(){
    var this_ = this;
    if(!this.entityData.itemAmount){
      this.entityData.itemAmount = 1;
    };
    var allowPickup = false;
    this.object.material = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+this.name+".png"), alphaTest: 0.1});
    function walkLoop(){
      if(this_.health == 0){
        return;
      };
      if(allowPickup) {
        this_.setPosition(this_.getPosition().position, [0,this_.getPosition().rotation[1]+0.5,0]);
      };
      var closestEntity = undefined;
      var closestDistance = Infinity;
      for(var i = 0; i < game.entities.length; i++){
        if(game.entities[i].type == "item" || game.entities[i].health == 0 || game.entities[i][0]){
          continue;
        };
        if(closestDistance > game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position)){
          closestDistance = game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position);
          closestEntity = game.entities[i];
        };
      };
      if(closestDistance <= 2 && allowPickup){
        if(closestEntity.inventory){
          closestEntity.inventory.pickUp(this_.name, this_);
        };
      };
      var closestEntity = undefined;
      var closestDistance = Infinity;
      for(var i = 0; i < game.entities.length; i++){
        if(game.entities[i].type != "item" || game.entities[i].name != this_.name || game.entities[i] == this_){
          continue;
        };
        if(closestDistance > game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position)){
          closestDistance = game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position);
          closestEntity = game.entities[i];
        };
      };
      if(closestDistance <= 1){
        closestEntity.entityData.itemAmount += this_.entityData.itemAmount;
        closestEntity.setPosition([(closestEntity.getPosition().position[0]+this_.getPosition().position[0])/2, (closestEntity.getPosition().position[1]+this_.getPosition().position[1])/2, (closestEntity.getPosition().position[2]+this_.getPosition().position[2])/2], closestEntity.getPosition().rotation);
        this_.delete();
      };
      setTimeout(walkLoop, 10);
    };
    setTimeout(walkLoop, 10);
    setTimeout(function(){allowPickup=true}, 1000);
  },
  function(){
    
  },
  function(){
    this.delete();
  }, 5, 1, 3, [1, 1, 1], false],
  tony: [13,15,[1, 1, 1], function(){
    var this_ = this;
    new game.inventory(this, 10);
    if(!this.inventory.slots[1]) {
      new game.item("meat", this.inventory, 10); 
    };
     function walkLoop(){
        if(this_.health == 0 || this_.health == undefined){
          return
        };
        this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        this_.movement[0] = 1;
        setTimeout(walkLoop, Math.random()*5000);
      };
      setTimeout(walkLoop, 100);
  }, function(){game.UI.sound("tony"+Math.floor(Math.random()*4+1));this.jump();}, function(){game.controls.PointerLock.unlock(); this.inventory.dropAll(); game.UI.sound("tony1"); this.delete(); game.generation.respawn = false; for(var i=0;i<20;i++)game.UI.consoleMessage("what have you done"); game.AmbientLight.color.g=0;game.AmbientLight.color.b=0; function a(){game.AmbientLight.color.r+=0.5; game.UI.lock.style.opacity = "1"; game.UI.lock.innerHTML = "he is coming"}; a();
  }, 2, 1, 3, [1,1,1], true],
  chicken: [20, 15, [0.9, 0.8, 0.6], function(){
    var this_ = this;
    new game.inventory(this, 1);
    if(!this.inventory.slots[1]) {
      new game.item("chicken", this.inventory);
    };
    this.movement[0] = 1;
    function walkLoop(){
      if(this_.health <= 0) return;
      var objects = Object.values(game.loadedBlocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        this_.jump();
        this_.playAnimation("flap");
        setTimeout(function (){
          this_.playAnimation("flap", 1, 0);
        }, 300);
      };
      var closestEntity = undefined;
      var closestDistance = Infinity;
      for(var i = 0; i < game.entities.length; i++){
          if(game.entities[i].type != "rooster" || game.entities[i].health == 0){
              continue;
          };
          if(closestDistance > game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position)){
              closestDistance = game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position);
              closestEntity = game.entities[i];
          };
      };
      if(Math.random()*100 >= 75){
        this_.movement[0] = 0;
        this_.stopAnimations();
        this_.playAnimation("peck");
        setTimeout(function(){
          this_.playAnimation("peck", 1, 0);
          this_.movement[0] = 1;
        }, 500);
      };
      setTimeout(walkLoop, Math.random()*2000+700);
      if(!game.roosterAnger) {
        this_.lookAt(closestEntity.getPosition().position, true);
      } else {
        this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
      };
    };
    function animLoop(){
      if(this_.health <= 0) return;
      this_.playAnimation("walk");
      setTimeout(function(){this_.playAnimation("walk", 1, 0); setTimeout(animLoop, 500)}, 500);
    };
    function healLoop(){
      if(this_.health <= 0){
        return;
      };
      this_.health += 2;
      setTimeout(healLoop, 2000);
    };
    setTimeout(walkLoop, 100);
    setTimeout(animLoop, 100);
    setTimeout(healLoop, 100);
  }, function(){
    this.hitboxPhysics.velocity.y = 1;
    game.UI.sound("chicken"+Math.round(Math.random()*2+1));
    if(!game.roosterAnger){
      game.UI.sound("rooster_anger");
    };
    game.roosterAnger = true;
  }, function(){
    this.stopAnimations();
    this.inventory.dropAll();
    this.inventory.delete();
    this.playAnimation("death");
    setTimeout(this.delete, 2000);
  }, 2, 1, 5, [1,1,1], true],
  rooster: [20, 10, [0.9, 0.8, 0.6], function(){
    var this_ = this;
    var attack = true;
    new game.inventory(this, 1);
    if(!this.inventory.slots[1]) {
      new game.item("chicken", this.inventory);
    };
    this.movement[0] = 1;
    function walkLoop(){
      if(this_.health <= 0) return;
      var objects = Object.values(game.loadedBlocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        this_.jump();
      };
      if(!game.roosterAnger) {
        this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        setTimeout(walkLoop, Math.random()*2000+700);
      } else {
        try {
          this_.lookAt(game.player.getPosition().position, true);
          var objects = [];
          for(var loop = 0; loop < game.entities.length; loop++){
            if(game.entities[loop] != this_ && game.entities[loop][0] != "deleted"){
              objects.push(game.entities[loop].hitboxCombat);
            };
          };
          var raycaster = new THREE.Raycaster();
          raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0).applyQuaternion(this_.hitboxCombat.quaternion), 0, Infinity);
          var intersects = raycaster.intersectObjects(objects);
          if(intersects[0]){
            if(intersects[0].object.entity.type == "player" && attack) {
              attack = false;
              var result = this_.attack();
              this_.animations[2] = 0;
              this_.playAnimation("peck");
              setTimeout(function(){this_.playAnimation("peck", 1, 0), 100});
              if(game.player.health <= 0){
                game.bullAnger = false;
                walkLoop();
                return;
              };
              setTimeout(function (){attack = true}, 500);
            };
          };
        } catch (error) {
          game.roosterAnger = false;
          attack = true;
        };
        setTimeout(walkLoop, 10);
      };
    };
    function animLoop(){
      if(this_.health <= 0) return;
      this_.playAnimation("walk");
      setTimeout(function(){this_.playAnimation("walk", 1, 0); setTimeout(animLoop, 500)}, 500);
    };
    function healLoop(){
      if(this_.health <= 0){
        return;
      };
      this_.health += 2;
      setTimeout(healLoop, 2000);
    };
    setTimeout(walkLoop, 100);
    setTimeout(animLoop, 100);
    setTimeout(healLoop, 100);
  }, function(){
    this.hitboxPhysics.velocity.y = 1;
    game.UI.sound("chicken"+Math.round(Math.random()*2+1));
    if(!game.roosterAnger){
      game.UI.sound("rooster_anger");
    };
    game.roosterAnger = true;
  }, function(){
    this.stopAnimations();
    this.inventory.dropAll();
    this.inventory.delete();
    this.playAnimation("death");
    setTimeout(this.delete, 2000);
  }, 2, 1, 5, [1,1,1], true],
};
