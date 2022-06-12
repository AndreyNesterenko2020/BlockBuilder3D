game.mouse = new THREE.Vector2();
game.maxBlockParticles = 5;
game.blockGrid = {};
game.chunkGrid = {};
game.loadedBlocks = [];
game.getBlock = function (x, y, z) {
  if(game.blockGrid[x]){
    if(game.blockGrid[x][y]){
      if(game.blockGrid[x][y][z]){
        return game.blockGrid[x][y][z];
        return game.blockGrid[x][y][z];
      };
    };
  };
  return false;
};
game.getChunk = function (x, y, z) {
  if(game.chunkGrid[Math.floor(Math.round(x)/8)*8]){
    if(game.chunkGrid[Math.floor(Math.round(x)/8)*8][Math.floor(Math.round(z)/8)*8]){
      return game.chunkGrid[Math.floor(Math.round(x)/8)*8][Math.floor(Math.round(z)/8)*8];
    };
  };
  return false;
};
game.refreshChunks = function () {
  game.chunks.forEach(function (chunk) {
    chunk.unload();
  });
};
game.blockSave = function () {
  var data = [];
  Object.values(game.blockObjects).forEach(function (block) {
    if(block[0]) return;
    data.push({type: block.type, x: block.block.position.x, y: block.block.position.y, z: block.block.position.z});
  });
  return JSON.stringify(data);
};
game.blockLoad = function (data) {
  try {
    JSON.parse(data).forEach(function (block){
      new game.block(block.x, block.y, block.z, block.type, false, true);
    });
    return true;
  } catch (error) {
    return false;
  };
};
game.block = class {
  constructor (x,y,z, type, audio, nogeneratechunk) {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);
    if(game.getBlock(x, y, z)) {
      return;
    };
    this.block = new THREE.Mesh(game.geometry);
    this.breakOverlay = new THREE.Mesh(game.geometry);
    if(!game.materials["textures/break0.png"]) game.materials["textures/break0.png"] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/break0.png"), transparent: true});
    this.breakOverlay.position.set(x, y, z);
    this.breakOverlay.material = game.materials["textures/break0.png"];
    game.scene.add(this.breakOverlay);
    this.block.visible = false;
    this.breakOverlay.visible = false;
    this.breakOverlay.scale.set(1.00005, 1.00005, 1.00005);
    this.object = this.block;
    this.getPosition = function (){
      return({position:[x-0.5,y,z], rotation:[0, 0, 0]})
    };
    this.type = type.toLowerCase();
    var test = new Image();
    test.src = "textures/"+type+".png"
    var this_ = this;
    new game.inventory(this, 1);
    if(game.itemTypes[this.type]){
      new game.item(this.type, this.inventory);
    };
    test.onload = function () {
      if(!game.materials[type]) {
        game.materials[this_.type] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+".png")});
        game.materials[this_.type].transparent = true;
      };
      this_.block.material = game.materials[this_.type];
      if(!game.blockTypes[type]) {
        this_.block.material = game.materials.defaultMaterial;;
      };
    };
    test.onerror = function (){
      this_.block.material = game.materials.defaultMaterial;
    };
    if(audio) {
      game.UI.sound(this.type+Math.round(Math.random()*2+1));
    };
    this.block.position.x = x;
    this.block.position.y = y;
    this.block.position.z = z;
    this.block.block = this;
    game.scene.add(this.block);
    this.isLoaded = false;
    this.load = function () {
      if(this.isLoaded) return;
      /*
      var transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(x, y, z));
      transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
      var motionState = new Ammo.btDefaultMotionState( transform );
      var colShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
      colShape.setMargin(0.05);
      var localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(0, localInertia );
      var rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, colShape, localInertia);
      var body = new Ammo.btRigidBody( rbInfo );
      body.setActivationState(4);
      body.setCollisionFlags(2);
      game.physics.physicsWorld.addRigidBody(body);
      */ 
      var body = new CANNON.Body({mass: 0});
      body.position.set(x, y, z);
      body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
      game.physics.world.add(body);
      this.hitboxPhysics = body;
      this.block.visible = true;
      this.breakOverlay.visible = true;
      this.break = 0;
      if(game.loadedBlocks.indexOf(this.block) == -1) {
        game.loadedBlocks.push(this.block);
      };
      if(game.blockTypes[this.type]) {
        if(game.blockTypes[this.type][0] == false){
          this.block.visible = false;
        };
        if(game.blockTypes[this.type][1] == false){
          game.physics.world.remove(this.hitboxPhysics);
        };
      };
      this.isLoaded = true;
    };
    this.unload = function () {
      if(game.loadedBlocks.indexOf(this.block) != -1) {
        game.loadedBlocks.splice(game.loadedBlocks.indexOf(this.block), 1);
      };
      if(!this.isLoaded) return;
      if(this.hitboxPhysics) {
        game.physics.world.remove(this.hitboxPhysics);
      };
      this.block.visible = false;
      this.breakOverlay.visible = false;
      this.hitboxPhysics = undefined;
      this.isLoaded = false;
    };
    if(!game.getChunk(x, y, z)){
      this.chunk = new game.chunk(Math.floor(x/8)*8,Math.floor(z/8)*8, nogeneratechunk);
    } else {
      this.chunk = game.getChunk(x, y, z);
    };
    this.chunk.blocks.push(this);
    game.blocks[Object.keys(game.blocks).length+1] = this.block;
    game.blockObjects[Object.keys(game.blocks).length+1] = this;
    if(!game.blockGrid[x]){
      game.blockGrid[x] = {};
    };
    if(!game.blockGrid[x][y]){
      game.blockGrid[x][y] = {};
    };
    game.blockGrid[x][y][z] = this;
    this.oncreate = game.blockTypes[this.type][2];
    this.onbreak = game.blockTypes[this.type][3];
    this.hardness = game.blockTypes[this.type][4];
    this.delete = function (noaudio) {
      if(game.loadedBlocks.indexOf(this.block) != -1) {
        game.loadedBlocks.splice(game.loadedBlocks.indexOf(this.block), 1);
      };
      this.block.geometry.dispose();
      this.block.material.dispose();
      var particles = [];
      function particleInit(){
        for(let i = 0; i < game.maxBlockParticles; i++){
          if(this_.block.material == game.defaultMaterial){
            var material = new THREE.SpriteMaterial({
              map: game.materials.defaultMaterial.map,
              side: THREE.DoubleSide,
            });
          } else {
            var material = new THREE.SpriteMaterial({
              map: this_.block.material.map,
            });
          };
          var particle = new THREE.Sprite(material);
          particle.scale.set(0.25, 0.25, 0.25);
          particle.position.set(this_.block.position.x+Math.random()/2-0.5, this_.block.position.y+Math.random()/2-0.5, this_.block.position.z+Math.random()/2-0.5);
          particle.randX = (Math.random()/10-0.04)/2;
          particle.randZ = (Math.random()/10-0.04)/2;
          particle.fall = 0;
          game.scene.add(particle);
          particles.push(particle);
        };
      };
      var time = 0;
      function particleLoop(){
        time++
        if(time > 100){
          for(var i = 0; i < particles.length; i++){
            game.scene.remove(particles[i])
          };
          return;
        }
        for(var i = 0; i < particles.length; i++){
          particles[i].fall += 0.001
          particles[i].position.y += 0.025-particles[i].fall
          particles[i].position.x += particles[i].randX
          particles[i].position.z += particles[i].randZ
        };
        setTimeout(particleLoop, 10);
      }
      particleLoop();
      particleInit();
      if(game.blockTypes[this.type]){
        this.onbreak();
      };
      if(!noaudio) {
        game.UI.sound(this.type+Math.round(Math.random()*2+1));
      };
      this.chunk.blocks.splice(this.chunk.blocks.indexOf(this), 1);
      var b = this.block;
      game.scene.remove(this.breakOverlay);
      this.block.position.y = -255;
      setTimeout(function(){b.removeFromParent()}, 1000);
      game.blockGrid[x][y][z] = undefined;
      if(this.hitboxPhysics) {
        game.physics.world.remove(this.hitboxPhysics);
      };
      for(var i in this){
        delete this_[i];
      };
      this_[0] = "deleted";
    };
    if(game.blockTypes[this.type]){
      this.oncreate();
    };
    //return block;
    if(this.chunk.isLoaded){
      this.load();
    };
  };
};
game.chunk = class {
  constructor (x, z, nogeneratechunk){
    if(!game.chunkGrid[x]){
      game.chunkGrid[x] = {};
    };
    if(!game.chunkGrid[x][z]){
      game.chunkGrid[x][z] = this;
    } else {
      return;
    };
    game.chunks.push(this);
    this.blocks = [];
    this.x = x;
    this.z = z;
    this.isLoaded = false;
    this.load = function () {
      if(this.isLoaded) return;
      this.blocks.forEach(function (block){
        block.load();
      });
      this.isLoaded = true;
    };
    this.unload = function () {
      if(!this.isLoaded) return;
      this.blocks.forEach(function (block){
        block.unload();
      });
      this.isLoaded = false;
    };
    if(!nogeneratechunk) {
      game.generation.generate(x, z);
    };
  };
};
document.addEventListener("mousemove", event => {
  game.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  game.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  if(game.controls.selection == "FreeCam" || game.controls.selection == "Player"){
    game.mouse.x = 0;
    game.mouse.y = 0;
  };
  game.raycaster.setFromCamera(game.mouse, game.camera);
});
game.mousedownID = -1;  //Global ID of mouse down interval
game.blockmousedown = function (event) {
  if(game.mousedownID==-1)  //Prevent multimple loops!
     game.mousedownID = setInterval(function(){game.whilemousedown(event)}, 300 /*execute every 300ms*/);
}
game.blockmouseup = function (event) {
   if(game.mousedownID!=-1) {  //Only stop if exists
     clearInterval(game.mousedownID);
     game.mousedownID=-1;
   };
   if(game.lastBlockSelected) {
     game.lastBlockSelected.breakOverlay.material = game.materials["textures/break0.png"];
     game.lastBlockSelected.break = 0;
  };
  game.player.entityData.handActionCooldown = false;
};
game.whilemousedown = function(event) {
  if(game.controls.PointerLock.isLocked == false){
    return;
  };
  var objects = Object.values(game.loadedBlocks)
  for(var loop = 0; loop < game.entities.length; loop++){
    if(game.entities[loop] && game.entities[loop][0] != "deleted"){
      objects.push(game.entities[loop].hitboxCombat);
    };
  };
  var intersects = game.raycaster.intersectObjects(objects);
  if(event.button == 2){
    if (intersects.length > 0 && intersects[0].distance <= game.range && !intersects[0].object.entity) {
      //var pos = new THREE.Vector3(Math.round(game.player.getPosition().position[0]), Math.round(game.player.getPosition().position[1]), Math.round(game.player.getPosition().position[2]));
      //if(pos.equals(new THREE.Vector3(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z))){
        //return;
      //};
      //new game.block(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z, game.UI.selection, true);
    };
  } else {
    if(event.button == 0){
      if (intersects.length > 0 && intersects[0].distance <= game.range && !intersects[0].object.entity) {
        game.lastBlockSelected = intersects[0].object.block;
        if(!game.player.entityData.handActionCooldown){
          game.player.entityData.handActionCooldown = true;
          game.player.stopAnimations();
          game.player.playAnimation("handAction", 5);
          setTimeout(function(){game.player.playAnimation("handAction", 3, 0)}, 130);
          setTimeout(function(){game.player.entityData.handActionCooldown = false}, 100);
        };
        if(game.player.inventory.slots[game.player.inventory.selection] && game.player.inventory.slots[game.player.inventory.selection].miningExceptions[intersects[0].object.block.type]){
          intersects[0].object.block.break += game.player.inventory.slots[game.player.inventory.selection].miningExceptions[intersects[0].object.block.type];
        } else {
          intersects[0].object.block.break += 0.1;
        };
        if(intersects[0].object.block.break >= intersects[0].object.block.hardness){
          intersects[0].object.block.inventory.dropAll(true);
          intersects[0].object.block.delete();
        };
        game.UI.sound(intersects[0].object.block.type+Math.round(Math.random()*2+1), 0.5);
        if(!game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"]) game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"), alphaTest: 0.5});
        intersects[0].object.block.breakOverlay.material = game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"];
      };
    };
  };
}
game.renderer.domElement.addEventListener("mousedown", game.blockmousedown);
game.renderer.domElement.addEventListener("mouseup", game.blockmouseup);
game.renderer.domElement.addEventListener("mouseout", game.blockmouseup);