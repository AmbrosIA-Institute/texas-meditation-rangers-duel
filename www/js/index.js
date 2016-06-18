
var total_p1_packets = 0;
var packets_between_refresh = 4;
var fft_since_last_refresh = [packets_between_refresh, packets_between_refresh];
var track_mellow = [0.0, 0.0];
var track_score = [0.0, 0.0];
var timer_tracking;
var clock;
var start = new Date().getTime();
var end = new Date().getTime();
var two_player_mode = true;
var game_started = false;


function chart_update_for_data(sel, data) {
    var clip = 1000;
    data[0] = clip;
    d3.select(sel).selectAll("div.bar")
        .data(data)
        .style("height", function(d) {
            var value = (d > clip) ? clip : d;
            var barHeight = Math.floor(value / 20.0);
            return barHeight + "px";
        });
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
            total_p1_packets += 1;
            if (total_p1_packets % 50 == 0) {
                end = new Date().getTime();
                var time = end - start;
                start = end;
                //console.log('Cycle time: ' + time);
            }
            if (fft_since_last_refresh[0] >= packets_between_refresh) {
                chart_update_for_data("#myChart0", response['values0']);
                chart_update_for_data("#myChart1", response['values1']);
                chart_update_for_data("#myChart2", response['values2']);
                chart_update_for_data("#myChart3", response['values3']);
                fft_since_last_refresh[0] = 0;
            }
            else {
                fft_since_last_refresh[0] += 1;
            }
        }
        if (headset == 1 && two_player_mode) {
            if (fft_since_last_refresh[1] >= packets_between_refresh) {
                chart_update_for_data("#myChart4", response['values0']);
                chart_update_for_data("#myChart5", response['values1']);
                chart_update_for_data("#myChart6", response['values2']);
                chart_update_for_data("#myChart7", response['values3']);
                fft_since_last_refresh[1] = 0;
            }
            else {
                fft_since_last_refresh[1] += 1;
            }
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


function setup_chart(sel, data) {
    d3.select(sel).selectAll("div.bar")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "bar")
        .style("height", function(d) {
            var barHeight = d * 5;
            return barHeight + "px";
        });
}


function setup_initial_data() {
    dataset = [];
    for (i = 0; i < 120; i++) {
        dataset[i] = 15;
    }
    setup_chart("#myChart0", dataset);
    setup_chart("#myChart1", dataset);
    setup_chart("#myChart2", dataset);
    setup_chart("#myChart3", dataset);
    setup_chart("#myChart4", dataset);
    setup_chart("#myChart5", dataset);
    setup_chart("#myChart6", dataset);
    setup_chart("#myChart7", dataset);
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


$(document).ready(function() {
    setup_initial_data();
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
        $('#head0').html('Player 1');
        $('#head1').html('Player 2');
        $("#game").hide();
        $("#splash").show();
    });
    $("#continue").bind("click", function(event) {
        $("#splash").hide();
        $("#game").show();
    });
});


document.addEventListener('deviceready', function() {
    console.log("device ready");
    go_fullscreen();
}, false);
