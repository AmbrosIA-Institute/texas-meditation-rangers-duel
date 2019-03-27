import $ from 'jquery';


const defaults = {

  samplesPerSecond : 10,

  maxFrequencyBin : 256, 

  rescaleFactor : 0.2,

  channels : 4

}

class FFT
{
  constructor( element, config )
  {
    // Set container element
    this.element = $(element);

    // Extend default config 
    this.config  = $.extend( defaults, config );

    // Get dimensions
    this.width  = $(element).outerWidth();
    this.height = $(element).outerHeight();


    this.barEdgeColor = 0x0000FF;
    this.barFillColor = 0x00FF00;
    this.demoMode = true;
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.boundAnimate = this.animate.bind(this);

    this.stopped = true;

    // Set renderer
    this.renderer = config.renderer || PIXI.autoDetectRenderer();

  }

  get view()
  {
    return this.renderer.view;
  }

  start()
  {
    this.stopped = false;
    this.setup();
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
    for (channel = 0; channel < this.config.channels; channel++) {
        this.channelData.push([]);
        for (i = 0; i <= this.config.maxFrequencyBin; i++) {
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

    for (i = 0; i<= this.config.maxFrequencyBin; i++) {
        for (channel = 0; channel < this.config.channels; channel++) {
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
    let channelHeight = this.height / this.config.channels;
    let barWidth =  this.width / (this.config.maxFrequencyBin + 1);
    let barTop, barLeft, barHeight;

    graphics.clear();

    graphics.lineStyle(this.barEdgeWidth, this.barEdgeColor, 1);

    for (channel = 0; channel < this.config.channels; channel++) {
        top = Math.round(channelHeight * channel);
        bottom = top + channelHeight;
        for (i = 0; i<= this.config.maxFrequencyBin; i++) {
            barLeft = i * barWidth;
            barHeight = this.channelData[channel][i] * this.config.rescaleFactor;
            barHeight = Math.min(barHeight, channelHeight);
            barTop = bottom - barHeight;
            graphics.beginFill(this.barFillColor, 1);
            graphics.drawRect(barLeft, barTop, barWidth, barHeight);
            graphics.endFill();
        }
    }
  }


  reset()
  {
    this.charts.clear();
    this.element.empty();
  }






}

export default FFT;