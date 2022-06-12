game.generation.top = 0;
game.generation.size = 8;
game.generation.layer = function (type, thickness, width, x, z, top, ore, orechance) {
  for(y = top; y <= top+thickness-1; y++){
    for(x0 = x; x0 <= x+width-1; x0++){
      for(z0 = z; z0 <= z+width-1; z0++){
        if(Math.random()*100 > orechance) {
          new game.block(x0, y, z0, ore);
        } else {
          new game.block(x0, y, z0, type);
        };
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
  new game.block(x, y+4, z, "leaves");
  new game.block(x, y+5, z, "leaves");
  new game.block(x, y+3, z+1, "leaves");
  new game.block(x, y+3, z-1, "leaves");
  new game.block(x+1, y+3, z+1, "leaves");
  new game.block(x-1, y+3, z-1, "leaves");
  new game.block(x+1, y+3, z, "leaves");
  new game.block(x-1, y+3, z, "leaves");
  new game.block(x-1, y+3, z+1, "leaves");
  new game.block(x+1, y+3, z-1, "leaves");
  new game.block(x+1, y+4, z, "leaves");
  new game.block(x-1, y+4, z, "leaves");
  new game.block(x, y+4, z+1, "leaves");
  new game.block(x, y+4, z-1, "leaves");
};
game.generation.generate = function (x, z) {
  var size = game.generation.size;
  if(game.generation.mode == 2){
    game.generation.layer("world_barrier", 1, size, x, z, -5, "fat", 99);
    game.generation.layer("lava", 1, size, x, z, -4, undefined, Infinity);
    game.generation.layer("stone", 3, size, x, z, -3, "iron_ore", 90);
    game.generation.layer("plant", 1, size, x, z, 0, undefined, Infinity);
  };
  if(game.generation.mode == 1){
    game.generation.layer("world_barrier", 1, size, x, z, -1, "fat", 99);
    game.generation.layer("plant", 1, size, x, z, 0, undefined, Infinity);
  };
  var cowChance = Math.round(Math.random()*100);
  var pigChance = Math.round(Math.random()*100);
  var tonyChance = Math.round(Math.random()*1000);
  var chickenChance = Math.round(Math.random()*100);
  if(cowChance>=80){
    new game.entity("bull", [x+4,2,z+4]);
  };
  if(cowChance>=80){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("cow", [x+4,2,z+4]);
    };
  };
  if(pigChance>=85){
    for(var i = 0; i < Math.random()*3+1; i++){
      new game.entity("pig", [x+4,2,z+4]);
    };
  };
  if(chickenChance>=70){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("chicken", [x+4,2,z+4]);
    };
  };
  if(chickenChance>=70){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("rooster", [x+4,2,z+4]);
    };
  };
  if(tonyChance==1){
    new game.entity("tony", [x+4,2,z+4]);
  };
  if(game.generation.puddle && Math.round(Math.random()*100)>=80){
    game.generation.puddle = [x+Math.floor(Math.random()*(size-2)), 0, z+Math.floor(Math.random()*(size-2))+1];
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
    /*
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
    */
  };
  if(game.generation.trees) {
    for(var i = 0; i <= Math.random()*3+1; i++){
      game.generation.tree(x+Math.round(Math.random()*(size-3))+1, 1, z+Math.round(Math.random()*(size-3))+1);
    };
  };
};