(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = "#0f0"; 
	ctx.strokeStyle = "#f00";

	//按下键盘的响应参数
	var keyList = {
		37: [-1,0],
		38: [0,-1],
		39: [1,0],
		40: [0,1]
	};

	var snake = {
		options: {
			canvasSize: 300,
			length: 5, //贪食蛇初始块数
			speed: 10, //每次移动10个像素
			width: 10, //每块是10*10的正方形
			array: [[4,0],[3,0],[2,0],[1,0],[0,0]], //蛇分块
			keyCode: 39, //初始默认蛇往右移动
			forward: [], //蛇的前进方向
			food: [],
			gameOver: false,
			score: 0
		},
		draw: function() {
			ctx.clearRect(0, 0, this.options.canvasSize, this.options.canvasSize);
			var len = this.options.array.length;
			for(var i = len - 1; i >= 0; i--){
				this.drawDot(this.options.array[i]);
			}
			this.drawDot(this.options.food);

		},
		//注意：生成的食物不要在蛇身上
		createFood: function() {
			var Rand1 = Math.random();
			var Rand2 = Math.random();
			var num = (this.options.canvasSize - this.options.width) / 10;
			var left = Math.floor(num*Rand1);
			var top = Math.floor(num*Rand2);
			for(var i = this.options.array.length - 1; i >=0; i--) {
				if(left == this.options.array[i][0] && top == this.options.array[i][1])
				{
					createFood();
					return;
				}
			}
			this.options.food = [left, top];
		},
		go: function() {
			var len = this.options.array.length;
			var keyCode = this.options.keyCode;
			if(keyList[keyCode] && this.options.forward[0] != keyList[keyCode][0] && this.options.forward[1] != keyList[keyCode][1])
				this.options.forward = keyList[keyCode];

			for(var i = len - 1; i > 0; i--) {
				this.options.array[i][0] = this.options.array[i-1][0];
				this.options.array[i][1] = this.options.array[i-1][1];
			}

			this.options.array[0][0] += this.options.forward[0];
			this.options.array[0][1] += this.options.forward[1];
			this.gameOver(); //检测有没有碰撞
			this.eatFood();
		},
		drawDot: function(pos) {
			ctx.fillRect(pos[0]*10, pos[1]*10, this.options.width, this.options.width);
			ctx.strokeRect(pos[0]*10, pos[1]*10, this.options.width, this.options.width);
		},
		gameOver: function() {
			var len = this.options.array.length;
			if(this.options.array[0][0] < 0 || this.options.array[0][1] < 0 || this.options.array[0][0] >= this.options.canvasSize / 10 ||  this.options.array[0][1] >= this.options.canvasSize / 10)
				{
					this.options.gameOver = true;
					return;
				}
			for(var i = len - 1; i > 0; i--) {
				if(this.options.array[0][0] == this.options.array[i][0] && this.options.array[0][1] == this.options.array[i][1])
					this.options.gameOver = true;
			}
		},
		eatFood: function() {
			var len = this.options.array.length;
			var last = [this.options.array[len-1][0], this.options.array[len-1][1]];
			if(this.options.food[0] == this.options.array[0][0] && this.options.food[1] == this.options.array[0][1])
			{
				this.options.array.push(last);

				this.options.score += 10;
				scoreInput.value = this.options.score;

				this.createFood();
			}
			
		}

	};

	var boxHeight = document.documentElement.clientHeight;
	var boxWidth = document.documentElement.clientWidth;
	var popBox = document.createElement("div");
	document.body.appendChild(popBox);
	popBox.style.cssText = "width:" + boxWidth +"px;  height:" + boxHeight + "px;background:rgba(2,187,153,0.3);display:none;z-index:5;position:absolute;top:0;left:0;";

	var p = document.createElement("p");
	p.innerHTML = "<h2>Sorry~</h2>";
	popBox.appendChild(p);
	p.style.cssText = "position:absolute;top:" + (boxHeight/2-19) +"px;left:"+ (boxWidth/2-50) +"px;";
		
	var a = document.createElement("a");
	a.innerHTML = "<h1>再来一局！</h1>";
	popBox.appendChild(a);
	a.style.cssText = "color:red;position:absolute;top:" + (boxHeight/2+10) +"px;left:"+ (boxWidth/2-90) +"px;cursor:pointer;";
	
	function pop() {
		popBox.style.display = "block";
		a.onclick = function() {
			popBox.style.display = "none";
			snake.options.array = [[4,0],[3,0],[2,0],[1,0],[0,0]];
			snake.options.gameOver = false;
			snake.options.forward = [1,0];
			snake.options.keyCode = 39;
			snake.options.score = 0;
			scoreInput.value = 0;
			snake.createFood();
			loop();
		}
	}

	document.body.onkeydown = function(e) {
		e = e||window.event;
		var keyCode = e.keyCode;
		snake.options.keyCode = keyCode;
	}

	var scoreInput = document.getElementById("score");
	snake.createFood();
	loop();
	function loop() {		
		if(snake.options.gameOver)
		{
			pop();return;
		}
		snake.go();
		snake.draw();
		setTimeout(loop,200);
	}
})();