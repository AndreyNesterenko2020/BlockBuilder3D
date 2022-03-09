game.entities = {};
game.eulerQuaternion = function (rot) {
  var c1 = Math.cos(rot[1]*(Math.PI / 180)/2);
  var s1 = Math.sin(rot[1]*(Math.PI / 180)/2);
  var c2 = Math.cos(rot[2]*(Math.PI / 180)/2);
  var s2 = Math.sin(rot[2]*(Math.PI / 180)/2);
  var c3 = Math.cos(rot[0]*(Math.PI / 180)/2);
  var s3 = Math.sin(rot[0]*(Math.PI / 180)/2);
  var c1c2 = c1*c2;
  var s1s2 = s1*s2;
  var w =c1c2*c3 - s1s2*s3;
  var x =c1c2*s3 + s1s2*c3;
  var y =s1*c2*c3 + c1*s2*s3;
  var z =c1*s2*c3 - s1*c2*s3;
  return([x, y, z, w]);
};
game.quaternionEuler = function (q1) {
  var sqw = q1.w*q1.w;
  var sqx = q1.x*q1.x;
  var sqy = q1.y*q1.y;
  var sqz = q1.z*q1.z;
  var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
  var test = q1.x*q1.y + q1.z*q1.w;
  if (test > 0.499*unit) { // singularity at north pole
    var heading = 2 * Math.atan2(q1.x,q1.w) * (180/Math.PI);
    var attitude = Math.PI/2 * (180/Math.PI);
    var bank = 0;
    return([bank, heading, attitude]);
  }
  if (test < -0.499*unit) { // singularity at south pole
    var heading = -2 * Math.atan2(q1.x,q1.w) * (180/Math.PI);
    var attitude = -Math.PI/2 * (180/Math.PI);
    var bank = 0;
    return([bank, heading, attitude]);
  }
  var heading = Math.atan2(2*q1.y*q1.w-2*q1.x*q1.z , sqx - sqy - sqz + sqw) * (180/Math.PI);
  var attitude = Math.asin(2*test/unit) * (180/Math.PI);
  var bank = Math.atan2(2*q1.x*q1.w-2*q1.y*q1.z , -sqx + sqy - sqz + sqw) * (180/Math.PI);
  return([bank, heading, attitude]);
};
game.entity = class {
  constructor(type, pos, rot, name, noUseAI, oncreate, ondamage, ondeath){
    if(name == undefined){
      name = type;
    };
    if(pos == undefined){
      pos = [0, 10, 0];
    };
    if(rot == undefined){
      rot = [0, 0, 0];
    };
    if(typeof rot == "number"){
      rot = [0, rot, 0];
    };
    this.type = type;
    this.name = name;
    this.maxHealth = game.entityTypes[type][0];
    this.health = this.maxHealth;
    this.attackDamage = game.entityTypes[type][1];
    this.spawnPosition = pos;
    if(noUseAI){
      if(oncreate) {
        this.oncreate = oncreate;
        this.ondamage = ondamage;
        this.ondeath = ondeath;
      } else {
        this.oncreate = function(){};
        this.ondamage = function(){};
        this.ondeath = function(){};
      };
    } else{
      this.oncreate = game.entityTypes[type][3];
      this.ondamage = game.entityTypes[type][4];
      this.ondeath = game.entityTypes[type][5];
    };
    this.stoppingAnimations = false;
    this.movement = [0, 0, 0, 0];
    this.movementSpeed = game.entityTypes[type][6];
    var this_ = this;
    new THREE.GLTFLoader().load("models/"+type+".glb", function(glb){
      var object = glb["scene"].children[0];
      game.scene.add(object);
      this_.object = object;
      let transform = new Ammo.btTransform();
      transform.setIdentity();
      transform.setOrigin(new Ammo.btVector3(this_.spawnPosition[0], this_.spawnPosition[1], this_.spawnPosition[2]));
      transform.setRotation(new Ammo.btQuaternion(game.eulerQuaternion(rot)[0], game.eulerQuaternion(rot)[1], game.eulerQuaternion(rot)[2], game.eulerQuaternion(rot)[3]));
      let motionState = new Ammo.btDefaultMotionState(transform);
      let colShape = new Ammo.btBoxShape(new Ammo.btVector3(game.entityTypes[this_.type][2][0]/2, game.entityTypes[this_.type][2][1]/2, game.entityTypes[this_.type][2][2]/2));
      colShape.setMargin(0.05);
      let localInertia = new Ammo.btVector3(0, 0, 0);
      colShape.calculateLocalInertia(10, localInertia );
      let rbInfo = new Ammo.btRigidBodyConstructionInfo(10, motionState, colShape, localInertia);
      let body = new Ammo.btRigidBody(rbInfo);
      body.setAngularFactor(0, 0, 0);
      body.setFriction(0.25);
      game.physics.physicsWorld.addRigidBody(body); 
      this_.hitboxPhysics = body;
      this_.hitboxCombat = new THREE.Mesh(game.geometry);
      this_.hitboxCombat.material = new THREE.MeshPhongMaterial({color: "black", wireframe: true});
      this_.hitboxCombat.material.transparent = true;
      this_.hitboxCombat.entity = this_;
      this_.hitboxCombat.scale.set(game.entityTypes[type][2][0], game.entityTypes[type][2][1], game.entityTypes[type][2][2]);
      game.scene.add(this_.hitboxCombat);
      this_.range = game.entityTypes[type][7];
      this_.physicsEnabled = true;
      this_.hitboxDirection = new THREE.Line(new THREE.BoxGeometry(), new THREE.LineBasicMaterial({color: "black"}));
      this_.hitboxDirection.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]);
      this_.hitboxDirection.material.transparent = true;
      game.scene.add(this_.hitboxDirection);
      game.entities[Object.keys(game.entities).length+1] = this_;
      this_.animations = object.morphTargetInfluences;
      this_.animationDict = object.morphTargetDictionary;
      this_.playAnimation = function(name, speed, target){
        if(speed == undefined){
          speed = 1;
        };
        if(target == undefined){
          target = 1;
        };
        this_.stoppingAnimations = false;
        function loop(){
          if(this_.stoppingAnimations == true){
            return;
          };
          if(this_.animations[this_.animationDict[name]] != Math.abs(this_.animations[this_.animationDict[name]])){
            this_.animations[this_.animationDict[name]] = 0;
            return;
          };
          if(target < Math.ceil(this_.animations[this_.animationDict[name]] * 100) / 100){
            this_.animations[this_.animationDict[name]] -= 0.1;
          } else if(target > Math.ceil(this_.animations[this_.animationDict[name]] * 100) / 100){
            this_.animations[this_.animationDict[name]] += 0.1;
          } else if(Math.round(target) == Math.ceil(this_.animations[this_.animationDict[name]] * 100) / 100){
            return;
          };
          setTimeout(loop, 20/speed);
        };
        loop();
      };
      this_.stopAnimations = function () {
        this_.stoppingAnimations = true;
        for(var loop = 0; loop < this_.animations.length; loop++){
          this_.animations[loop] = 0;
        };
      };
      this_.setPosition = function(pos, rot) {
        if(rot == undefined){
          rot = [0, 0, 0];
        };
        if(typeof rot == "number"){
          rot = [0, rot, 0];
        };
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos[0], pos[1], pos[2]));
        transform.setRotation(new Ammo.btQuaternion(game.eulerQuaternion(rot)[0], game.eulerQuaternion(rot)[1], game.eulerQuaternion(rot)[2], game.eulerQuaternion(rot)[3]));
        this_.hitboxPhysics.setWorldTransform(transform);
      };
      this_.getPosition = function() {
        return({position: [this_.hitboxCombat.position.x, this_.hitboxCombat.position.y, this_.hitboxCombat.position.z], rotation: game.quaternionEuler(this_.hitboxCombat.quaternion)});
      };
      this_.attack = function (){
        var objects = Object.values(game.blocks);
        for(var loop = 1; loop <= Object.keys(game.entities).length; loop++){
          if(game.entities[loop] != this_){
            objects.push(game.entities[loop].hitboxCombat);
          };
        };
        var raycaster = new THREE.Raycaster();
        raycaster.set(this_.object.position, new THREE.Vector3(1, 0, 0).applyQuaternion(this_.hitboxCombat.quaternion), 0, this_.range);
        var intersects = raycaster.intersectObjects(objects);
        if(intersects[0] != undefined) {
          if(intersects[0].object.entity) {
            intersects[0].object.entity.health -= this_.attackDamage;
            intersects[0].object.entity.ondamage(this_);
            return intersects[0].object.entity;
          };
        };
      };
      this_.lookAt = function (pos, onlyY) {
        var obj = new THREE.Mesh();
        game.scene.add(obj)
        obj.geometry = new THREE.BoxGeometry;
        obj.position.set(this_.hitboxCombat.position.x, this_.hitboxCombat.position.y, this_.hitboxCombat.position.z);
        obj.rotation.set(this_.hitboxCombat.rotation.x, this_.hitboxCombat.rotation.y, this_.hitboxCombat.rotation.z);
        obj.lookAt(new THREE.Vector3(pos[0], pos[1], pos[2]));
        var rot = [game.quaternionEuler(obj.quaternion)[2], game.quaternionEuler(obj.quaternion)[1]-90, -game.quaternionEuler(obj.quaternion)[0]];
        if(onlyY) {
          rot = [0, rot[1], 0];
        };
        this_.setPosition(this_.getPosition().position, rot);
        game.scene.remove(obj);
      };
      this_.oncreate();
    });
  };
};
game.entityPhysics = function(){
    setTimeout(game.entityPhysics, 1);
    game.physics.physicsWorld.stepSimulation(game.clock.getDelta(), 10 );
    for (let i = 1; i < Object.keys(game.entities).length + 1; i++) {
        game.entities[i].hitboxDirection.scale.x = game.entities[i].range;
        if(game.debug == true){
          game.entities[i].hitboxCombat.material.opacity = 1;
          game.entities[i].hitboxDirection.material.opacity = 1;
        } else {
          game.entities[i].hitboxCombat.material.opacity = 0;
          game.entities[i].hitboxDirection.material.opacity = 0;
        };
        if(game.entities[i].health < 0){
          game.entities[i].health = 0;
        };
        if(game.entities[i].health > game.entities[i].maxHealth){
          game.entities[i].health = game.entities[i].maxHealth;
        };
        if(game.entities[i].health == 0){
          game.entities[i].ondeath();
          game.entities[i].oncreate = function(){};
          game.entities[i].ondamage = function(){};
          game.entities[i].ondeath = function(){};
        };
        if(game.entities[i].movement[0] > 1){
          game.entities[i].movement[0] = 1;
        };
        if(game.entities[i].movement[1] > 1){
          game.entities[i].movement[1] = 1;
        };
        if(game.entities[i].movement[2] > 1){
          game.entities[i].movement[2] = 1;
        };
        if(game.entities[i].movement[3] > 1){
          game.entities[i].movement[3] = 1;
        };
        if(game.entities[i].movement[0] < 0){
          game.entities[i].movement[0] = 0;
        };
        if(game.entities[i].movement[1] < 0){
          game.entities[i].movement[1] = 0;
        };
        if(game.entities[i].movement[2] < 0){
          game.entities[i].movement[2] = 0;
        };
        if(game.entities[i].movement[3] < 0){
          game.entities[i].movement[3] = 0;
        };
        let objThree = game.entities[i].object;
        let objAmmo = game.entities[i].hitboxPhysics;
        let motion = objAmmo.getMotionState();
        game.entities[i].hitboxCombat.updateMatrixWorld();
        if (motion && game.entities[i].physicsEnabled) {
            motion.getWorldTransform(game.physics.tmpTrans);
            objThree.position.set(game.physics.tmpTrans.getOrigin().x(), game.physics.tmpTrans.getOrigin().y(), game.physics.tmpTrans.getOrigin().z());
            game.entities[i].hitboxCombat.position.set(game.physics.tmpTrans.getOrigin().x(), game.physics.tmpTrans.getOrigin().y(), game.physics.tmpTrans.getOrigin().z());
            game.entities[i].hitboxDirection.position.set(game.physics.tmpTrans.getOrigin().x(), game.physics.tmpTrans.getOrigin().y(), game.physics.tmpTrans.getOrigin().z());
            objThree.quaternion.set(game.physics.tmpTrans.getRotation().x(), game.physics.tmpTrans.getRotation().y(), game.physics.tmpTrans.getRotation().z(), game.physics.tmpTrans.getRotation().w());
            game.entities[i].hitboxCombat.quaternion.set(game.physics.tmpTrans.getRotation().x(), game.physics.tmpTrans.getRotation().y(), game.physics.tmpTrans.getRotation().z(), game.physics.tmpTrans.getRotation().w());
            game.entities[i].hitboxDirection.quaternion.set(game.physics.tmpTrans.getRotation().x(), game.physics.tmpTrans.getRotation().y(), game.physics.tmpTrans.getRotation().z(), game.physics.tmpTrans.getRotation().w());
            var temporaryEuler = new THREE.Vector3((game.entities[i].movement[0] - game.entities[i].movement[1]) * game.entities[i].movementSpeed, 0, (game.entities[i].movement[2] - game.entities[i].movement[3]) * game.entities[i].movementSpeed).applyQuaternion(game.entities[i].hitboxCombat.quaternion);
            if(game.entities[i].health != 0) {
              objAmmo.setLinearVelocity(new Ammo.btVector3(temporaryEuler.x, objAmmo.getLinearVelocity().y(), temporaryEuler.z));
            } else {
              objAmmo.setLinearVelocity(new Ammo.btVector3(0, objAmmo.getLinearVelocity().y(), 0));
            };
        };
    };
};
