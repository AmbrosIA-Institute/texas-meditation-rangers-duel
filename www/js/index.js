
var track_mellow = [0.0, 0.0];
var track_score = [0.0, 0.0];
var timer_tracking;
var clock;
var two_player_mode = true;
var game_started = false;
var fft_widgets = [{}, {}];


function chart_update_for_data(player, channel, data) {
    var clip = 0;
    data[0] = clip;
    fft_widgets[player].channelData[channel] = data;
}


function handle_connect_response(headset, response) {
    if (typeof response == 'string') {
        console.log(JSON.stringify(response, null, 4));
    }
    else if (response['type'] == 'HORSESHOE') {
    }
    else if (response['type'] == 'BATTERY') {
    }
    else if (response['type'] == 'ACCELEROMETER') {
    }
    else if (response['type'] == 'QUANTIZATION') {
    }
    else if (response['type'] == 'ARTIFACT') {
    }
    else if (response['type'] == 'DRL_REF') {
    }
    else if (response['type'] == 'MELLOW') {
        var height = Math.floor(400 * response['value']);
        track_mellow[headset] = response['value'];
        if (headset == 0) {
            $('#mellow0').height(height);
        }
        if (headset == 1) {
            $('#mellow1').height(height);
        }
    }
    else if (response['type'] == 'CONCENTRATION') {
    }
    else if (response['type'] == 'ALPHA_ABSOLUTE') {
    }
    else if (response['type'] == 'THETA_ABSOLUTE') {
    }
    else if (response['type'] == 'GAMMA_ABSOLUTE') {
    }
    else if (response['type'] == 'DELTA_ABSOLUTE') {
    }
    else if (response['type'] == 'BETA_ABSOLUTE') {
    }
    else if (response['type'] == 'FFT') {
        if (headset == 0) {
            chart_update_for_data(0, 0, response['values0']);
            chart_update_for_data(0, 1, response['values1']);
            chart_update_for_data(0, 2, response['values2']);
            chart_update_for_data(0, 3, response['values3']);
        }
        if (headset == 1 && two_player_mode) {
            chart_update_for_data(1, 0, response['values0']);
            chart_update_for_data(1, 1, response['values1']);
            chart_update_for_data(1, 2, response['values2']);
            chart_update_for_data(1, 3, response['values3']);
        }
    }
    else {
        console.log(JSON.stringify(response, null, 4));
    }
}


function list_headsets() {
    MusePlugin.list(function(response) {
        console.log(JSON.stringify(response, null, 4));
    });
}


function pad(val, pad) {
    str = '';
    for (i = 0; i < pad; i++) {
        str = String(str + '0');
    }
    return String(str+val).slice(-1 * pad);
}


function player_text(score, clock, minutes, seconds) {
    var clock_txt = minutes + ':' + pad(seconds, 2);
    if (clock == 0) {
        clock_txt = 'Final';
    }
    return 'Score: ' + pad(score, 4) + ' - ' + clock_txt;
}


function update_game_display() {
    var minutes = Math.floor(clock / 60);
    var seconds = clock - minutes * 60;
    $('#head0').html(player_text(track_score[0], clock, minutes, seconds));
    $('#head1').html(player_text(track_score[1], clock, minutes, seconds));
}


function stop_game() {
    window.clearInterval(timer_tracking);
    game_started = false;
}


function start_game() {
    if (!game_started) {
        game_started = true;
        track_score = [0.0, 0.0];
        clock = 180;
        update_game_display();
        timer_tracking = setInterval(function() {
            clock = clock - 1;
            if (clock <= 0) {
                window.clearInterval(timer_tracking);
                game_started = false;
            }
            for (i = 0; i < 2; i++) {
                scaled = track_mellow[i] * 100;
                if (scaled > 90) {
                    track_score[i] += 15;
                } else if (scaled > 80) {
                    track_score[i] += 3;
                } else if (scaled > 75) {
                    track_score[i] += 1;
                }
            }
            update_game_display();
        }, 1000);
    }
}


function go_fullscreen() {
    AndroidFullScreen.isSupported(function() {
        //console.log("Plugin supported");
        AndroidFullScreen.isImmersiveModeSupported(function() {
            //console.log("Immersive mode supported");
            AndroidFullScreen.immersiveMode(function() {
                //console.log("In immersive mode");
            }, function() {
                //console.log("Failed to enter immersive mode");
            });
        }, function() {
            //console.log("Immersive mode not supported");
        });
    }, function() {
        //console.log("Plugin not supported");
    });
}


function show_fft(container) {
    var container_height = 400;
    var container_width = 500;
    var fftwidget = new FFTWidget(container_width, container_height);
    fftwidget.renderer.backgroundColor = 0xFFFFFF;
    fftwidget.demoMode = false;
    fftwidget.maxFrequencyBin = 128;
    fftwidget.rescaleFactor = 0.12;
    container.html(fftwidget.getView());
    fftwidget.animate();
    return fftwidget;
}


function customScaleThisScreen() {
    var contentWidth = document.body.scrollWidth, 
        windowWidth = window.innerWidth - 8,
        newScale = windowWidth / contentWidth;
    document.body.style.zoom = newScale;
}


$(document).ready(function() {
    fft_widgets[0] = show_fft($('#displayPlayer1').first());
    fft_widgets[1] = show_fft($('#displayPlayer2').first());
    $("#connect0").bind("click", function(event) {
        console.log("stuff ...");
        MusePlugin.connect(0, function(response) { 
            handle_connect_response(0, response); 
        });
    });
    $("#connect1").bind("click", function(event) {
        console.log("stuff ...");
        MusePlugin.connect(1, function(response) { 
            handle_connect_response(1, response); 
        });
    });
    $("#disconnect0").bind("click", function(event) {
        MusePlugin.disconnect(0);
    });
    $("#disconnect1").bind("click", function(event) {
        MusePlugin.disconnect(1);
    });
    $("#listheadsets").bind("click", function(event) {
        MusePlugin.list(function(response) {
            console.log(JSON.stringify(response, null, 4));
        });
    });
    $("#start").bind("click", function(event) {
        start_game();
    });
    $("#reset").bind("click", function(event) {
        stop_game();
        $('#head0').html('Player 1');
        $('#head1').html('Player 2');
        //$("#game").hide();
        //$("#splash").show();
        //customScaleThisScreen();
    });
    $("#continue").bind("click", function(event) {
        $("#splash").hide();
        $("#game").show();
        customScaleThisScreen();
    });
    $(window).resize(function(){
        customScaleThisScreen();
    });
});


document.addEventListener('deviceready', function() {
    console.log("device ready");
    customScaleThisScreen();
    go_fullscreen();
    customScaleThisScreen();
}, false);
