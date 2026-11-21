export default class Player extends Phaser.Physics.Arcade.Sprite {
 constructor(scene,x,y){super(scene,x,y,'player');scene.add.existing(this);scene.physics.add.existing(this);this.setDepth(5);this.setCollideWorldBounds(true);this.body.setSize(25,30).setOffset(7,8);this.speed=220;this.invulnerableUntil=0;this.facing=1;}
 move(vx,vy){const len=Math.hypot(vx,vy)||1;this.setVelocity(vx/len*this.speed,vy/len*this.speed);if(vx)this.facing=Math.sign(vx);this.setFlipX(this.facing<0);if(this.body.velocity.length()>0)this.y+=Math.sin(this.scene.time.now/75)*.18;}
 hurt(){this.invulnerableUntil=this.scene.time.now+1150;this.setTint(0xff7777);this.scene.time.delayedCall(1150,()=>{if(this.active)this.clearTint();});}
}
