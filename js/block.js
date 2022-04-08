game.mouse = new THREE.Vector2();
game.getBlock = function (x, y, z) {
  for(var i = 1; i < Object.values(game.blockObjects).length+1; i++){
      if(!game.blockObjects[i]){
        continue;
      };
      if(game.blockObjects[i][0]){
        continue;
      };
      if(game.blockObjects[i].block.position.x == x && game.blockObjects[i].block.position.y == y && game.blockObjects[i].block.position.z == z){
        return game.blockObjects[i];
      };
  };
  return false;
};
game.block = class {
  constructor (x,y,z, type, audio) {
    if(game.getBlock(x, y, z)) {
      return;
    };
    this.block = new THREE.Mesh(game.geometry);
    this.object = this.block;
    this.getPosition = function (){
      return({position:[x-0.5,y,z], rotation:[0, 0, 90]})
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
      if(game.materials[type]) {
        
      } else {
        game.materials[this_.type] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+".png")});
      };
      this_.block.material = game.materials[this_.type];
    };
    test.onerror = function (){
      this_.block.material = game.materials.defaultMaterial;
    };
    if(!game.blockTypes[this.type]) {
      this.block.material = game.materials.defaultMaterial;
    };
    if(audio) {
      game.UI.sound(this.type+Math.round(Math.random()*2+1));
    };
    this.block.position.x = x;
    this.block.position.y = y;
    this.block.position.z = z;
    this.block.block = this;
    game.scene.add(this.block);
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
    game.blocks[Object.keys(game.blocks).length+1] = this.block;
    game.blockObjects[Object.keys(game.blocks).length+1] = this;
    this.hitboxPhysics = body;
    if(game.blockTypes[this.type]) {
      this.oncreate = game.blockTypes[this.type][2];
      this.onbreak = game.blockTypes[this.type][3];
      if(game.blockTypes[this.type][0] == false){
        this.block.visible = false;
      };
      if(game.blockTypes[this.type][1] == false){
        game.physics.physicsWorld.removeRigidBody(this.hitboxPhysics.a);
      };
    };
    this.delete = function (noaudio) {
      var particles = []
      function particleInit(){
        for(let i = 0; i < 10; i++){
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
      var b = this.block;
      this.block.position.y = -255;
      setTimeout(function(){game.scene.remove(b)}, 1000);
      game.physics.physicsWorld.removeRigidBody(this.hitboxPhysics.a);
      for(var i in this){
        delete this_[i];
      };
      this_[0] = "deleted";
    };
    if(game.blockTypes[this.type]){
      this.oncreate();
    };
    //return block;
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
        intersects[0].object.block.inventory.dropAll();
        intersects[0].object.block.delete();
      };
    };
  };
});
