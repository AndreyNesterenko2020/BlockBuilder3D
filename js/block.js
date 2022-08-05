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
    var inventory = false;
    if(!!block.inventory){
      inventory = [];
      Object.values(block.inventory.slots).forEach(function (item) {
        if(!item) return;
        inventory.push({type: item.type, amount: item.amount, slot: item.slot});
      });
    };
    data.push({type: block.type, x: block.block.position.x, y: block.block.position.y, z: block.block.position.z, hasInventory: !!block.inventory, slots: !!block.inventory&&block.inventory.maxSlots, inventory: inventory});
  });
  return JSON.stringify(data);
};
game.blockLoad = function (data) {
  try {
    JSON.parse(data).forEach(function (block){
      var block0 = new game.block(block.x, block.y, block.z, block.type, false, true);
      if(block0.inventory) block0.inventory.delete(true);
      new game.inventory(block0, block.slots);
      if(block.hasInventory){
        block.inventory.forEach(function (item){
          new game.item(item.type, block0.inventory, item.amount, true);
        });
      };
    });
    return true;
  } catch (error) {
    return false;
  };
};
game.block = class {
  constructor (x,y,z, type, audio, nogeneratechunk, override) {
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);
    if(game.getBlock(x, y, z)) {
      if(override) {
        game.getBlock(x, y, z).delete(true);
      } else {
        return;
      };
    };
    this.block = new THREE.Mesh(game.geometry);
    this.breakOverlay = new THREE.Mesh(game.geometry);
    if(!game.materials["textures/break0.png"]) game.materials["textures/break0.png"] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/break0.png"), transparent: true});
    this.breakOverlay.position.set(x, y, z);
    this.breakOverlay.material = game.materials["textures/break0.png"];
    //game.scene.add(this.breakOverlay);
    this.block.visible = false;
    this.breakOverlay.visible = false;
    this.breakOverlay.scale.set(1.00005, 1.00005, 1.00005);
    this.object = this.block;
    this.getPosition = function (){
      return({position:[x-0.5,y,z], rotation:[0, 0, 0]})
    };
    this.type = type.toLowerCase();
    if((game.blockTypes[type] && !game.blockTypes[type][6]) || !game.blockTypes[type]) { 
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
    } else {
      var test = new Image();
      test.src = "textures/"+type+"_positive_x.png"
      var this_ = this;
      new game.inventory(this, 1);
      if(game.itemTypes[this.type]){
        new game.item(this.type, this.inventory);
      };
      test.onload = function () {
        var materials = [
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_positive_x.png"), transparent: true}),
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_negative_x.png"), transparent: true}),
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_positive_y.png"), transparent: true}),
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_negative_y.png"), transparent: true}),
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_positive_z.png"), transparent: true}),
          new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+"_negative_z.png"), transparent: true}),
        ];
        this_.block.material = materials;
      };
      test.onerror = function (){
        this_.block.material = game.materials.defaultMaterial;
      };
    };
    if(audio) {
      game.UI.sound(this.type+Math.round(Math.random()*2+1));
    };
    this.block.position.x = x;
    this.block.position.y = y;
    this.block.position.z = z;
    this.block.block = this;
    //game.scene.add(this.block);
    this.isLoaded = false;
    this.load = function (nophysics) {
      if(nophysics) {
        if(this.isLoaded == "semi") return
      };
      if(!nophysics) {
        if(this.isLoaded == true) return
      };
      //check if block has at least one open face
      var check = false;
      if(!game.getBlock(x-1,y,z) || (game.getBlock(x-1,y,z) && game.getBlock(x-1,y,z).noOcclude)) check = true;
      if(!game.getBlock(x+1,y,z) || (game.getBlock(x+1,y,z) && game.getBlock(x+1,y,z).noOcclude)) check = true;
      if(!game.getBlock(x,y-1,z) || (game.getBlock(x,y-1,z) && game.getBlock(x,y-1,z).noOcclude)) check = true;
      if(!game.getBlock(x,y+1,z) || (game.getBlock(x,y+1,z) && game.getBlock(x,y+1,z).noOcclude)) check = true;
      if(!game.getBlock(x,y,z-1) || (game.getBlock(x,y,z-1) && game.getBlock(x,y,z-1).noOcclude)) check = true;
      if(!game.getBlock(x,y,z+1) || (game.getBlock(x,y,z+1) && game.getBlock(x,y,z+1).noOcclude)) check = true;
      //check if all neighbors have at least one open face
      if(check && !this.noOcclude) {
        //neighbor at negative x
        var checkNegX = false;
        if(game.getBlock(x-1,y,z)) {
          if(!game.getBlock(x-2,y,z) || (game.getBlock(x-2,y,z) && game.getBlock(x-2,y,z).noOcclude)) checkNegX = true;
          if(!game.getBlock(x,y,z) || (game.getBlock(x,y,z) && game.getBlock(x,y,z).noOcclude)) checkNegX = true;
          if(!game.getBlock(x-1,y-1,z) || (game.getBlock(x-1,y-1,z) && game.getBlock(x-1,y-1,z).noOcclude)) checkNegX = true;
          if(!game.getBlock(x-1,y+1,z) || (game.getBlock(x-1,y+1,z) && game.getBlock(x-1,y+1,z).noOcclude)) checkNegX = true;
          if(!game.getBlock(x-1,y,z-1) || (game.getBlock(x-1,y,z-1) && game.getBlock(x-1,y,z-1).noOcclude)) checkNegX = true;
          if(!game.getBlock(x-1,y,z+1) || (game.getBlock(x-1,y,z+1) && game.getBlock(x-1,y,z+1).noOcclude)) checkNegX = true;
          if(!checkNegX) {game.getBlock(x-1,y,z).block.visible = false; game.getBlock(x-1,y,z).breakOverlay.visible = false; game.getBlock(x-1,y,z).occluded = this; game.scene.remove(game.getBlock(x-1,y,z).block); game.scene.remove(game.getBlock(x-1,y,z).breakOverlay);}
        };
        //neighbor at positive x
        var checkPosX = false;
        if(game.getBlock(x+1,y,z)) {
          if(!game.getBlock(x+2,y,z) || (game.getBlock(x+2,y,z) && game.getBlock(x+2,y,z).noOcclude)) checkPosX = true;
          if(!game.getBlock(x,y,z) || (game.getBlock(x,y,z) && game.getBlock(x,y,z).noOcclude)) checkPosX = true;
          if(!game.getBlock(x+1,y-1,z) || (game.getBlock(x+1,y-1,z) && game.getBlock(x+1,y-1,z).noOcclude)) checkPosX = true;
          if(!game.getBlock(x+1,y+1,z) || (game.getBlock(x+1,y+1,z) && game.getBlock(x+1,y+1,z).noOcclude)) checkPosX = true;
          if(!game.getBlock(x+1,y,z-1) || (game.getBlock(x+1,y,z-1) && game.getBlock(x+1,y,z-1).noOcclude)) checkPosX = true;
          if(!game.getBlock(x+1,y,z+1) || (game.getBlock(x+1,y,z+1) && game.getBlock(x+1,y,z+1).noOcclude)) checkPosX = true;
          if(!checkPosX) {game.getBlock(x+1,y,z).block.visible = false; game.getBlock(x+1,y,z).breakOverlay.visible = false; game.getBlock(x+1,y,z).occluded = this; game.scene.remove(game.getBlock(x+1,y,z).block); game.scene.remove(game.getBlock(x+1,y,z).breakOverlay);}
        };
        //neighbor at negative y
        var checkNegY = false;
        if(game.getBlock(x,y-1,z)) {
          if(!game.getBlock(x-1,y-1,z) || (game.getBlock(x-1,y,z) && game.getBlock(x-1,y,z).noOcclude)) checkNegY = true;
          if(!game.getBlock(x+1,y-1,z) || (game.getBlock(x+1,y,z) && game.getBlock(x-1,y,z).noOcclude)) checkNegY = true;
          if(!game.getBlock(x,y-2,z) || (game.getBlock(x,y-2,z) && game.getBlock(x,y-2,z).noOcclude)) checkNegY = true;
          if(!game.getBlock(x,y,z) || (game.getBlock(x,y,z) && game.getBlock(x,y,z).noOcclude)) checkNegY = true;
          if(!game.getBlock(x,y-1,z-1) || (game.getBlock(x,y-1,z-1) && game.getBlock(x,y-1,z-1).noOcclude)) checkNegY = true;
          if(!game.getBlock(x,y-1,z+1) || (game.getBlock(x,y-1,z+1) && game.getBlock(x,y-1,z+1).noOcclude)) checkNegY = true;
          if(!checkNegY) {game.getBlock(x,y-1,z).block.visible = false; game.getBlock(x,y-1,z).breakOverlay.visible = false; game.getBlock(x,y-1,z).occluded = this; game.scene.remove(game.getBlock(x,y-1,z).block); game.scene.remove(game.getBlock(x,y-1,z).breakOverlay);}
        };
        //neighbor at positive y
        var checkPosY = false;
        if(game.getBlock(x,y+1,z)) {
          if(!game.getBlock(x-1,y+1,z) || (game.getBlock(x-1,y+1,z) && game.getBlock(x-1,y+1,z).noOcclude)) checkPosY = true;
          if(!game.getBlock(x+1,y+1,z) || (game.getBlock(x+1,y+1,z) && game.getBlock(x+1,y+1,z).noOcclude)) checkPosY = true;
          if(!game.getBlock(x,y+2,z) || (game.getBlock(x,y+2,z) && game.getBlock(x,y+2,z).noOcclude)) checkPosY = true;
          if(!game.getBlock(x,y,z) || (game.getBlock(x,y,z) && game.getBlock(x,y,z).noOcclude)) checkPosY = true;
          if(!game.getBlock(x,y+1,z-1) || (game.getBlock(x,y+1,z-1) && game.getBlock(x,y+1,z-1).noOcclude)) checkPosY = true;
          if(!game.getBlock(x,y+1,z+1) || (game.getBlock(x,y+1,z+1) && game.getBlock(x,y+1,z+1).noOcclude)) checkPosY = true;
          if(!checkPosY) {game.getBlock(x,y+1,z).block.visible = false; game.getBlock(x,y+1,z).breakOverlay.visible = false; game.getBlock(x,y+1,z).occluded = this; game.scene.remove(game.getBlock(x,y+1,z).block); game.scene.remove(game.getBlock(x,y+1,z).breakOverlay);}
        };
        //neighbor at negative z
        var checkNegZ = false;
        if(game.getBlock(x,y,z-1)) {
          if(!game.getBlock(x-1,y,z-1) || (game.getBlock(x-1,y,z-1) && game.getBlock(x-1,y,z-1).noOcclude)) checkNegZ = true;
          if(!game.getBlock(x+1,y,z-1) || (game.getBlock(x+1,y,z-1) && game.getBlock(x+1,y,z-1).noOcclude)) checkNegZ = true;
          if(!game.getBlock(x,y-1,z-1) || (game.getBlock(x,y-1,z-1) && game.getBlock(x,y-1,z-1).noOcclude)) checkNegZ = true;
          if(!game.getBlock(x,y+1,z-1) || (game.getBlock(x,y+1,z-1) && game.getBlock(x,y+1,z-1).noOcclude)) checkNegZ = true;
          if(!game.getBlock(x,y,z-2) || (game.getBlock(x,y,z-2) && game.getBlock(x,y,z-2).noOcclude)) checkNegZ = true;
          if(!game.getBlock(x,y,z) || (game.getBlock(x,y,z) && game.getBlock(x,y,z).noOcclude)) checkNegZ = true;
          if(!checkNegZ) {game.getBlock(x,y,z-1).block.visible = false; game.getBlock(x,y,z-1).breakOverlay.visible = false; game.getBlock(x,y,z-1).occluded = this; game.scene.remove(game.getBlock(x,y,z-1).block); game.scene.remove(game.getBlock(x,y,z-1).breakOverlay);}
        }; 
        //neighbor at positive z
        var checkPosZ = false;
        if(game.getBlock(x,y,z+1)) {
          if(!game.getBlock(x-1,y,z+1) || (game.getBlock(x-1,y,z+1) && game.getBlock(x-1,y,z+1).noOcclude)) checkPosZ = true;
          if(!game.getBlock(x+1,y,z+1) || (game.getBlock(x+1,y,z+1) && game.getBlock(x+1,y,z+1).noOcclude)) checkPosZ = true;
          if(!game.getBlock(x,y-1,z+1) || (game.getBlock(x,y-1,z+1) && game.getBlock(x,y-1,z+1).noOcclude)) checkPosZ = true;
          if(!game.getBlock(x,y+1,z+1) || (game.getBlock(x,y+1,z+1) && game.getBlock(x,y+1,z+1).noOcclude)) checkPosZ = true;
          if(!game.getBlock(x,y,z+2) || (game.getBlock(x,y,z+2) && game.getBlock(x,y,z+2).noOcclude)) checkPosZ = true;
          if(!game.getBlock(x,y,z)) checkPosZ = true;
          if(!checkPosZ) {game.getBlock(x,y,z+1).block.visible = false; game.getBlock(x,y,z+1).breakOverlay.visible = false; game.getBlock(x,y,z+1).occluded = this; game.scene.remove(game.getBlock(x,y,z+1).block); game.scene.remove(game.getBlock(x,y,z+1).breakOverlay);}
        };
      };
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
      if(!nophysics) {
        var body = new CANNON.Body({mass: 0});
        body.position.set(x, y, z);
        body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
        game.physics.world.add(body);
        this.hitboxPhysics = body;
      };
      this.block.visible = check;
      if(check){
        game.scene.add(this.block);
        game.scene.add(this.breakOverlay);
      };
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
      if(!nophysics) {
        this.isLoaded = true;
      } else {
        this.isLoaded = "semi";
      };
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
      game.scene.remove(this.block);
      game.scene.remove(this.breakOverlay);
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
    if(game.blockTypes[this.type]) {
      this.oncreate = game.blockTypes[this.type][2];
      this.onbreak = game.blockTypes[this.type][3];
      this.hardness = game.blockTypes[this.type][4];
      this.requiredItem = game.blockTypes[this.type][5];
      this.noOcclude = game.blockTypes[this.type][7];
    };
    this.delete = function (noaudio) {
      //make all neighbors visible
      var check = false;
      if(game.getBlock(x-1,y,z)){ if((game.blockTypes[game.getBlock(x-1,y,z).type] && game.blockTypes[game.getBlock(x-1,y,z).type][0]) || !game.blockTypes[game.getBlock(x-1,y,z).type]) {game.getBlock(x-1,y,z).block.visible = true}; game.scene.add(game.getBlock(x-1,y,z).block); game.scene.add(game.getBlock(x-1,y,z).breakOverlay); game.getBlock(x-1,y,z).occluded = false;}
      if(game.getBlock(x+1,y,z)){ if((game.blockTypes[game.getBlock(x+1,y,z).type] && game.blockTypes[game.getBlock(x+1,y,z).type][0]) || !game.blockTypes[game.getBlock(x+1,y,z).type]) {game.getBlock(x+1,y,z).block.visible = true}; game.scene.add(game.getBlock(x+1,y,z).block); game.scene.add(game.getBlock(x+1,y,z).breakOverlay); game.getBlock(x+1,y,z).occluded = false;}
      if(game.getBlock(x,y-1,z)){ if((game.blockTypes[game.getBlock(x,y-1,z).type] && game.blockTypes[game.getBlock(x,y-1,z).type][0]) || !game.blockTypes[game.getBlock(x,y-1,z).type]) {game.getBlock(x,y-1,z).block.visible = true}; game.scene.add(game.getBlock(x,y-1,z).block); game.scene.add(game.getBlock(x,y-1,z).breakOverlay); game.getBlock(x,y-1,z).occluded = false;}
      if(game.getBlock(x,y+1,z)){ if((game.blockTypes[game.getBlock(x,y+1,z).type] && game.blockTypes[game.getBlock(x,y+1,z).type][0]) || !game.blockTypes[game.getBlock(x,y+1,z).type]) {game.getBlock(x,y+1,z).block.visible = true}; game.scene.add(game.getBlock(x,y+1,z).block); game.scene.add(game.getBlock(x,y+1,z).breakOverlay); game.getBlock(x,y+1,z).occluded = false;}
      if(game.getBlock(x,y,z-1)){ if((game.blockTypes[game.getBlock(x,y,z-1).type] && game.blockTypes[game.getBlock(x,y,z-1).type][0]) || !game.blockTypes[game.getBlock(x,y,z-1).type]) {game.getBlock(x,y,z-1).block.visible = true}; game.scene.add(game.getBlock(x,y,z-1).block); game.scene.add(game.getBlock(x,y,z-1).breakOverlay); game.getBlock(x,y,z-1).occluded = false;}
      if(game.getBlock(x,y,z+1)){ if((game.blockTypes[game.getBlock(x,y,z+1).type] && game.blockTypes[game.getBlock(x,y,z+1).type][0]) || !game.blockTypes[game.getBlock(x,y,z+1).type]) {game.getBlock(x,y,z+1).block.visible = true}; game.scene.add(game.getBlock(x,y,z+1).block); game.scene.add(game.getBlock(x,y,z+1).breakOverlay); game.getBlock(x,y,z+1).occluded = false;}
      if(game.loadedBlocks.indexOf(this.block) != -1) {
        game.loadedBlocks.splice(game.loadedBlocks.indexOf(this.block), 1);
      };
      this.block.geometry.dispose();
      try {
        this.block.material.dispose();
      } catch (e){};
      var particles = [];
      function particleInit(){
        for(let i = 0; i < game.maxBlockParticles; i++){
          if(!this_.block.material[0]) {
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
          } else {
            var material = new THREE.SpriteMaterial({
              map: this_.block.material[0].map,
              side: THREE.DoubleSide,
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
    this.load = function (nophysics) {
      if(nophysics) {
        if(this.isLoaded == "semi") return
      };
      if(!nophysics) {
        if(this.isLoaded == true) return
      };
      this.blocks.forEach(function (block){
        block.load(nophysics);
      });
      if(!nophysics) {
        this.isLoaded = true;
      } else {
        this.isLoaded = "semi";
      };
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
     game.lastBlockSelected.breakOverlay.visible = false;
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
          if(game.gamemode == 0) {
            intersects[0].object.block.break += 0.1;
          } else if(game.gamemode == 1){
            intersects[0].object.block.break += Infinity;
          }
        };
        if(intersects[0].object.block.break >= intersects[0].object.block.hardness){
          if(game.player.inventory && !game.player.inventory.slots[game.player.inventory.selection]) {
            if(intersects[0].object.block.requiredItem[0] == "*") {
              intersects[0].object.block.inventory.dropAll(true);
            };
          } else if(game.player.inventory && (intersects[0].object.block.requiredItem.indexOf(game.player.inventory.slots[game.player.inventory.selection].type) != -1) || intersects[0].object.block.requiredItem[0] == "*") {
            intersects[0].object.block.inventory.dropAll(true);
          };
          intersects[0].object.block.delete();
          game.UI.achievement("Demolition", "Break your first block", "break6.png");
        };
        game.UI.sound(intersects[0].object.block.type+Math.round(Math.random()*2+1), 0.5);
        if(!game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"]) game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"), alphaTest: 0.5});
        intersects[0].object.block.breakOverlay.material = game.materials["textures/break"+Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10)+".png"];
        if(Math.round((intersects[0].object.block.break/intersects[0].object.block.hardness)*10) == 0) {
          intersects[0].object.block.breakOverlay.visible = false;
        } else {
          intersects[0].object.block.breakOverlay.visible = true;
        };
      };
    };
  };
}
game.renderer.domElement.addEventListener("mousedown", game.blockmousedown);
game.renderer.domElement.addEventListener("mouseup", game.blockmouseup);
game.renderer.domElement.addEventListener("mouseout", game.blockmouseup);