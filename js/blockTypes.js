//visible, collidable, oncreate, onbreak, breakable
game.blockTypes = {
  dirt: [true, true, function(){}, function(){}, true],
  plant: [true, true, function(){}, function(){}, true],
  stone: [true, true, function(){}, function(){}, true],
  wood: [true, true, function(){}, function(){}, true],
  mud: [true, false, function(){}, function(){}, true],
  world_barrier: [false, true, function(){}, function(){}, false],
  tree: [true, true, function(){var this_ = this; var pos = new THREE.Vector3(0, 0, 0).copy(this.block.position); setTimeout(function (){this_.delete(true); setTimeout(function() {game.generation.tree(pos.x, pos.y, pos.z)}, 100)}, 100);}, function (){}, true],
  bricks: [true, true, function(){}, function(){}, function(){}, true],
};