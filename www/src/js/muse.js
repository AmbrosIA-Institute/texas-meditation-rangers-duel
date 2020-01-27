const exec = require('cordova/exec');
// const exec = require('./exec.js');
// import exec from 'cordova/exec';

class Muse 
{
  refresh( success, failure ) 
  { 
      exec(success, failure, "MusePlugin", "refresh", []);
  }

  list( success, failure ) 
  { 
      exec(success, failure, "MusePlugin", "list", []);
  }

  connect( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "connect", args);
  }

  connect_index( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "connect_index", args);
  }

  connect_mac( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "connect_mac", args);
  }

  disconnect( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "disconnect", args);
  }

  disconnect_index( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "disconnect_index", args);
  }

  disconnect_mac( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "disconnect_mac", args);
  }

  disconnect_name( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "disconnect_name", args);
  }

  listen( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "listen", args);
  }

  listen_index( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "listen_index", args);
  }

  listen_mac( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "listen_mac", args);
  }

  listen_name( device, success, failure ) 
  {
      args = typeof device !== 'undefined' ? [device] : [];
      exec(success, failure, "MusePlugin", "listen_name", args);
  }

}

export default Muse;