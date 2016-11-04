/*jslint plusplus: true, browser: true, devel: true */
/*global $:false, Frame:false, Animator:false, moveLightBeam:false, transitionBoxen:false, createSpotlight:false, getCSV:false*/
var containers = [
    {
        name: "sea",
        isFrame: true,
        items: 5,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/animations/flooding/flood",
        ext: ".png",
        scale: 1.1,
        maceroni:{needed:false}
    },
    /* Commented out because they were too darn ugly with the transparency issues!*/
    {
        name: "volcanoes",
        isFrame: false,
        items: 5,
        width: 325,
        height: 322,
        x: 274,
        y: 425,
        path: "./images/animations/volcanoes/volcano",
        ext: ".png",
        maceroni:{needed:false}
    },
    {
        name: "ice",
        isFrame: false,
        items: 5,
        width: 304,
        height: 392,
        x: 253,
        y: 350,
        path: "./images/animations/iceCaps/iceCap",
        ext: ".png",
        scale: 1.1,
        maceroni:{needed:false}
    },
    {
        name: "insolation",
        isFrame: true,
        items: 5,
        width: 334,
        height: 412,
        x: -4,
        y: 214,
        path: "./images/animations/lightRays/lightRay",
        ext: ".png",
        maceroni:{needed:false}
    },
    {
        name: "mountains",
        isFrame: false,
        items: 5,
        width: 187,
        height: 238,
        x: 155,
        y: 456,
        path: "./images/animations/mountains/mountain",
        ext: ".png",
        maceroni:{needed:false}
    },
    {
        name: "volcano",
        isFrame: false,
        items: 5,
        width: 325,
        height: 322,
        x: 274,
        y: 425,
        path: "./images/animations/volcanoes/volcano",
        ext: ".png"
    },
    {
        name: "co2",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/co2Meter/co2Meter",
        ext: ".png",
        scale: 4.3,
        maceroni:{needed:false}
    },
    {
        name: "temperature",
        isFrame: true,
        items: 9,
        width: 70,
        height: 135,
        x: 482,
        y: 281,
        path: "./images/animations/tempMeter/tempMeter",
        ext: ".png",
        scale: 4.25,
        maceroni:{needed:false}
    },
    {
        name: "underwaterVolcano",
        isFrame: true,
        items: 5,
        width: 164,
        height: 305,
        x: 1287,
        y: 419,
        path: "./images/animations/underwaterVolcanoes/volcano",
        ext: ".gif",
        maceroni:{needed:true, x:1386, y:653, malicious:false}
    },
    {
        name: "co3Desposition",
        isFrame: true,
        items: 5,
        width: 120,
        height: 216,
        x: 1165,
        y: 564,
        path: "./images/animations/seaSnow/seaSnow",
        ext: ".gif",
        maceroni:{needed:true, x:1215, y:624, malicious:false}
    },
    {
        name: "sediment",
        isFrame: true,
        items: 5,
        width: 129,
        height: 129,
        x: 978,
        y: 527,
        path: "./images/animations/sediment/sediment",
        ext: ".gif",
        maceroni:{needed:true, x:979, y:642, malicious:false}
    },
    {
        name: "weatheringCRelease",
        isFrame: true,
        items: 5,
        width: 204,
        height: 168,
        x: 1396,
        y: 396,
        path: "./images/animations/carbonateRock/carbonateRock",
        ext: ".gif",
        maceroni:{needed:true, x:1408, y:463,malicious:false}
    },
    {
        name: "shadow",
        isFrame: true,
        items: 1,
        width: 392,
        height: 392,
        x: 205,
        y: 351,
        path: "./images/paper-doll/shadow",
        ext: ".png",
        scale: 1.1,
        maceroni:{needed:false, x:0, y:0, malicious:false}
    }
];

function setForcers(forcerObj) {
    "use strict";
    var forcers = ["mountains", "volcanoes", "weatheringBurial", "weatheringRelease", "lightRays"],
        showIcons = false,
        processedText;

    forcers.forEach(function (forcer, forcerIndex) {
        if (forcerObj[forcer] === 1) {
            $("#forcers g:nth-child(" + (forcerIndex + 1) + ") image:nth-of-type(2)").toggleClass("hide");
            showIcons = true;
        }
    });

    if (!showIcons) {
        //hide all the icons and show text
        $("#forcers").toggleClass("hide");
        $("#forcerText").toggleClass("hide");

        //proccess text
        //TODO actully proccess text
        //<tspan class="smallText" dy="-5">2</tspan>
        processedText = forcerObj.other;

        //Update text
        $("#forcerText text").html(processedText);
    }

}

function init(forcerObj, timeScaleOps) {
    "use strict";
    var boxen,
        animationInProgress = false;

    setForcers(forcerObj);

    boxen = containers.map(function (container, index) {
        var i, box,
            frames = [];

        //make a list of filenames
        for (i = 0; i < container.items; i++) {
            frames[i] = container.path + (i + 1) + container.ext;
        }

        frames = frames.map(function (url) {
            var frame = new Frame(url, container.width, container.height);
            if (container.frames) {
                frame.setFrameAmount(container.frames);
            }
            return frame;
        });
        box = new Animator(frames, container.isFrame, container.x, container.y, container.scale);
        box.setName(container.name)
            .setTargetStep(timeScaleOps[0][container.name] - 1)
            .display();
        if(container.maceroni.needed)
            box.createMaceroniMeter(container.maceroni.x, container.maceroni.y, container.maceroni.malicious);
        return box;
    });

    function transitionBoxen(stepData) {
        var currentBoxen = 0,
            properOrder = [2, 3, 1, 0, 4, 5, 8, 7, 6, 9];

        properOrder = properOrder.filter(function (val) {
            if (boxen[val].targetStep === stepData[boxen[val].Name] - 1) {
                return false;
            }
            console.log('Run: ' + boxen[val].Name);
            return true;
        });

        function loopBoxen(box) {
            var cc = boxen[properOrder[box]];

            //move spotlight
            moveLightBeam(cc.x + (cc.width * cc.scale) / 2, cc.y + (cc.height * cc.scale) / 2,
                cc.width * cc.scale, cc.height * cc.scale, 1500,
                function () {
                    cc.transitionToStep(stepData[cc.Name] - 1);
                    window.setTimeout(function () {
                        currentBoxen++;
                        if (currentBoxen < properOrder.length) {
                            loopBoxen(currentBoxen);
                        } else {
                            $("#spotter").animate({
                                opacity: 0
                            }, 2000);
                            animationInProgress = false;
                        }
                    }, 2500);
                });
        }

        loopBoxen(currentBoxen);
    }

    // modified to make text clickable too
    $("a, a + * + text").on("click", function () {
        if (animationInProgress) {
            return;
        }

        var step = parseInt(this.parentElement.id.slice(-1), 10) - 1;
        // Set active state
        $("#timeline g").removeClass("active");
        $(this.parentElement).addClass("active");
        animationInProgress = true;
        transitionBoxen(timeScaleOps[step]);
    });

    /*
     * Steps through with spotlight
     * Centers Spotlight on specified x,y
     */

    //creates spotlight
    createSpotlight();
    $("#spotter").animate({
        opacity: 0
    }, 0);
}
//windows stinks!
/******************************* START ***************************************/
// Get CSV with file name from url
getCSV(function (err, csvData) {
    "use strict";
    var forcerObj;

    if (err) {
        console.log("error:", err);
        $("#error").toggleClass("hide");
        $("svg").toggleClass("hide");
        return;
    }

    forcerObj = csvData.shift();
    console.log("scenario:", csvData);
    console.log("forcerObj:", forcerObj);

    init(forcerObj, csvData);
});

/*$("svg").on("mousemove",function(options){
    console.clear();
    console.log({x:options.clientX, y:options.clientY});
    document.getElementById("cursor").setAttributeNS(null, "transform", `translate(${options.clientX},${options.clientY}) scale(1)`);
});*/
