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
    this.type = type.toLowerCase();
    var test = new Image()
    test.src = "textures/"+type+".png"
    var this_ = this;
    test.onload = function () {
      if(game.materials[type]) {
        
      } else {
        game.materials[this.type] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+".png")});
      };
      this_.block.material = game.materials[this.type];
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
      if(game.blockTypes[this.type]){
        this.onbreak();
      };
      if(!noaudio) {
        game.UI.sound(this.type+Math.round(Math.random()*2+1));
      };
      this.block.position.y = -255;
      setTimeout(function(){game.scene.remove(this_.block)}, 1000);
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
  if(game.controls.selection == "FreeCam"){
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
      var pos = new THREE.Vector3(Math.round(game.player.getPosition().position[0]), Math.round(game.player.getPosition().position[1]), Math.round(game.player.getPosition().position[2]));
      if(pos.equals(new THREE.Vector3(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z))){
        return;
      };
      new game.block(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z, game.UI.selection, true);
    };
  } else {
    if(event.button == 0){
      if (intersects.length > 0 && intersects[0].distance <= game.range && !intersects[0].object.entity) {
        intersects[0].object.block.delete();
      };
    };
  };
});
