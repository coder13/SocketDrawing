$(function() {
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

    $('#textArea').on("input propertychange", function(event) {
        iosocket.send($('#textArea').val());   
    });
});