$(function() {
    $("#navClickHome").on("click", function() {
        changeImportLink('include-home.html');
    });
    $("#navClickGrid").on("click", function() {
        changeImportLink('include-grid.html');
    });
    $("#navClickTable").on("click", function() {
        changeImportLink('include-table.html');
    });
});
