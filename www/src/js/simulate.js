import { interval, Observable, merge } from 'rxjs';


class SimulateClient 
{
  constructor()
  {
    this.channels = ['TP9', 'AF7', 'AF8', 'TP10'];
    this.samples  = 256;
    this.running  = false;
  }


  async connect()
  {
    let eegObservables = [];

    for( let index = 0; index < this.channels.length; index ++ )
    {
      eegObservables.push(
        new Observable( sub => { 
          setInterval( () => {

            const data = {
              electrode: index,
              index: index,
              samples: window.crypto.getRandomValues( new Uint8Array(this.samples) ),
              timestamp : performance.now()
            }

            if( this.running ) sub.next(data)
           
          }, 100);
        })
      );
    }

    this.eegReadings = merge(...eegObservables);
  }


  async start()
  {
    this.running = true;
  }

  async pause()
  {
    this.running = false;
  }

  async resume()
  {
    this.running = true;
  }


}


export default SimulateClient;