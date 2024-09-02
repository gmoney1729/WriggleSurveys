export function drawCanvas (objCTARes, div) {
    const header = document.createElement('h3');
    header.innerText = 'Best Fit Centre: ' + objCTARes.pID;
    div.append(header);

    const canvas = document.createElement('canvas');
    div.append(canvas);

    const handlers = handleCanvasEvents(canvas, objCTARes);
    for (const eventType of Object.keys(handlers)) {
        canvas.addEventListener(eventType, handlers[eventType]);
    }

    document.addEventListener('mouseup', handlers.mouseup);
    preCompute(canvas, objCTARes);
    draw(canvas, objCTARes);
}


function preCompute (canvas, objCTARes, options = {}) {
    const width = (canvas.width = 600);
    const height = (canvas.height = 600);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255 255 255)";
    ctx.fillRect(0, 0, width, height);

    const minX = Math.min(0, objCTARes.tunnelDesignCentreHOffset, ...objCTARes.measuredPoints.map((point) => point.tunnelBFCHOffset));
    const maxX = Math.max(0, objCTARes.tunnelDesignCentreHOffset, ...objCTARes.measuredPoints.map((point) => point.tunnelBFCHOffset));
    const minY = Math.min(0, objCTARes.tunnelDesignCentreVOffset, ...objCTARes.measuredPoints.map((point) => point.tunnelBFCVOffset));
    const maxY = Math.max(0, objCTARes.tunnelDesignCentreVOffset, ...objCTARes.measuredPoints.map((point) => point.tunnelBFCVOffset));

    let margin = 100;
    let scaleX = (width - 2 * margin) / (maxX - minX);
    let scaleY = (height - 2 * margin) / (maxY - minY);
    let scale = Math.min(scaleX, scaleY);
    margin /= scale;

    ctx.scale(scale, -scale);
    ctx.translate((maxX - minX) / 2  + margin, -(maxY - minY) / 2 - margin);
}


function draw (canvas, objCTARes, options = {}) {
    clearCanvas(canvas);

    const ctx = canvas.getContext("2d");
    const scale = ctx.getTransform().a;
    // console.log(ctx.getTransform());
    // console.log('Current scale = ' + scale);

    const measPointDrawRadius = 3 / scale;
    ctx.strokeStyle = "rgb(255 0 0)";
    ctx.lineWidth = 2 / scale;

    //Best fit circle
    ctx.beginPath();
    ctx.arc(objCTARes.tunnelDesignCentreHOffset, objCTARes.tunnelDesignCentreVOffset, objCTARes.bfr, degToRad(0), degToRad(360), false);
    ctx.stroke();

    // Design centre
    ctx.fillStyle = "rgb(255 0 255)";
    ctx.beginPath();
    ctx.arc(0, 0, measPointDrawRadius / 2, degToRad(0), degToRad(360), false);
    ctx.fill();

    // Best fit centre
    ctx.fillStyle = "rgb(0 0 255)";
    ctx.beginPath();
    ctx.arc(objCTARes.tunnelDesignCentreHOffset, objCTARes.tunnelDesignCentreVOffset, measPointDrawRadius / 2, degToRad(0), degToRad(360), false);
    ctx.fill();

    // Each measured point
    ctx.fillStyle = "rgb(0 0 0)";
    for (const measPoint of objCTARes.measuredPoints) {
        ctx.beginPath();
        ctx.arc(measPoint.tunnelDesignCentreHOffset, measPoint.tunnelDesignCentreVOffset, measPointDrawRadius, degToRad(0), degToRad(360), false);
        ctx.fill();
    }

    addDeltas(canvas, objCTARes);
    addCentreText(canvas, objCTARes);
}


function addDeltas (canvas, objCTARes) {

    const ctx = canvas.getContext("2d");

    ctx.save();
    const curTransform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const wldBfcInCvs = curTransform.transformPoint(new DOMPoint(objCTARes.tunnelDesignCentreHOffset, objCTARes.tunnelDesignCentreVOffset));
    for (const measPoint of objCTARes.measuredPoints) {
        const wldPos = new DOMPoint(measPoint.tunnelDesignCentreHOffset, measPoint.tunnelDesignCentreVOffset);
        const cvsPos = curTransform.transformPoint(wldPos);
        ctx.translate(cvsPos.x, cvsPos.y);
        const angle = Math.atan2(cvsPos.y - wldBfcInCvs.y, cvsPos.x - wldBfcInCvs.x);

        let xOffset = 10, yOffset = 5;
        const eps = 0.01;
        if (angle >= (-Math.PI / 2 - eps) && angle <= (Math.PI / 2 + eps)) {
            ctx.textAlign = 'left';
        } else {
            ctx.textAlign = 'right';
            xOffset *= -1;
            ctx.rotate(Math.PI);
        }

        ctx.rotate(angle);
        ctx.fillStyle = "black";
        ctx.font = "15px Helvectica";
        ctx.fillText(measPoint.pID, xOffset, yOffset - 7);
        ctx.fillStyle = "purple";
        ctx.font = "bold 15px Helvectica";
        ctx.fillText(measPoint.radiusResidual.toFixed(3) + ' m', xOffset, yOffset + 7);
        ctx.rotate(-angle);
        if (ctx.textAlign === 'right') ctx.rotate(Math.PI);
        ctx.translate(-cvsPos.x, -cvsPos.y);
    }

    ctx.restore();
    
}


function addCentreText (canvas, objCTARes) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = 'rgba(0, 0, 255, 100%)';
    ctx.font = "15px Arial";

    ctx.save();
    const curTransform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const wldBfcInCvs = curTransform.transformPoint(new DOMPoint(objCTARes.tunnelDesignCentreHOffset, objCTARes.tunnelDesignCentreVOffset));
    ctx.fillText('Best Fit Radius = ' + objCTARes.bfr.toFixed(3) + ' m', wldBfcInCvs.x + 10, wldBfcInCvs.y - 20);
    ctx.fillText('ΔH = ' + objCTARes.tunnelDesignCentreHOffset.toFixed(3) + ' m', wldBfcInCvs.x + 10, wldBfcInCvs.y);
    ctx.fillText('ΔV = ' + objCTARes.tunnelDesignCentreVOffset.toFixed(3) + ' m', wldBfcInCvs.x + 10, wldBfcInCvs.y + 20);

    ctx.fillText(objCTARes.vTiltDirection + ' = ' + Math.abs(objCTARes.vTiltValue).toFixed(3) + " m", wldBfcInCvs.x - 50, wldBfcInCvs.y + 100);
    ctx.fillText(objCTARes.hTiltDirection + ' = ' + Math.abs(objCTARes.hTiltValue).toFixed(3) + " m", wldBfcInCvs.x - 50, wldBfcInCvs.y + 120);
    

    ctx.restore();
}


function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}


function handleCanvasEvents (canvas, objCTARes) {
    let isDragging = false;
    const dragStart = Array(2);
    const ctx = canvas.getContext("2d");

    const onMouseDownCanvas = event => {
        if (event.button === 0 || event.button === 1) {
            isDragging = true;
            event.preventDefault();
            const mousePos = cvs2wld(canvas, event.offsetX, event.offsetY);
            dragStart[0] = mousePos.x;
            dragStart[1] = mousePos.y;
        }
    };

    const onMouseMoveCanvas = event => {
        if (isDragging) {
            const mousePos = cvs2wld(canvas, event.offsetX, event.offsetY);
            ctx.translate(mousePos.x - dragStart[0], mousePos.y - dragStart[1]);
            draw(canvas, objCTARes);
        }
    };

    const onWheelCanvas = event => {
        event.preventDefault();
        const zoom = event.deltaY < 0 ? 1.1 : 0.9;
        const mousePos = cvs2wld(canvas, event.offsetX, event.offsetY);
        ctx.translate(mousePos.x, mousePos.y);
        ctx.scale(zoom, zoom);
        ctx.translate(-mousePos.x, -mousePos.y);
        draw(canvas, objCTARes);
    };

    const onMouseUpDocument = () => isDragging = false;

    return {
        mousedown: onMouseDownCanvas,
        mouseup: onMouseUpDocument,
        mousemove: onMouseMoveCanvas,
        wheel: onWheelCanvas
    };
}


function cvs2wld (canvas, x, y) {
    const ctx = canvas.getContext("2d");
    const cvsPoint = new DOMPoint(x, y);
    return ctx.getTransform().invertSelf().transformPoint(cvsPoint);
}

function wld2cvs (canvas, x, y) {
    const ctx = canvas.getContext("2d");
    const wldPoint = new DOMPoint(x, y);
    return ctx.getTransform().transformPoint(wldPoint);
}


function degToRad(degrees) {
    return (degrees * Math.PI) / 180;
};

function radToDeg(radians) {
    return (radians * 180) / Math.PI;
};


