function TBarChart (canvas, data, options) {
  this.canvas = document.getElementById('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.current = 0;
  this.data = data;
  this.dataLength = data.length;
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.padding = 0;
  this.yEqual = 5;                            // y轴分成5等分
  this.yLength = 0;                           // y轴坐标点之间的真实长度
  this.xLength = 0;                           // x轴坐标点之间的真实长度
  this.yFictitious = 0;                       // y轴坐标点之间显示的间距
  this.yRatio = 0;                            // y轴坐标真实长度和坐标间距的比
  this.current = 0;           // 初始化的动画 起始值
  this.currentIndex = -1;     // hover 到第几条bar
  this.onceMove = -1;         // 缓存曾经hover的bar
  this.looped = null;         // 是否循环
  this.init(options)
}

TBarChart.prototype = {
  init: function (options) {
    if (options) {
      this.padding = options.padding || 50;
      this.bgColor = options.bgColor || '#839db9';
      this.title = options.title;
      this.bgColor = options.bgColor;
      this.titleColor = options.titleColor;
      this.titlePosition = options.titlePosition || 'top';
      this.fillColor = options.fillColor || '#72f6ff';
      this.fillHoverColor = options.fillHoverColor || '#f40';
      this.axisColor = options.axisColor || '#eeeeee';
      this.contentColor = options.contentColor || '#bbbbbb';
      this.yEqual = options.yEqual || 5;

      this.yLength = Math.floor((this.height - this.padding * 2) / this.yEqual);     // y轴每段的真实长度
      this.xLength = Math.floor((this.width - this.padding * 2) / this.dataLength);  // x轴每段的真实长度
      // this.yLength = Math.floor((this.height - this.padding * 2 - 10) / this.yEqual);
      // this.xLength = Math.floor((this.width - this.padding * 1.5 - 10) / this.dataLength);
      this.yFictitious = this.getYFictitious(this.data);
      this.yRatio = this.yLength / this.yFictitious;

      this.looping()
    }
  },
  looping: function () {
    this.looped = requestAnimationFrame(this.looping.bind(this))
    if (this.current < 100) {
      this.current = (this.current + 3) < 100 ? this.current + 3 : 100
      this.drawUpate()
      this.drawAnimation();
    } else {
      window.cancelAnimationFrame(this.looped)
      this.watchHover()
      this.looped = null
    }
  },
  /**
   * y轴坐标点之间显示的间距
   * @param data 
   * @return y轴坐标间距
   */
  getYFictitious: function (data) {
    var arr = data.slice(0)
    arr = arr.sort((a, b) => -(a.value - b.value))
    var len = Math.ceil(arr[0].value / this.yEqual);
    var pow = len.toString().length - 1;
    pow = pow > 2 ? 2 : pow;
    return Math.ceil(len / Math.pow(10,pow)) * Math.pow(10,pow);
  },
  drawUpate: function () {
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.drawAxis();
    this.drawPoint();
    this.drawTitle();
  },
  drawAnimation: function () {
    for (let i = 0; i < this.data.length; i++) {
        var x = Math.ceil(this.data[i].value * this.current / 100 * this.yRatio);
        var y = this.height - this.padding - x;
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(this.padding + this.xLength * (i + 0.25), y, this.xLength/2, x);
        // 保存每个柱状的信息
        this.data[i].left = this.padding + this.xLength * (i + 0.25);
        this.data[i].top = y;
        this.data[i].right = this.padding + this.xLength * (i + 0.75);
        this.data[i].bottom = this.height - this.padding;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            this.data[i].value * this.current / 100,
            this.data[i].left + this.xLength / 4, 
            this.data[i].top - 5
        );
    }
  },
  drawTitle: function () {
    // 标题
    if(this.title){                      // 也不一定有标题
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000000';  // 颜色，也可以不用写死，个性化嘛
      this.ctx.font = '16px Microsoft YaHei'
      if(this.titlePosition === 'bottom' && this.padding >= 40){
        this.ctx.fillText(this.title, this.width / 2, this.height - 5)
      }else{
        this.ctx.fillText(this.title, this.width / 2, this.padding / 2)
      }
  }
  },
  watchHover: function () {
    var self = this;
    self.canvas.addEventListener('mousemove', function (ev) {
      ev = ev || window.event;
      self.currentIndex = -1;
      for (let i = 0; i < self.dataLength; i++) {
        if (ev.offsetX > self.data[i].left &&
            ev.offsetX < self.data[i].right &&
            ev.offsetY > self.data[i].top &&
            ev.offsetY < self.data[i].bottom
        ) {
          self.currentIndex = i
          console.log('i', i, ev.offsetX, ev.offsetY, self.data[i])
        }
      }
      self.drawHover()
    })
  },
  drawHover: function() {
    if(this.currentIndex !== -1){
        var index = this.currentIndex;
        var x = Math.ceil(this.data[index].value * this.yRatio);
        var y = this.height - this.padding - x;
        if(this.onceMove === -1){
            this.onceMove = index;
            this.canvas.style.cursor = 'pointer';
            this.ctx.fillStyle = this.fillHoverColor;
            this.ctx.fillRect(this.padding + this.xLength * (index + 0.25), y, this.xLength/2, x);
            this.ctx.fillText(
                this.data[index].value,
                this.data[index].left + this.xLength / 4, 
                this.data[index].top - 5
            );
        }
    }else{
        if(this.onceMove !== -1){
            var x = Math.ceil(this.data[this.onceMove].value * this.yRatio);
            var y = this.height - this.padding - x;
            var index = this.onceMove;
            this.ctx.fillStyle = this.fillColor;
            this.ctx.fillRect(this.padding + this.xLength * (index + 0.25), y, this.xLength/2, x);
            this.ctx.fillText(
                this.data[index].value,
                this.data[index].left + this.xLength / 4, 
                this.data[index].top - 5
            );
            this.onceMove = -1;
            this.canvas.style.cursor = 'inherit';
        }
    }
  },
  // 绘制x y 轴上的刻度
  drawPoint: function () {
    this.ctx.beginPath();
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.axisColor;
    this.ctx.font = '12px Microsoft YaHei';
    // this.ctx.strokeStyle = '#000000';
    // x轴刻度和值
    for (var i = 0; i < data.length; i++) {
        var xAxis = this.data[i].xAxis;
        var xlen = this.xLength * (i + 1);
        this.ctx.moveTo(this.padding + xlen, this.height - this.padding);
        this.ctx.lineTo(this.padding + xlen, this.height - this.padding + 5);
        this.ctx.stroke();                                 // 画轴线上的刻度
        this.ctx.fillText(xAxis, this.padding + xlen - this.xLength / 2, this.height - this.padding + 15);   // 填充文字
    }

    // y轴刻度和值
    // 画0坐标
    // this.ctx.moveTo(this.padding + .5, this.height - this.padding);
    // this.ctx.lineTo(this.padding - 4.5, this.height - this.padding);
    this.ctx.beginPath();
    this.ctx.textAlign = 'right';
    this.ctx.fillText(0, this.padding - 15, this.height - this.padding + 3);   // 填充文字
    for (var i = 0; i < data.length; i++) {
        var ylen = this.yLength * (i + 1);
        var y = 1000 * (i + 1);
        this.ctx.moveTo(this.padding + .5, this.height - this.padding - ylen);
        this.ctx.lineTo(this.padding - 4.5, this.height - this.padding - ylen);
        this.ctx.stroke();                                       // 画轴线上的刻度
        this.ctx.fillText(y, this.padding - 15, this.height - this.padding - ylen + 3);   // 填充文字

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.contentColor;
        this.ctx.moveTo(this.padding + .5, this.height - this.padding - ylen + 0.5);
        this.ctx.lineTo(this.width - this.padding / 2 + 0.5, this.height - this.padding - ylen + 0.5);
        this.ctx.stroke();   
    }
  },
  // 绘制x y 轴
  drawAxis: function () {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.axisColor;
    // y轴线, +0.5是为了解决canvas画1像素会显示成2像素的问题
    this.ctx.moveTo(this.padding + .5, this.height - this.padding + .5);
    this.ctx.lineTo(this.padding + .5, this.padding + .5 - 10);
    // x 轴
    this.ctx.moveTo(this.width  - this.padding / 2 + 0.5, this.height - this.padding + .5);
    this.ctx.lineTo(this.padding + .5, this.height - this.padding + .5);
    this.ctx.stroke();
  },
}