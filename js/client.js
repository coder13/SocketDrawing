var path = "M ";

$(function() {

    var svgCon = $("#mainSvg");
    svgCon.on("click", function(event) {
        path += event.offsetX + "," + event.offsetY + " ";

        document.getElementById('path').setAttribute("d", path);
    });


    var iosocket = io.connect();

    iosocket.on('connect', function () {
        $('#status').text('Status: Connected');
    });

    iosocket.on('message', function(message) {
        $('#textArea').val(message);
    });
    
    iosocket.on('disconnect', function() {
        $('#status').text('Status: Disconnected');
    });
});