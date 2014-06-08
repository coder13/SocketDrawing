var svgCon,
    ID, 
    currentPath,
    paths = [];

$(function() {
    var iosocket = io.connect();

    iosocket.on("connect", function () {
        $("#status").text("Connected");
    });
    
    iosocket.on("disconnect", function() {
        $("#status").text("Disconnected");
    });

    svgCon = $("#mainSvg");

    iosocket.on("init", function (data) {
        var initData = JSON.parse(data);
        console.log(data);
        ID = initData.id;
        $("#id").text(initData.id);
        paths = initData.data;
        console.log(paths);
        paths.forEach(function (p) {
            createPathFromData(p);
        });
    });

    iosocket.on('update', function (data) {
        data = JSON.parse(data);
        if (data.owner == ID)
            return;
        paths.forEach(function (p) {
            if (p) {
                if (p.owner == data.owner && p.id == data.id) {
                    p.d = data.d;
                    return;
                }
            }
        });
        paths.push(createPathFromData(data));
    });
        
    $("#clear").on("click", function () {
        iosocket.emit('clear', 'all');
    });
    
    svgCon.on("mousedown", function(event) {
        currentPath = createPath(ID);
        iosocket.emit('create', JSON.stringify(currentPath));
    });

    svgCon.on("mousemove", function(event) {
        if (currentPath != null) {
            currentPath.d += Math.round(event.offsetX/5)*5 + "," + Math.round(event.offsetY/5)*5 + " ";
            $("#" + currentPath.id).attr({d: currentPath.d});
            iosocket.emit('update', JSON.stringify(currentPath));
        }
    });

    svgCon.on("mouseup", function(event) {
        paths.push({owner: currentPath.owner, id: currentPath.id, d: currentPath.d});
        currentPath = null;
    });
});

function createPath(owner) {
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.id = 'path_' + owner + "_" + (paths.length).toString();
        svgPath.setAttribute("class", "line");
        svgPath.className += owner;
    document.getElementById('mainSvg').appendChild(svgPath);

    return {owner: owner, id: svgPath.id, d: 'M '};
}

function createPathFromData(path) {
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.id = path.id
        svgPath.setAttribute("class", "line");
        svgPath.setAttribute("d", path.d);
        svgPath.className += path.owner;
    document.getElementById('mainSvg').appendChild(svgPath);
}