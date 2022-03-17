game.mouse = new THREE.Vector2();
game.block = function (x,y,z, type){
  var block = new THREE.Mesh(game.geometry);
  var test = new Image()
  test.src = "textures/"+type+".png"
  test.onload = function () {
    if(game.materials[type]) {
      
    } else {
      game.materials[type] = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type.toLowerCase()+".png")});
    };
    block.material = game.materials[type];
  };
  test.onerror = function (){
    block.material = game.materials.defaultMaterial;
  };
  block.position.x = x;
  block.position.y = y;
  block.position.z = z;
  game.scene.add(block);
  transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin( new Ammo.btVector3(x, y, z) );
  transform.setRotation( new Ammo.btQuaternion(0, 0, 0, 1) );
  motionState = new Ammo.btDefaultMotionState( transform );
  colShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
  colShape.setMargin(0.05);
  localInertia = new Ammo.btVector3( 0, 0, 0 );
  colShape.calculateLocalInertia(0, localInertia );
  rbInfo = new Ammo.btRigidBodyConstructionInfo(0, motionState, colShape, localInertia);
  body = new Ammo.btRigidBody( rbInfo );
  body.setActivationState(4);
  body.setCollisionFlags(2);
  game.physics.physicsWorld.addRigidBody(body);
  game.blocks[Object.keys(game.blocks).length+1] = block;
  block.hitboxPhysics = body;
  return block;
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
  var intersects = game.raycaster.intersectObjects(Object.values(game.blocks));
  if(event.button == 2){
    if (intersects.length > 0 && intersects[0].distance <= game.range) {
      game.block(intersects[0].object.position.x + intersects[0].face.normal.x, intersects[0].object.position.y + intersects[0].face.normal.y, intersects[0].object.position.z + intersects[0].face.normal.z, game.UI.selection);
    };
  } else {
    if(event.button == 0){
      if (intersects.length > 0 && intersects[0].distance <= game.range) {
        intersects[0].object.position.y = -255;
        game.physics.physicsWorld.removeRigidBody(intersects[0].object.hitboxPhysics.a);
      };
    };
  };
});
