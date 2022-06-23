//oncreate, leftuse, rightuse, ondropped, ondelete, onpickup, heldTexture, miningExceptions, maxStack
game.itemTypes = {
  stone: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "stone", true); this.use()}}, function (){}, function (){}, function (){}, "stone", {}, 32],
  plant: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "plant", true); this.use()}}, function (){}, function (){}, function (){}, "plant", {}, 32],
  wood: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "wood", true); this.use()}}, function (){}, function (){}, function (){}, "wood", {}, 32],
  dirt: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "dirt", true); this.use()}}, function (){}, function (){}, function (){}, "dirt", {}, 32],
  tree: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; game.UI.achievement("Farmer", "Plant a tree", "tree.png"); new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "tree", true); this.use()}}, function (){}, function (){}, function (){}, "tree", {}, 32],
  mud: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "mud", true); this.use()}}, function (){}, function (){}, function (){}, "mud", {}, 32],
  world_barrier: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "world_barrier", true); this.use()}}, function (){}, function (){}, function (){}, "world_barrier", {}, 32],
  bricks: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "bricks", true); this.use()}}, function (){}, function (){}, function (){}, "bricks", {}, 32],
  meat: [function (){}, function (){}, function (){if(this.inventory.object.health==this.inventory.object.maxHealth){return}; this.inventory.object.health += 30; game.UI.sound("eat"); this.use(); }, function (){}, function (){}, function (){}, "meat", {}, 16],
  sword: [function (){},function (entityPos, raycastPos, object, entity){if(entity.entityData.attackCooldown){return}; game.UI.swing.src=game.UI.swing.src; var oldspeed = entity.entityData.walkSpeed; entity.entityData.walkSpeed = 0.5; var old = entity.attackDamage; entity.attackDamage=12; game.UI.sound("sword"+Math.floor(Math.random()*2+1)); setTimeout(function(){entity.entityData.attackCooldown = true},10); setTimeout(function(){entity.attackDamage=old; entity.entityData.walkSpeed = oldspeed; entity.entityData.attackCooldown = false;}, 800)},function (entityPos, raycastPos, object, entity){},function (){},function (){},function (){}, "sword_held", {}, 1],
  fat: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "fat", true); this.use()}}, function (){}, function (){}, function (){}, "fat", {}, 32],
  stonebricks: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "stonebricks", true); this.use()}}, function (){}, function (){}, function (){}, "stonebricks", {}, 32],
  planks: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "planks", true); this.use()}}, function (){}, function (){}, function (){}, "planks", {}, 32],
  chicken: [function (){}, function (){}, function (){if(this.inventory.object.health==this.inventory.object.maxHealth){return}; this.inventory.object.health += 25; game.UI.sound("eat"); this.use(); }, function (){}, function (){}, function (){}, "chicken", {}, 16],
  pickaxe: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "pickaxe_held", {"stone": 0.5, "stonebricks": 0.5, "bricks": 0.5, "iron_ore": 0.5, "diamond_ore": 0.5, "diamond_block": 0.5}, 1],
  iron: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "iron", {}, 32],
  apple: [function (){}, function (){}, function (){if(this.inventory.object.health==this.inventory.object.maxHealth){return}; this.inventory.object.health += 20; game.UI.sound("eat"); this.use(); }, function (){}, function (){}, function (){}, "apple", {}, 16],
  wood_pickaxe: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "wood_pickaxe_held", {"stone": 0.2, "stonebricks": 0.2, "bricks": 0.2, "iron_ore": 0.2, "diamond_ore": 0.2, "diamond_block": 0.2}, 1],
  stone_pickaxe: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "stone_pickaxe_held", {"stone": 0.3, "stonebricks": 0.3, "bricks": 0.3, "iron_ore": 0.3, "diamond_ore": 0.3, "diamond_block": 0.3}, 1],
  stick: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "stick_held", {}, 32],
  bucket: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range){if(object.entity){if(object.entity.type == "cow"){this.use(); new game.item("milk_bucket", entity.inventory); game.UI.sound("cow"+(Math.floor(Math.random()*2)+1)); game.UI.sound("bucket");}} else if(game.getBlock(object.position.x, object.position.y, object.position.z) && game.getBlock(object.position.x, object.position.y, object.position.z).type == "lava") {this.use(); game.getBlock(object.position.x, object.position.y, object.position.z).delete(); new game.item("lava_bucket", entity.inventory); game.UI.sound("bucket");}}}, function (){}, function (){}, function (){}, "bucket", {}, 16],
  lava_bucket: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "lava", true); this.use(); new game.item("bucket", entity.inventory); game.UI.sound("bucket");}}, function (){}, function (){}, function (){}, "lava_bucket", {}, 16],
  milk_bucket: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(this.inventory.object.health==this.inventory.object.maxHealth){return}; this.inventory.object.health += 10; game.UI.sound("drink"); this.use(); new game.item("bucket", entity.inventory); game.UI.sound("bucket");}, function (){}, function (){}, function (){}, "milk_bucket", {}, 16],
  iron_axe: [function (){},function (entityPos, raycastPos, object, entity){if(entity.entityData.attackCooldown){return}; game.UI.swing.src=game.UI.swing.src; var oldspeed = entity.entityData.walkSpeed; entity.entityData.walkSpeed = 0.5; var old = entity.attackDamage; entity.attackDamage=15; game.UI.sound("sword"+Math.floor(Math.random()*2+1)); setTimeout(function(){entity.entityData.attackCooldown = true},10); setTimeout(function(){entity.attackDamage=old; entity.entityData.walkSpeed = oldspeed; entity.entityData.attackCooldown = false;}, 1700)},function (entityPos, raycastPos, object, entity){},function (){},function (){},function (){}, "iron_axe_held", {"wood": 0.4, "planks": 0.4}, 1],
  diamond: [function (){}, function (){}, function (){}, function (){}, function (){}, function (){}, "diamond", {}, 32],
  diamond_apple: [function (){}, function (){}, function (entityPos, raycastPos, object, entity){if(entity.entityData.diamondApple){return}; entity.entityData.diamondApple = true; game.UI.diamondOverlay.style.display = "block"; this.inventory.object.health += 40; game.UI.sound("eat"); this.use(); var old = entity.entityData.walkSpeed; entity.entityData.walkSpeed = old*2; game.UI.Health.childNodes[0].style.backgroundColor = "skyblue"; entity.attackable = false; setTimeout(function (){entity.entityData.walkSpeed = old; game.UI.Health.childNodes[0].style.backgroundColor = "red"; entity.attackable = true; entity.entityData.diamondApple = false; game.UI.diamondOverlay.style.display = "none";}, 10000)}, function (){}, function (){}, function (){}, "diamond_apple", {}, 16],
  diamond_block: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "diamond_block", true); this.use()}}, function (){}, function (){}, function (){}, "diamond_block", {}, 32],
  chest: [function (){}, function (entityPos, raycastPos, object, entity){}, function (entityPos, raycastPos, object, entity){if(entityPos.distanceTo(raycastPos) <= game.range && !object.entity){if(entityPos.equals(raycastPos)){return}; new game.block(raycastPos.x, raycastPos.y, raycastPos.z, "chest", true); this.use()}}, function (){}, function (){}, function (){}, "chest", {}, 32],
};