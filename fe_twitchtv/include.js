$(function() {
    var channelArray = [
        "freecodecamp",
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "storbeck",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas",
        "brunofin",
        "comster404"
    ];

    var base_url = "https://wind-bow.gomix.me/twitch-api";

    $("#channel-list").html('');

    $.each(channelArray, function(idx, obj) {
        var template = '<div id="ch-' + obj + '" class="row ch"></div>';
        $("#channel-list").append(template);
        var channelUrl = base_url + '/channels/' + encodeURI(obj) + '?callback=?';
        var streamUrl = base_url + '/streams/' + encodeURI(obj) + '?callback=?';
        $.getJSON(channelUrl, function(jsonChannel) {
            if (jsonChannel.error === undefined) {
                $('#ch-' + obj).append('<div class="col-sm-2"><a href="' + jsonChannel.url + '" target="_blank"><img src="' +
                    jsonChannel.logo + '" class="img-responsive logo"></a></div>'
                );
                $('#ch-' + obj).append('<div class="col-sm-4"><a href="' + jsonChannel.url +
                    '" target="_blank" style="margin-bottom:4px;">' + jsonChannel.display_name + '</a></div>'
                );
                $.getJSON(streamUrl, function(jsonStream) {
                    if (jsonStream.stream === null) {
                        var info = '<small>Not streaming</small>';
                    } else {
                        var info = '<p><small>Now streaming:</small></p><div><a href="' + jsonStream.stream.channel.url +
                            '" target="_blank"><img src="' + jsonStream.stream.preview.small +
                            '" class="img-responsive"></a></div><small><div>Game: ' + jsonStream.stream.game +
                            '</div><div>Status: ' + jsonStream.stream.channel.status + '</div></small>';
                    }
                    $('#ch-' + obj).append('<div class="col-sm-6">' + info + '</div>');
                    $('#ch-' + obj).css('visibility', 'visible');
                });
            } else {
                $('#ch-' + obj).append('<div class="col-sm-2"><img src="stop.png" class="img-responsive logo"></div></div>');
                $('#ch-' + obj).append('<div class="col-sm-4">' + obj + '</div>');
                $('#ch-' + obj).append(
                    '<div class="col-sm-6"><small><span class="not-exists">This channel doesn\'t exist (any more)</div>'
                );
                $('#ch-' + obj).css('visibility', 'visible');
            }
        });
    });
});
