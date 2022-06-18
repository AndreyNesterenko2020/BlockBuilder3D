//visible, collidable, oncreate, onbreak, breakable, requiredItem
game.blockTypes = {
  dirt: [true, true, function(){}, function(){}, 0.7, ["*"]],
  plant: [true, true, function(){}, function(){}, 1, ["*"]],
  stone: [true, true, function(){}, function(){}, 4, ["wood_pickaxe", "stone_pickaxe", "pickaxe"]],
  wood: [true, true, function(){}, function(){}, 1.5, ["*"]],
  mud: [true, false, function(){}, function(){}, 0.3, ["*"]],
  world_barrier: [false, true, function(){}, function(){}, 10, ["*"]],
  tree: [true, false, function(){var this_ = this; var pos = new THREE.Vector3(0, 0, 0).copy(this.block.position); setTimeout(function (){this_.delete(true); setTimeout(function() {game.generation.tree(pos.x, pos.y, pos.z); game.UI.sound("plant1");}, 100)}, 5000);}, function (){}, 0.01, ["*"]],
  bricks: [true, true, function(){}, function(){}, 3.5, ["*"]],
  leaves: [true, true, function(){if(Math.random()*100 > 80){new game.item("tree", this.inventory)} else if(Math.random()*100 > 80){new game.item("apple", this.inventory)}}, function(){}, 0.5, ["*"]],
  fat: [true, true, function(){}, function(){}, 0.3, ["*"]],
  stonebricks: [true, true, function(){}, function(){}, 3.5, ["*"]],
  planks: [true, true, function(){}, function(){}, 1.5, ["*"]],
  lava: [true, false, function(){}, function(){}, 100, ["*"]],
  iron_ore: [true, true, function(){new game.item("iron", this.inventory)}, function(){}, 4.5, ["stone_pickaxe", "pickaxe"]],
  diamond_ore: [true, true, function(){new game.item("diamond", this.inventory)}, function(){}, 5, ["pickaxe"]],
  diamond_block: [true, true, function(){}, function(){}, 5, ["pickaxe"]],
};