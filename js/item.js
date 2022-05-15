game.item = class {
  constructor(type, inventory, amount, noCreateEvent){
    if(!game.itemTypes[type]){
      return;
    };
    this.type = type;
    if(!amount) {
      amount = 1;
    };
    this.amount = amount;
    this.inventory = inventory;
    var this_ = this;
    for(var i = 1; i < inventory.maxSlots+1; i++){
      if(inventory.slots[i] == null){
        inventory.slots[i] = this;
        this.slot = i;
        break;
      } else {
        if(inventory.slots[i].type == this_.type){
          inventory.slots[i].amount += this.amount;
          return;
        };
      };
    };
    this.delete = function (noEvent){
      if(!noEvent){
        this.ondelete();
      };
      inventory.slots[this_.slot] = null;
      for(var i in this_){
          delete this_[i];
      };
    };
    this.use = function () {
      this.amount -= 1;
      if(this.amount == 0) {
        this.delete();
      };
    };
    this.drop = function (all, nothrow){
      this.ondropped();
      var pos = new THREE.Vector3(0.5, 0, 0).applyQuaternion(inventory.object.object.quaternion).add(new THREE.Vector3(inventory.object.getPosition().position[0], inventory.object.getPosition().position[1], inventory.object.getPosition().position[2]));
      var rot = inventory.object.getPosition().rotation;
      var entity = new game.entity("item", [pos.x, pos.y, pos.z], rot, type);
      if(!nothrow)entity.movement[0]=1;
      setTimeout(function() {
        if(entity.movement){
          entity.movement[0]=0;
        };
      }, 1000);
      setTimeout(function (){
        entity.object.material = new THREE.MeshLambertMaterial({map: game.textureLoader.load("textures/"+type+".png")});
      }, 200);
      if(!all){
        this.amount -= 1;
      } else {
        entity.itemAmount = this.amount;
        this.delete(true);
      };
      if(this.amount == 0){
        this.delete(true);
      };
    };
    this.oncreate = game.itemTypes[this.type][0];
    this.leftuse = game.itemTypes[this.type][1];
    this.rightuse = game.itemTypes[this.type][2];
    this.ondropped = game.itemTypes[this.type][3];
    this.ondelete = game.itemTypes[this.type][4];
    this.onpickup = game.itemTypes[this.type][5];
    if(!noCreateEvent) {
      this.oncreate();
    };
  };
};
game.inventory = class {
  constructor(object, maxSlots, onpickup) {
    object.inventory = this;
    this.maxSlots = maxSlots;
    this.slots = {};
    this.object = object;
    this.selection = 1;
    var this_ = this;
    for(var i = 1; i < this.maxSlots+1; i++){
      this.slots[i] = null;
    };
    if(!onpickup){
      this.onpickup = function(){};
    } else {
      this.onpickup = onpickup;
    };
    this.pickUp = function (itemType, entity){
      var taken = 0;
      for(var i = 1; i < this.maxSlots+1; i++){
        if(this.slots[i] && this.slots[i].type != itemType) {
          taken++;
        };
      };
      if(taken == this.maxSlots){
        return;
      };
      var item = new game.item(itemType, this, entity.itemAmount, true);
      this.onpickup(entity.itemAmount, itemType);
      entity.delete();
      game.UI.sound("pickup"+(Math.floor(Math.random()*2)+1));
      if(item.onpickup) {
        item.onpickup();
      };
    };
    this.drop = function (slot){
      if(this.slots[slot]){
        this.slots[slot].drop();
      };
    };
    this.dropAll = function(nothrow){
      for(let i = 1; i < this.maxSlots+1; i++){
        if(this_.slots[i]){
          var amount = this_.slots[i].amount;
          //for(var a = 0; a < amount; a++){
            this_.slots[i].drop(true, nothrow);
          //};
        };
      };
    };
    this.delete = function (noEvent){
      this_.object.inventory = undefined;
      for(var i in this_){
          delete this_[i];
      };
    };
  };
};