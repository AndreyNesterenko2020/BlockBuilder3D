game.generation.top = 0;
game.generation.size = 32;
game.generation.layer = function (type, thickness, width) {
  for(y = game.generation.top; y <= game.generation.top+thickness-1; y++){
    for(x = 1; x <= width; x++){
      for(z = 1; z <= width; z++){
          game.generation.total += 1;
        new game.block(x, y, z, type);
      };
    };
  };
  game.generation.top += thickness;
};
game.generation.barrier = function (width, height) {
  for(y = 0; y <= height; y++){
    for(x = 0; x <= width; x++){
      new game.block(x, y, 0, "world_barrier");
    };
  };
  for(y = 0; y <= height; y++){
    for(z = 0; z <= width; z++){
      new game.block(0, y, z, "world_barrier");
    };
  };
  for(y = 0; y <= height; y++){
    for(x = 0; x <= width; x++){
      new game.block(x, y, width, "world_barrier");
    };
  };
  for(y = 0; y <= height; y++){
    for(z = 0; z <= width; z++){
      new game.block(width, y, z, "world_barrier");
    };
  };
};
game.generation.tree = function(x, y, z) {
  if(game.getBlock(x, y-1, z)){
    game.getBlock(x, y-1, z).delete(true);
  };
  new game.block(x, y-1, z, "dirt");
  new game.block(x, y, z, "wood");
  new game.block(x, y+1, z, "wood");
  new game.block(x, y+2, z, "wood");
  new game.block(x, y+3, z, "wood");
  new game.block(x, y+4, z, "plant");
  new game.block(x, y+5, z, "plant");
  new game.block(x, y+3, z+1, "plant");
  new game.block(x, y+3, z-1, "plant");
  new game.block(x+1, y+3, z+1, "plant");
  new game.block(x-1, y+3, z-1, "plant");
  new game.block(x+1, y+3, z, "plant");
  new game.block(x-1, y+3, z, "plant");
  new game.block(x-1, y+3, z+1, "plant");
  new game.block(x+1, y+3, z-1, "plant");
  new game.block(x+1, y+4, z, "plant");
  new game.block(x-1, y+4, z, "plant");
  new game.block(x, y+4, z+1, "plant");
  new game.block(x, y+4, z-1, "plant");
};
game.generation.generate = function () {
  var size = game.generation.size;
  if(game.generation.chromebook){
    size = 16;
    game.generation.mode = "simple";
  };
  if(game.generation.mode == "simple") {
    game.generation.layer("plant", 1, size);
    game.generation.barrier(size+1, 4);
  };
  if(game.generation.mode == "medium") {
    game.generation.layer("dirt", 1, size);
    game.generation.layer("plant", 1, size);
    game.generation.barrier(size+1, 5);
  };
  if(game.generation.mode == "complex") {
    game.generation.layer("stone", 1, size);
    game.generation.layer("dirt", 1, size);
    game.generation.layer("plant", 1, size);
    game.generation.barrier(size+1, 6);
  };
  for(loop = 1; loop <= Math.round(Math.random())+1; loop++){
    new game.entity("bull", [12,8,12]);
  };
  for(loop = 1; loop <= Math.round(Math.random()*3)+1; loop++){
    new game.entity("cow", [12,8,12]);
  };
  for(loop = 1; loop <= Math.round(Math.random()*3)+1; loop++){
    new game.entity("pig", [12,8,12]);
  };
  if(game.generation.puddle){
    game.generation.puddle = [Math.floor(Math.random()*(size-2)), game.generation.top-1, Math.floor(Math.random()*(size-2))+1];
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]).delete(true);
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]).delete(true);
    };
    
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+1).delete(true);
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+1).delete(true);
    };
    
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-1).delete(true);
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-1).delete(true);
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-1).delete(true);
    };
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2], "mud");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2], "mud");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2], "mud");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2], "mud");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2], "mud");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+1, "mud");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+1, "mud");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+1, "mud");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+1, "mud");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+1, "mud");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-1, "mud");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-1, "mud");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-1, "mud");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-1, "mud");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-1, "mud");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1]-1, game.generation.puddle[2], "dirt");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1]-1, game.generation.puddle[2], "dirt");
    new game.block(game.generation.puddle[0], game.generation.puddle[1]-1, game.generation.puddle[2], "dirt");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1]-1, game.generation.puddle[2], "dirt");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1]-1, game.generation.puddle[2], "dirt");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1]-1, game.generation.puddle[2]+1, "dirt");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1]-1, game.generation.puddle[2]+1, "dirt");
    new game.block(game.generation.puddle[0], game.generation.puddle[1]-1, game.generation.puddle[2]+1, "dirt");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1]-1, game.generation.puddle[2]+1, "dirt");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1]-1, game.generation.puddle[2]+1, "dirt");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1]-1, game.generation.puddle[2]-1, "dirt");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1]-1, game.generation.puddle[2]-1, "dirt");
    new game.block(game.generation.puddle[0], game.generation.puddle[1]-1, game.generation.puddle[2]-1, "dirt");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1]-1, game.generation.puddle[2]-1, "dirt");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1]-1, game.generation.puddle[2]-1, "dirt");
        new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2], "world_barrier");
    new game.block(game.generation.puddle[0]+3, game.generation.puddle[1], game.generation.puddle[2], "world_barrier");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2], "world_barrier");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2], "world_barrier");
    new game.block(game.generation.puddle[0]-3, game.generation.puddle[1], game.generation.puddle[2], "world_barrier");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]+3, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]-3, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]+3, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]-3, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-2, "world_barrier");
    new game.block(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+2, "world_barrier");
    new game.block(game.generation.puddle[0]-3, game.generation.puddle[1], game.generation.puddle[2]-1, "world_barrier");
    new game.block(game.generation.puddle[0]-3, game.generation.puddle[1], game.generation.puddle[2]+1, "world_barrier");
    new game.block(game.generation.puddle[0]+3, game.generation.puddle[1], game.generation.puddle[2]-1, "world_barrier");
    new game.block(game.generation.puddle[0]+3, game.generation.puddle[1], game.generation.puddle[2]+1, "world_barrier");
  };
  if(game.generation.trees) {
    for(var i = 0; i <= Math.random()*7+1; i++){
      game.generation.tree(Math.round(Math.random()*(size-2))+1, game.generation.top, Math.round(Math.random()*(size-2))+1);
    };
  };
  game.player = new game.entity("player", [10,15,10]);
  document.getElementById("menu").style.display = "none";
  setTimeout(function (){
    game.UI.consoleMessage("");
    game.UI.consoleMessage("Hello there, Player!");
    new game.item("stone", game.player.inventory, 5);
    new game.item("dirt", game.player.inventory, 5)
    new game.item("plant", game.player.inventory, 5);
    new game.item("wood", game.player.inventory, 5);
    new game.item("mud", game.player.inventory, 5);
    new game.item("bricks", game.player.inventory, 5);
  }, 500);
};