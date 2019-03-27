import $ from 'jquery';


class FFT
{

  constructor( element, config )
  {
    this.element = $(element);

    this.config  = config || {};

    this.samplesPerSecond = this.config.samplesPerSecond || 10;
    this.maxFrequencyBin  = this.config.maxFrequencyBin || 256;
    this.rescaleFactor    = this.config.rescaleFactor || 0.2;
    this.channels         = this.config.channels || 4;

    this.width  = $(element).outerWidth();
    this.height = $(element).outerHeight();

    this.barEdgeColor = 0x0000FF;
    this.barFillColor = 0x00FF00;
    this.demoMode = true;
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.boundAnimate = this.animate.bind(this);

    this.stopped = true;

    // console.log(this.channels);

    //console.log(PIXI);
    //console.log(PIXI.audoDetectRenderer);

    this.renderer = PIXI.autoDetectRenderer();

    // console.log(this.renderer);

  }

  get view()
  {
    return this.renderer.view;
  }

  start()
  {
    this.stopped = false;
    this.setup();
    // console.log(this.renderer);
    this.element.html(this.view);
    this.animate();
  }

  stop()
  {
    this.stopped = true;
  }

  animate(time)
  {
    if (! this.stopped) {
        requestAnimationFrame(this.boundAnimate);
        this.doFrame(time);
        this.renderer.render(this.stage);
    }
    this.stopped = false;
  }

  doFrame(time)
  {
    if (this.demoMode) this.updateSampleData();

    this.drawCharts();
  }


  setup()
  {
    this.initChannelData();
    this.initChartDisplay();
    if (this.demoMode) this.updateSampleData();
  }

  initChartDisplay()
  {
    let graphics = new PIXI.Graphics();
    this.charts = graphics;
    this.stage.addChild(graphics);
  }

  initChannelData()
  {
    let i, channel;
    this.channelData = [];
    for (channel = 0; channel < this.channels; channel++) {
        this.channelData.push([]);
        for (i = 0; i <= this.maxFrequencyBin; i++) {
            this.channelData[channel].push(0);
        }
    }
  }

  setChannelData(data)
  {
    this.channelData = data;
  }

  updateSampleData()
  {
    let i, channel;
    let jitter, value;
    let jitter_factor = 10;
    let scale_wave = 40;
    let widen_wave = 5;
    let offset = Math.PI / 2;

    for (i = 0; i<= this.maxFrequencyBin; i++) {
        for (channel = 0; channel < this.channels; channel++) {
            jitter = (jitter_factor * (channel + 2) * Math.random());
            value = (Math.sin((i / widen_wave) + (channel * offset)) * scale_wave) + scale_wave + jitter + jitter_factor;
            //value = Math.min(value, 1.0);
            this.channelData[channel][i] = value;
        }
    }
  }


  drawCharts()
  {
    let i, channel, top, bottom;
    let graphics = this.charts;
    let channelHeight = this.height / this.channels;
    let barWidth =  this.width / (this.maxFrequencyBin + 1);
    let barTop, barLeft, barHeight;

    graphics.clear();

    graphics.lineStyle(this.barEdgeWidth, this.barEdgeColor, 1);

    for (channel = 0; channel < this.channels; channel++) {
        top = Math.round(channelHeight * channel);
        bottom = top + channelHeight;
        for (i = 0; i<= this.maxFrequencyBin; i++) {
            barLeft = i * barWidth;
            barHeight = this.channelData[channel][i] * this.rescaleFactor;
            barHeight = Math.min(barHeight, channelHeight);
            barTop = bottom - barHeight;
            graphics.beginFill(this.barFillColor, 1);
            graphics.drawRect(barLeft, barTop, barWidth, barHeight);
            graphics.endFill();
        }
    }
  }






}

export default FFT;