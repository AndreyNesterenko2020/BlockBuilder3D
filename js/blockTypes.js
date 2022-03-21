game.blockTypes = {
  dirt: [true, true, function(){}, function(){}],
  plant: [true, true, function(){}, function(){}],
  stone: [true, true, function(){}, function(){}],
  wood: [true, true, function(){}, function(){}],
  mud: [true, false, function(){}, function(){}],
  world_barrier: [false, true, function(){}, function(){var pos = [this.block.position.x, this.block.position.y, this.block.position.z]; setTimeout(function(){new game.block(pos[0], pos[1], pos[2], "world_barrier")}, 10)}],
};