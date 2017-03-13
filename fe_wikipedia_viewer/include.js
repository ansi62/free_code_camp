$(function() {
    $("#search").on("click", function() {
        searchWiki();
    });

    $("#query").keypress(function(key) {
        if ( key.which == 13 ) {
           event.preventDefault();
           $("#search").focus();
           searchWiki();
        }
    });

    $("#query").focus(function(key) {
        $("#query").val('');
        $("#search-result").html('');
    });

    function searchWiki() {
        var urlData = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&callback=?&srsearch=';
        urlData += encodeURI($('#query').val());

        $("#search-result").html('');

        $.getJSON(urlData, function(json) {
            json.query.search.forEach(function(entry) {
                $("#search-result").append(
                    '<div class="row entry-block"><div class="col-sm-4"><a href="https://en.wikipedia.org/wiki/' +
                    encodeURI(entry.title) +
                    '" target="_blank" class="entry-title">' + entry.title + '</a></div>' +
                    '<div class="col-sm-8 entry-snippet">' + entry.snippet + '</div></div>'
                );
            });
        });
    }
});
