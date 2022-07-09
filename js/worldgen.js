game.generation.top = 0;
game.generation.size = 8;
game.generation.layer = function (type, thickness, width, x, z, top) {
  for(y = top; y <= top+thickness-1; y++){
    for(x0 = x; x0 <= x+width-1; x0++){
      for(z0 = z; z0 <= z+width-1; z0++){
        new game.block(x0, y, z0, type);
      };
    };
  };
  game.generation.top += thickness;
};
game.generation.oreDistribution = function (type, thickness, width, x, z, top, chance) {
  for(y = top; y <= top+thickness-1; y++){
    for(x0 = x; x0 <= x+width-1; x0++){
      for(z0 = z; z0 <= z+width-1; z0++){
        if(Math.random()*100 > chance) {
          if(game.getBlock(x0, y, z0)) game.getBlock(x0, y, z0).delete(true);
          new game.block(x0, y, z0, type);
        };
      };
    };
  }; 
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
game.generation.house = function(x, z) {
  //first wall
  new game.block(x+1, 1, z+1, "bricks", false, false, true);
  new game.block(x+1, 1, z+2, "bricks", false, false, true);
  new game.block(x+1, 1, z+3, "bricks", false, false, true);
  new game.block(x+1, 1, z+4, "bricks", false, false, true);
  new game.block(x+1, 1, z+5, "bricks", false, false, true);
  new game.block(x+1, 1, z+6, "bricks", false, false, true);
  new game.block(x+1, 2, z+1, "bricks", false, false, true);
  new game.block(x+1, 2, z+2, "bricks", false, false, true);
  new game.block(x+1, 2, z+3, "bricks", false, false, true);
  new game.block(x+1, 2, z+4, "bricks", false, false, true);
  new game.block(x+1, 2, z+5, "bricks", false, false, true);
  new game.block(x+1, 2, z+6, "bricks", false, false, true);
  new game.block(x+1, 3, z+1, "bricks", false, false, true);
  new game.block(x+1, 3, z+2, "bricks", false, false, true);
  new game.block(x+1, 3, z+3, "bricks", false, false, true);
  new game.block(x+1, 3, z+4, "bricks", false, false, true);
  new game.block(x+1, 3, z+5, "bricks", false, false, true);
  new game.block(x+1, 3, z+6, "bricks", false, false, true);
  //second wall
  new game.block(x+6, 1, z+1, "bricks", false, false, true);
  new game.block(x+6, 1, z+2, "bricks", false, false, true);
  new game.block(x+6, 1, z+3, "bricks", false, false, true);
  new game.block(x+6, 1, z+4, "bricks", false, false, true);
  new game.block(x+6, 1, z+5, "bricks", false, false, true);
  new game.block(x+6, 1, z+6, "bricks", false, false, true);
  new game.block(x+6, 2, z+1, "bricks", false, false, true);
  new game.block(x+6, 2, z+2, "bricks", false, false, true);
  new game.block(x+6, 2, z+3, "bricks", false, false, true);
  new game.block(x+6, 2, z+4, "bricks", false, false, true);
  new game.block(x+6, 2, z+5, "bricks", false, false, true);
  new game.block(x+6, 2, z+6, "bricks", false, false, true);
  new game.block(x+6, 3, z+1, "bricks", false, false, true);
  new game.block(x+6, 3, z+2, "bricks", false, false, true);
  new game.block(x+6, 3, z+3, "bricks", false, false, true);
  new game.block(x+6, 3, z+4, "bricks", false, false, true);
  new game.block(x+6, 3, z+5, "bricks", false, false, true);
  new game.block(x+6, 3, z+6, "bricks", false, false, true);
  //third wall
  new game.block(x+1, 1, z+1, "bricks", false, false, true);
  new game.block(x+2, 1, z+1, "bricks", false, false, true);
  new game.block(x+3, 1, z+1, "bricks", false, false, true);
  new game.block(x+4, 1, z+1, "bricks", false, false, true);
  new game.block(x+5, 1, z+1, "bricks", false, false, true);
  new game.block(x+6, 1, z+1, "bricks", false, false, true);
  new game.block(x+1, 2, z+1, "bricks", false, false, true);
  new game.block(x+2, 2, z+1, "bricks", false, false, true);
  new game.block(x+5, 2, z+1, "bricks", false, false, true);
  new game.block(x+6, 2, z+1, "bricks", false, false, true);
  new game.block(x+1, 3, z+1, "bricks", false, false, true);
  new game.block(x+2, 3, z+1, "bricks", false, false, true);
  new game.block(x+3, 3, z+1, "bricks", false, false, true);
  new game.block(x+4, 3, z+1, "bricks", false, false, true);
  new game.block(x+5, 3, z+1, "bricks", false, false, true);
  new game.block(x+6, 3, z+1, "bricks", false, false, true);
  //fourth wall
  new game.block(x+1, 1, z+6, "bricks", false, false, true);
  new game.block(x+2, 1, z+6, "bricks", false, false, true);
  new game.block(x+4, 1, z+6, "bricks", false, false, true);
  new game.block(x+5, 1, z+6, "bricks", false, false, true);
  new game.block(x+6, 1, z+6, "bricks", false, false, true);
  new game.block(x+1, 2, z+6, "bricks", false, false, true);
  new game.block(x+2, 2, z+6, "bricks", false, false, true);
  new game.block(x+4, 2, z+6, "bricks", false, false, true);
  new game.block(x+5, 2, z+6, "bricks", false, false, true);
  new game.block(x+6, 2, z+6, "bricks", false, false, true);
  new game.block(x+1, 3, z+6, "bricks", false, false, true);
  new game.block(x+2, 3, z+6, "bricks", false, false, true);
  new game.block(x+3, 3, z+6, "bricks", false, false, true);
  new game.block(x+4, 3, z+6, "bricks", false, false, true);
  new game.block(x+5, 3, z+6, "bricks", false, false, true);
  new game.block(x+6, 3, z+6, "bricks", false, false, true);
  //roof
  new game.block(x+1, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+1, "stonebricks", false, false, true);
  new game.block(x+1, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+2, "stonebricks", false, false, true);
  new game.block(x+1, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+3, "stonebricks", false, false, true);
  new game.block(x+1, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+4, "stonebricks", false, false, true);
  new game.block(x+1, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+5, "stonebricks", false, false, true);
  new game.block(x+1, 4, z+6, "stonebricks", false, false, true);
  new game.block(x+2, 4, z+6, "stonebricks", false, false, true);
  new game.block(x+3, 4, z+6, "stonebricks", false, false, true);
  new game.block(x+4, 4, z+6, "stonebricks", false, false, true);
  new game.block(x+5, 4, z+6, "stonebricks", false, false, true);
  new game.block(x+6, 4, z+6, "stonebricks", false, false, true);
  //floor
  new game.block(x+1, 0, z+1, "planks", false, false, true);
  new game.block(x+2, 0, z+1, "planks", false, false, true);
  new game.block(x+3, 0, z+1, "planks", false, false, true);
  new game.block(x+4, 0, z+1, "planks", false, false, true);
  new game.block(x+5, 0, z+1, "planks", false, false, true);
  new game.block(x+6, 0, z+1, "planks", false, false, true);
  new game.block(x+1, 0, z+2, "planks", false, false, true);
  new game.block(x+2, 0, z+2, "planks", false, false, true);
  new game.block(x+3, 0, z+2, "planks", false, false, true);
  new game.block(x+4, 0, z+2, "planks", false, false, true);
  new game.block(x+5, 0, z+2, "planks", false, false, true);
  new game.block(x+6, 0, z+2, "planks", false, false, true);
  new game.block(x+1, 0, z+3, "planks", false, false, true);
  new game.block(x+2, 0, z+3, "planks", false, false, true);
  new game.block(x+3, 0, z+3, "planks", false, false, true);
  new game.block(x+4, 0, z+3, "planks", false, false, true);
  new game.block(x+5, 0, z+3, "planks", false, false, true);
  new game.block(x+6, 0, z+3, "planks", false, false, true);
  new game.block(x+1, 0, z+4, "planks", false, false, true);
  new game.block(x+2, 0, z+4, "planks", false, false, true);
  new game.block(x+3, 0, z+4, "planks", false, false, true);
  new game.block(x+4, 0, z+4, "planks", false, false, true);
  new game.block(x+5, 0, z+4, "planks", false, false, true);
  new game.block(x+6, 0, z+4, "planks", false, false, true);
  new game.block(x+1, 0, z+5, "planks", false, false, true);
  new game.block(x+2, 0, z+5, "planks", false, false, true);
  new game.block(x+3, 0, z+5, "planks", false, false, true);
  new game.block(x+4, 0, z+5, "planks", false, false, true);
  new game.block(x+5, 0, z+5, "planks", false, false, true);
  new game.block(x+6, 0, z+5, "planks", false, false, true);
  new game.block(x+1, 0, z+6, "planks", false, false, true);
  new game.block(x+2, 0, z+6, "planks", false, false, true);
  new game.block(x+3, 0, z+6, "planks", false, false, true);
  new game.block(x+4, 0, z+6, "planks", false, false, true);
  new game.block(x+5, 0, z+6, "planks", false, false, true);
  new game.block(x+6, 0, z+6, "planks", false, false, true);
  //loot chest
  var chest = new game.block(x+2, 1, z+2, "chest", false, false, true);
  var diamondChance = Math.random()*100;
  if(diamondChance >= 60) {
    new game.item("diamond", chest.inventory, Math.round(Math.random()*5)+1);
  };
  var appleChance = Math.random()*100;
  if(diamondChance >= 10) {
    new game.item("apple", chest.inventory, Math.round(Math.random()*5)+1);
  };
  var diamondappleChance = Math.random()*100;
  if(diamondappleChance >= 10) {
    new game.item("diamond_apple", chest.inventory, Math.round(Math.random()*5)+1);
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
    game.generation.layer("world_barrier", 1, size, x, z, -5);
    game.generation.layer("lava", 1, size, x, z, -4);
    game.generation.layer("stone", 1, size, x, z, -3);
    game.generation.layer("stone", 2, size, x, z, -2);
    game.generation.layer("plant", 1, size, x, z, 0);
    //type, thickness, width, x, z, top, chance
    game.generation.oreDistribution("fat", 1, 8, x, z, -3, 99);
    game.generation.oreDistribution("iron_ore", 3, 8, x, z, -3, 90);
    game.generation.oreDistribution("diamond_ore", 3, 8, x, z, -3, 95);
    game.generation.oreDistribution("rose", 1, 8, x, z, 1, 95);
  };
  if(game.generation.mode == 1){
    game.generation.layer("world_barrier", 1, size, x, z, -1, "fat", 99);
    game.generation.layer("plant", 1, size, x, z, 0, undefined, Infinity);
    game.generation.oreDistribution("rose", 1, 8, x, z, 1, 95);
  };
  var cowChance = Math.round(Math.random()*100);
  var pigChance = Math.round(Math.random()*100);
  var tonyChance = Math.round(Math.random()*1000);
  var chickenChance = Math.round(Math.random()*100);
  var houseChance = Math.round(Math.random()*100);
  if(cowChance>=90){
    new game.entity("bull", [x+4,2,z+4]);
  };
  if(cowChance>=90){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("cow", [x+4,2,z+4]);
    };
  };
  if(pigChance>=87){
    for(var i = 0; i < Math.random()*3+1; i++){
      new game.entity("pig", [x+4,2,z+4]);
    };
  };
  if(chickenChance>=85){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("chicken", [x+4,2,z+4]);
    };
  };
  if(chickenChance>=85){
    for(var i = 0; i < Math.random()+1; i++){
      new game.entity("rooster", [x+4,2,z+4]);
    };
  };
  if(tonyChance==1){
    new game.entity("tony", [x+4,2,z+4]);
  };
  if(houseChance>=95){
    game.generation.house(x, z);
    game.UI.achievement("Explorer", "Find an abandoned house.", "bricks.png");
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