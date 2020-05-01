class Game {
  constructor() {
    this.cnv = null;
    this.ctx = null;
    this.width = 200;
    this.height = 400;
    this.box = {
      w: 10,
      h: 10,
      x: 0,
      y: 0,
    };
    this.level = 1;
    this.movingParams = {
      speed: 0.5,
      direction: "r",
    };
    this.footprints = [];
    this.start = true;
    this.score = 0;
  }

  init() {
    this.create_canvas();
  }

  create_canvas() {
    this.cnv = document.createElement("canvas");
    this.ctx = this.cnv.getContext("2d");

    this.set_size();

    document.querySelector("#canvas_box").prepend(this.cnv);

    this.update_box_params();
  }

  cleaning_canvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  update_box_params() {
    this.box.y = this.height - this.level * this.box.h;

    if (this.box.x < 1) {
      this.movingParams.direction = "r";
    } else if (this.box.x > this.width - 11) {
      this.movingParams.direction = "l";
    }

    if (this.movingParams.direction === "r") {
      this.box.x += this.movingParams.speed;
    } else {
      this.box.x -= this.movingParams.speed;
    }

    this.draw();

    if (this.start) {
      if (this.level < Math.floor(this.height / 10)) {
        window.requestAnimationFrame(() => this.update_box_params());
      } else {
        this.game_notification();
      }
    }
  }

  draw() {
    this.clear_box_way();

    this.ctx.fillStyle = "purple";
    this.ctx.fillRect(this.width / 2 - 8, 0, 16, this.height);

    this.footprints.forEach((f) => {
      this.ctx.fillStyle = f.color;
      this.ctx.fillRect(f.x, f.y, 10, 10);
    });

    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(this.box.x, this.box.y, this.box.w, this.box.h);
  }

  clear_box_way() {
    this.ctx.fillStyle = "#000";

    if (this.movingParams.direction === "r") {
      this.ctx.fillRect(
        this.box.x - this.box.w,
        this.box.y,
        this.box.w,
        this.box.h
      );
    } else {
      this.ctx.fillRect(
        this.box.x + this.box.w,
        this.box.y,
        this.box.w,
        this.box.h
      );
    }
  }

  set_size() {
    this.cnv.height = this.height;
    this.cnv.width = this.width;
  }

  set_speed(speed) {
    this.movingParams.speed = speed;
  }

  set_box_footprint() {
    let footprint_color = null;

    if (
      this.box.x >= this.width / 2 - 8 &&
      this.box.x + this.box.w <= this.width / 2 + 8
    ) {
      footprint_color = "blue";
      this.score++;
    } else {
      footprint_color = "red";
    }

    this.footprints.push({
      x: this.box.x,
      y: this.box.y,
      color: footprint_color,
    });
    this.level++;
    this.movingParams.speed += 0.1;
  }

  game_sounds(type) {
    let audio = document.createElement("audio");
    let audioBox = document.querySelector("#sound");

    if (audioBox.children.length > 10) {
      audioBox.innerHTML = "";
    }

    audio.setAttribute("autoplay", "true");
    if (type === "click") {
      audio.innerHTML =
        '<source src="./assets/audios/click.mp3" type="audio/mpeg">';
    } else {
      if (Math.floor(Math.random() * 2) === 0) {
        audio.innerHTML =
          '<source src="./assets/audios/theme1.mp3" type="audio/mpeg">';
      } else {
        audio.innerHTML =
          '<source src="./assets/audios/theme2.mp3" type="audio/mpeg">';
      }
    }
    audioBox.appendChild(audio);
  }

  game_stop(state) {
    this.start = state;

    if (state && this.level < Math.floor(this.height / this.level)) {
      this.update_box_params();
    }
  }

  game_notification() {
    this.game_sounds("stop");
    document.querySelector("#notification").innerText = "game over";
    document.querySelector("#modal_win button").style.display = "inline-block";
  }

  restart() {
    document.querySelector("#notification").innerText = "";
    document.querySelector("#modal_win button").style.display = "none";
    document.querySelector("#canvas_box").innerHTML = "";

    this.cnv = null;
    this.ctx = null;
    this.width = 200;
    this.height = 400;
    this.box = {
      w: 10,
      h: 10,
      x: 0,
      y: 0,
    };
    this.level = 1;
    this.movingParams = {
      speed: 0.5,
      direction: "r",
    };
    this.footprints = [];
    this.start = true;
    this.score = 0;

    this.init();
  }
}

let game = new Game();
let score = document.querySelector("#score");
let restart_btn = document.querySelector("#modal_win button");

score.innerText = game.score;

window.addEventListener("load", game.init());
window.addEventListener("resize", () => {
  game.set_size();
  game.cleaning_canvas();
});
document.documentElement.addEventListener("mousedown", (e) => {
  if (e.target.tagName === "BUTTON") {
    game.restart();
  } else {
    game.set_box_footprint();
    game.game_sounds("click");
    score.innerText = game.score;
  }
});
document.documentElement.addEventListener("mouseleave", () => {
  game.game_stop(false);
  console.log("stoped");
});
document.documentElement.addEventListener("mouseenter", () => {
  game.game_stop(true);
  console.log("started");
});
