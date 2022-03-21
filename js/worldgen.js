game.generation.top = 0;
game.generation.layer = function (type, thickness, width) {
  for(y = game.generation.top; y <= game.generation.top+thickness-1; y++){
    for(x = 1; x <= width; x++){
      for(z = 1; z <= width; z++){
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
  if(game.generation.mode == "simple") {
    game.generation.layer("plant", 1, 32);
    game.generation.barrier(32, 4);
  };
  if(game.generation.mode == "medium") {
    game.generation.layer("dirt", 1, 32);
    game.generation.layer("plant", 1, 32);
    game.generation.barrier(32, 5);
  };
  if(game.generation.mode == "complex") {
    game.generation.layer("stone", 1, 32);
    game.generation.layer("dirt", 1, 32);
    game.generation.layer("plant", 1, 32);
    game.generation.barrier(32, 6);
  };
  if(game.generation.trees) {
    for(var i = 0; i <= Math.random()*7+1; i++){
      game.generation.tree(Math.round(Math.random()*30)+1, game.generation.top, Math.round(Math.random()*30)+1);
    };
  };
  for(loop = 1; loop <= Math.round(Math.random())+1; loop++){
    new game.entity("bull", [20,8,20]);
  };
  for(loop = 1; loop <= Math.round(Math.random()*3)+1; loop++){
    new game.entity("cow", [20,8,20]);
  };
  if(game.generation.puddle){
    game.generation.puddle = [Math.floor(Math.random()*30), game.generation.top-1, Math.floor(Math.random()*30)+1];
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]).delete();
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]).delete();
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2])){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]).delete();
    };
    
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]+1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]+1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]+1).delete();
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]+1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+1)){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]+1).delete();
    };
    
    if (game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0], game.generation.puddle[1], game.generation.puddle[2]-1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]+1, game.generation.puddle[1], game.generation.puddle[2]-1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]+2, game.generation.puddle[1], game.generation.puddle[2]-1).delete();
    }
    if (game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]-1, game.generation.puddle[1], game.generation.puddle[2]-1).delete();
    };
    if (game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-1)){
      game.getBlock(game.generation.puddle[0]-2, game.generation.puddle[1], game.generation.puddle[2]-1).delete();
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
  };
  game.player = new game.entity("player", [10,15,10]);
  document.getElementById("menu").style.display = "none";
};