function Enemy(container){
	this.img = "images/enemy1_fly_1.png";
	this.boom = "images/enemy1_fly_3.gif";
	this.x = 0;
	this.y = 0;
	this.container = container;
	this.height = 24;
	this.width = 34;
	this.enemyTime = 30;
	this.createTime = 1000;
	this.moveSpeed = 2;
	this.bullList = [];
	this.plane = null;
}
Enemy.fn = Enemy.prototype = {
	constructor:Enemy,
	init:function(){
		var that = this;
		setInterval(function(){
			that.create();
		},this.createTime);
	},
	create:function(){
		this.enemy = document.createElement("img");
		this.enemy.src = this.img;
		var x = parseInt(Math.random() * (this.container.offsetWidth - this.width));
		this.enemy.style.cssText = "position:absolute; left:"+ x +"px; top:"+( this.height * -1 )+"px;";
		this.container.appendChild(this.enemy);
		this.enemy.isImpact = true;
		var enemy = this.enemy;
		var that = this;
		this.enemy.timer = setInterval(function(){
			enemy.style.top = enemy.offsetTop + that.moveSpeed + "px";

			//用页面所有子弹与敌机进行碰撞检测
			for(var i = 0; i < that.bullList.length; i++){
				var curBul = that.bullList[i];
				if(curBul.offsetLeft + curBul.offsetWidth > enemy.offsetLeft &&
					curBul.offsetLeft < enemy.offsetLeft + enemy.offsetWidth &&
				curBul.offsetTop < enemy.offsetTop + enemy.offsetHeight &&
				curBul.offsetTop + curBul.offsetHeight > enemy.offsetTop && enemy.isImpact){
					//以下是子弹与敌机的碰撞处理
					enemy.isImpact = false;
					curBul.parentNode.removeChild(curBul);
					that.plane.removeBullet(curBul);
					enemy.src = that.boom;
					setTimeout(function(){
						enemy.parentNode.removeChild(enemy);
					},300);
				}
			}

			if(enemy.offsetTop >= that.container.offsetHeight){
				clearInterval(enemy.timer);
				enemy.parentNode.removeChild(enemy);
			}
		},this.enemyTime);
	}
}


function middEnemy(container){
	Enemy.call(this,container);
	this.img = "images/enemy2_fly_1.png";
	this.boom = "images/enemy2_fly_3.gif";
	this.width = 46;
	this.height = 60;
}
middEnemy.prototype = Enemy.prototype;