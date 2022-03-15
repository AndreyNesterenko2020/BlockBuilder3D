game.entityTypes = {
  cow: [10,1,[2.3,1.5,1], function(){
    var this_ = this;
    function animLoop(){
      if(this_.health == 0 || this_.health == undefined){
        this_.animations[0]=0;
        return
      };
      this_.playAnimation("walk", 2, 0);
      setTimeout(function() {
        this_.playAnimation("walk", 0.5);
        setTimeout(animLoop, 500)}, 200)
      };
      function walkLoop(){
        if(this_.health == 0 || this_.health == undefined){
          return
        };
        this_.setPosition(this_.getPosition().position, Math.round(Math.random()*360));
        this_.movement[0] = 1;
        setTimeout(walkLoop, Math.random()*5000);
      };
      animLoop();
      setTimeout(walkLoop, 200)
    }, function(){
      this.hitboxPhysics.setLinearVelocity(new Ammo.btVector3(0, 2, 0));
    }, function(){
      this.playAnimation("death");
    },2.5, 2],
};
