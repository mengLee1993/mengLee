function Plane(container){
	this.img = "images/my.gif"; //我方飞机图片路径
	this.bullImg = "images/bullet1.png";
	this.x = 126; //飞机起始横向位置
	this.y = 480; //飞机起始纵向位置
	this.bulSpeed = 300; //创建子弹的速度
	this.bulMoveSpeed = 30; //子弹的移动速度
	this.container = container; //游戏主容器
	this.bulletList = [];
}

Plane.prototype = {
	constructor:Plane,
	init:function(){
		this.create();
		this.mousemove();
		var that = this;
		setInterval(function(){
			that.createBullet();
		},this.bulSpeed);
	},
	create:function(){
		this.plane = document.createElement("img");
		this.plane.src = this.img;
		this.plane.style.cssText = "position:absolute; left:"+ this.x +"px; top:"+ this.y +"px;";
		this.container.appendChild(this.plane);
	},
	mousemove:function(){
		var that = this;
		this.container.onmousemove = function(e){
			e = e || event;
			var x = e.clientX - this.offsetLeft - that.plane.offsetWidth / 2;
			var y = e.clientY - this.offsetTop - that.plane.offsetHeight / 2;
			var maxWidth = this.offsetWidth - that.plane.offsetWidth;
			var maxHeight = this.offsetHeight - that.plane.offsetHeight;
			that.plane.style.left = Math.max(Math.min(x,maxWidth),0) + "px";
			that.plane.style.top = Math.max(Math.min(y,maxHeight),0) + "px";
		}
	},
	createBullet:function(){
		this.bullet = document.createElement("img");
		this.bullet.src = this.bullImg;
		this.bullet.style.cssText = "position:absolute; left:"+ (this.plane.offsetLeft + 30) +"px; top:"+ (this.plane.offsetTop - 6) +"px;";
		this.container.appendChild(this.bullet);
		this.bulletList.push(this.bullet);
		var bullet = this.bullet;
		var that = this;
		this.bullet.timer = setInterval(function(){
			bullet.style.top = bullet.offsetTop - 2 + "px";
			if(bullet.offsetTop <= -14){
				clearInterval(bullet.timer);
				bullet.parentNode.removeChild(bullet);
				that.removeBullet(bullet);
			}
		},this.bulMoveSpeed);
	},
	removeBullet:function(obj){
		for(var i = 0; i < this.bulletList.length; i++){
			if(this.bulletList[i] == obj){
				this.bulletList.splice(i,1)
			}
		}
	}
};