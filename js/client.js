var svgCon,
    ID, Color,
    currentPath, cPath = [], 
    paths = [];

function isMobile(){
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match()
    // remember str.test is case sensitive
    return (/iphone|ipod|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
}

$(function() {
    console.log(isMobile());

    var iosocket = io.connect();

    iosocket.on("connect", function () {
        $("#status").text("Connected ");
    });
    
    iosocket.on("disconnect", function() {
        $("#status").text("Disconnected");
    });

    svgCon = $("#mainSvg");

    iosocket.on("init", function (data) {
        var initData = JSON.parse(data);
        ID = initData.client.id;
        Color = initData.client.color;
        $("#id").text(initData.client.id);
        paths = initData.data;
        paths.forEach(function (p) {
            createPathFromData(p);
        });
    });

    iosocket.on('update', function (data) {
        data = JSON.parse(data);
        if (data.owner == ID || !data)
            return;
        var add = true;
        paths.forEach(function (p) {
            if (p) {
                if (p.owner == data.owner && p.id == data.id) {
                    p.d = data.d;
                    $("#" + p.id).attr({d: p.d});
                    add = false;
                    return;
                }
            }
        });
        if (add) {
            paths.push(createPathFromData(data));
        }
    });
    
    svgCon.on("touchstart mousedown", function(event) {
        currentPath = createPath(ID);
        iosocket.emit('create', JSON.stringify(currentPath));
    });

    svgCon.on("touchmove mousemove", function(event) {
        event.preventDefault();
        if (currentPath != null) {
            // console.log(event);
            var p;
            if (event.originalEvent.targetTouches) {
                p = {x: event.originalEvent.targetTouches[0].clientX, y: event.originalEvent.targetTouches[0].clientY};
                p = {x: p.x-$("#mainSvg").offset().left, y: p.y-$("#mainSvg").offset().top};
            } else if (event.offsetX == undefined) { // firefox
                if (event.pageX)
                    p = {x: event.pageX-$("#mainSvg").offset().left, y: event.pageY-$("#mainSvg").offset().top};
            } else {
                p = {x: event.offsetX, y: event.offsetY};
            }
            if (p){
                currentPath.d += p.x + "," + p.y + " ";
                $("#" + currentPath.id).attr({d: currentPath.d});
                iosocket.emit('update', JSON.stringify(currentPath));
            }
        }
    });

    svgCon.on("touchend touchcancel mouseup", function(event) {
        if (currentPath) {
            paths.push({owner: ID, color: currentPath.color, id: currentPath.id, d: currentPath.d});
            currentPath = null;
        }
    });
});

function createPath(owner) {
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.id = 'path_' + owner + "_" + (paths.length).toString();
        svgPath.setAttribute("class", "line " + owner);
        svgPath.setAttribute("style", "stroke:" + Color);
    document.getElementById('mainSvg').appendChild(svgPath);

    return {owner: owner, color: Color, id: svgPath.id, d: 'M '};
}

function createPathFromData(path) {
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.id = path.id;
        svgPath.setAttribute("class", "line " + path.owner);
        svgPath.setAttribute("d", path.d);
        svgPath.setAttribute("style", "stroke:" + path.color);
    document.getElementById('mainSvg').appendChild(svgPath);
    return path;
}