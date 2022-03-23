game.entityTypes = {
  cow: [50,15,[2.3,1.5,1], function(){
    var this_ = this;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[0]=0;
        return;
      };
      var objects = Object.values(game.blocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        raycaster.set(this_.object.position, new THREE.Vector3(0, -1, 0), 0, Infinity);
        var intersects = raycaster.intersectObjects(objects);
        if(intersects[0] != undefined && intersects[0].distance < 1.5) {
          this_.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0,5,0));
        };
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
        for(var i = 1; i <= Object.keys(game.entities).length; i++){
            if(game.entities[i].type != "bull" || game.entities[i].health == 0){
                continue;
            };
            if(closestDistance > game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position)){
                closestDistance = game.entities[i].hitboxCombat.position.distanceTo(this_.hitboxCombat.position);
                closestEntity = game.entities[i];
            };
        };
        if(game.bullAnger == false) {
          this_.movementSpeed = 2.5;
          this_.lookAt(closestEntity.getPosition().position, true);
        } else {
          this_.movementSpeed = 5;
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
      this.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0, 2, 0));
      game.bullAnger = true;
    }, function(){
      this.stopAnimations();
      this.playAnimation("death");
    },2.5, 2],
  bull: [50,25,[2.5,1.75,1.25], function(){
    var this_ = this;
    game.bullAnger = false;
    game.bullThrowOff = false;
    var attack = true;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[2] = 0;
        return;
      };
      var objects = Object.values(game.blocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        raycaster.set(this_.object.position, new THREE.Vector3(0, -1, 0), 0, Infinity);
        var intersects = raycaster.intersectObjects(objects);
        if(intersects[0] != undefined && intersects[0].distance < 1.5) {
          this_.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0,5,0));
        };
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
          this_.animations[2] = 0;
          this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        } else {
          if(this_.animations[2] == 0){
            this_.playAnimation("charge");
            this_.movementSpeed = 9;        
          };
          if(attack){
            var objects = [];
            for(var loop = 1; loop <= Object.keys(game.entities).length; loop++){
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
                    this_.movementSpeed = 3;
                  };
                };
                attack = false;
                setTimeout(function(){attack = true;}, 1000);
              };
            };
          };
          this_.lookAt(game.player.getPosition().position, true);
        };
        this_.movement[0] = 1;
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
      this.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0, 1, 0));
      game.bullAnger = true;
    }, function(){
      this.stopAnimations();
      this.playAnimation("death");
    },3, 3],
  pig: [30,10,[1.5,0.9,0.6], function(){
    var this_ = this;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[0]=0;
        return;
      };
      var objects = Object.values(game.blocks);
      var raycaster = new THREE.Raycaster();
      raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0), 0, Infinity);
      var intersects = raycaster.intersectObjects(objects);
      if(intersects[0] != undefined && intersects[0].distance < 1.5){
        raycaster.set(this_.object.position, new THREE.Vector3(0, -1, 0), 0, Infinity);
        var intersects = raycaster.intersectObjects(objects);
        if(intersects[0] != undefined && intersects[0].distance < 1.5) {
          this_.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0,2.5,0));
        };
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
          this_.movementSpeed = 6;
          this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        } else {
          this_.movementSpeed = 3;
          if(game.generation.puddle){
            this_.lookAt(game.generation.puddle, Math.round(Math.random()*360));
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
      this.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0, 2, 0));
      game.bullAnger = true;
    }, function(){
      this.stopAnimations();
      this.playAnimation("death");
    },3, 2],
  player: [100,1,[1,2,1], function(){
    var this_ = this;
    var sin = 0;
    var walk = game.UI.sound("walk");
    walk.loop = true;
    walk.muted = true;
    game.lastAttacker = {name: "void"};
    game.renderer.domElement.addEventListener("mousedown", function (event){
      if(this_.health == 0 || this_[0] == "deleted" || game.controls.PointerLock.isLocked == false){
        return;
      };
      this_.stopAnimations();
      this_.playAnimation("handAction");
      var result = this_.attack();
      if(result && result.health > 0) {
        game.UI.sound("attack"+Math.round(Math.random()*2+1));
      };
      setTimeout(function(){this_.playAnimation("handAction", 1, 0)}, 250);
    });
    document.body.addEventListener("keypress", function (event){
      if(this_.health == 0 || this_[0] == "deleted"){
        return;
      };
      if(event.key == "w"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[0] = 1;
      };
      if(event.key == "s"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[1] = 1;
      };
      if(event.key == "d"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[2] = 1;
      };
      if(event.key == "a"){
        walk.muted = false;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[3] = 1;
      };
      if(event.key == " "){
        sin += 1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        var objects = Object.values(game.blocks);
        for(var loop = 1; loop <= Object.keys(game.entities).length; loop++){
          if(game.entities[loop] != this_ && game.entities[loop][0] != "deleted"){
            objects.push(game.entities[loop].hitboxCombat);
          };
        };
        var raycaster = new THREE.Raycaster();
        raycaster.set(this_.object.position, new THREE.Vector3(0, -1, 0), 0, Infinity);
        var intersects = raycaster.intersectObjects(objects);
        if(intersects[0] != undefined && intersects[0].distance < 1.5) {
          this_.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0,5,0));
        };
      };
    });
    document.body.addEventListener("keyup", function (event){
      if(this_.health == 0 || this_[0] == "deleted"){
        return;
      };
      if(event.key == "w"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[0] = 0;
      };
      if(event.key == "s"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[1] = 0;
      };
      if(event.key == "d"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[2] = 0;
      };
      if(event.key == "a"){
        walk.muted = true;
        sin += 0.1;
        this_.animations[0] = Math.abs(Math.sin(sin));
        this_.movement[3] = 0;
      };
    });
    function walkLoop(){
      var rotation = [game.quaternionEuler(game.camera.quaternion)[2], game.quaternionEuler(game.camera.quaternion)[1]+90, game.quaternionEuler(game.camera.quaternion)[0]]
      if(this_.health == 0){
        walk.muted = true;
        return;
      };
      if(game.gamemode == 0){
        game.camera.position.x = this_.getPosition().position[0];
        game.camera.position.y = this_.getPosition().position[1];
        game.camera.position.z = this_.getPosition().position[2];
        this_.setPosition(this_.getPosition().position, rotation);
      };
      if(game.gamemode == 1){
        this_.setPosition([game.camera.position.x, game.camera.position.y, game.camera.position.z], rotation);
      };  
      if(this_.getPosition().position[1] <= -16){
        this_.health = 0;
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
    setTimeout(walkLoop, 100);
    healLoop();
  },
  function (entity){
    game.lastAttacker = entity;
    setTimeout(function(){
      if(game.lastAttacker == entity) {
        game.lastAttacker = {name: "void"};
      };
    }, 7000);
    this.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0, 2, 0));
    game.UI.sound("damage"+Math.round(Math.random()*2+1));
  },
  function (){
    game.UI.die();
    game.UI.sound("damage"+Math.round(Math.random()*2+1));
  },5, 4],
};
