(function(){
	$("#difficulty").val("1");

	var size;
	var difficulty;
	var pixels;
	var px;
	var ctx;
	var player;
	var queue = [];
	var direction = "none";
	var playerlength = 1;
	var apple;
	var started = false;

	const equalArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);

	$("#start").click(() => {
		size = parseInt($("#size").val());
		difficulty = parseInt($("#difficulty").val());
		pixels = Math.min(window.innerWidth, window.innerHeight) - 4;
		px = pixels / size;

		$("#input").empty();
		$("body").append("<canvas>");
		$("canvas").height(pixels)
		.width(pixels)
		.attr("height", pixels)
		.attr("width", pixels);

		$("html").keydown(e => {
			if (e.which == 37)
				queue.push("left");
			if (e.which == 38)
				queue.push("up");
			if (e.which == 39)
				queue.push("right");
			if (e.which == 40)
				queue.push("down");
		});

		ctx = $("canvas")[0].getContext("2d");
		player = [[Math.floor(size / 2), Math.floor(size / 2)]];
		while (true) {
			apple = [Math.floor(Math.random()*size), Math.floor(Math.random()*size)];
			if (!equalArray(apple, player[0]))
				break;
		}

		$("canvas").on("touchstart", e => {
			if (e.offsetX + e.offsetY < pixels) {
				if (e.offsetX + pixels - e.offsetY < pixels) {
					queue.push("left");
				}
				else {
					queue.push("up");
				}
			}
			else {
				if (e.offsetX + pixels - e.offsetY < pixels) {
					queue.push("down");
				}
				else {
					queue.push("right");
				}
			}
		});

		started = true;
		setInterval(interval, difficulty == 0 ? 1000/5 : difficulty == 1 ? 1000/10 : 1000/20);
	});

	$("html").keydown(e => {
		if (e.which == 13 && !started)
			$("#start").click();
	});

	var interval = () => {
		ctx.clearRect(0, 0, pixels, pixels);
		ctx.fillStyle = "red";
		ctx.fillRect(px * apple[0], px * apple[1], px, px)
		ctx.fillStyle = "black";
		for (let i = 0; i < playerlength; i++) {
			ctx.fillRect(px * player[player.length - 1 - i][0], px * player[player.length - 1 - i][1], px, px);
		}

		if (queue.length > 0) {
			console.log(queue);
			direction = queue[0];
			queue.splice(0, 1);
		}
		
		if (direction == "left")
			player.push([player[player.length - 1][0] - 1, player[player.length - 1][1]]);
		if (direction == "up")
			player.push([player[player.length - 1][0], player[player.length - 1][1] - 1]);
		if (direction == "right")
			player.push([player[player.length - 1][0] + 1, player[player.length - 1][1]]);
		if (direction == "down")
			player.push([player[player.length - 1][0], player[player.length - 1][1] + 1]);

		if (equalArray(player[player.length - 1], apple)) {
			console.log("apple");
			playerlength++;
			while (true) {
				apple = [Math.floor(Math.random()*size), Math.floor(Math.random()*size)];
				for (let i = 0; i < playerlength; i++)
					if (equalArray(player[player.length - 1 - i], apple))
						continue;
				break;
			}
		}
		for (let i = 1; i < playerlength; i++)
			if (equalArray(player[player.length - 1 - i], player[player.length - 1]) || player[player.length - 1][0] < 0 || player[player.length - 1][1] < 0 || player[player.length - 1][0] >= size || player[player.length - 1][1] >= size) {
				clearInterval(1);
				console.log("Stop")
				
			}
	}
})();