game.generation.top = 0;
game.generation.layer = function (type, thickness) {
  for(y = game.generation.top; y <= game.generation.top+thickness-1; y++){
    for(x = 1; x <= 16; x++){
      for(z = 1; z <= 16; z++){
        game.block(x, y, z, type);
      };
    };
  };
  game.generation.top += thickness;
}
game.generation.generate = function () {
  game.generation.layer("stone", 4);
  game.generation.layer("dirt", 2);
  game.generation.layer("plant", 1);
}