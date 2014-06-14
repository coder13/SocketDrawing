var svgCon,
    ID, Color,
    currentPath, cPath = [], 
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
        ID = initData.id;
        Color = initData.color;
        $("#id").text(initData.id);
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
    
    svgCon.on("mousedown", function(event) {
        currentPath = createPath(ID);
        iosocket.emit('create', JSON.stringify(currentPath));
    });

    svgCon.on("mousemove", function(event) {
        if (currentPath != null) {
<<<<<<< HEAD
            currentPath.d += Math.round(event.offsetX/5)*5 + "," + Math.round(event.offsetY/5)*5 + " ";

=======
            // console.log(event);
            if (event.offsetX == undefined) {
                p = {x: event.pageX-$("#mainSvg").offset().left, y: event.pageY-$("#mainSvg").offset().top};
            } else {
                p = {x: event.offsetX, y: event.offsetY};
            }
            // p = {x: Math.round(p.x/5)*5, y: Math.round(p.y/5)*5};
            // console.log(event.offsetX + ", " + event.offsetY);
            // if (cPath.length > 1) {
            //     if (Math.abs((cPath[cPath.length-1].y - cPath[cPath.length-2].y) / (cPath[cPath.length-1].x - cPath[cPath.length-2].x)) ==
            //         Math.abs((p.y - cPath[cPath.length-1].y) / (p.x - cPath[cPath.length-1].x))) {
            //         cPath.slice(0,-1);
            //         currentPath.split(' ').slice(0, -1).join(' ');   
            //     }
            // } else {
            //     cPath.push(p);
            // }
            currentPath.d += p.x + "," + p.y + " ";
>>>>>>> ffe557c7252d419172fe7ff4219404899622c8fe
            $("#" + currentPath.id).attr({d: currentPath.d});
            iosocket.emit('update', JSON.stringify(currentPath));
        }
    });

    svgCon.on("mouseup", function(event) {
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
<<<<<<< HEAD
        svgPath.setAttribute("style", "stroke:green");
=======
        svgPath.setAttribute("style", "stroke:" + path.color);
>>>>>>> ffe557c7252d419172fe7ff4219404899622c8fe
    document.getElementById('mainSvg').appendChild(svgPath);
    return path;
}