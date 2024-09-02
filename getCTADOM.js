export function getCTADOM (str) {
    const objHexmlDOM = new window.DOMParser().parseFromString(str, "text/xml");
    
    const objTunnelAppResults = objHexmlDOM.getElementsByTagName('ApplicationRoadRunnerTunnel');
    const arrCTAResults = [];
    for (const res of objTunnelAppResults) {
        if (res.getAttribute('TunnelTask') === 'Check Axis Results') {
            const resPointID = res.getAttribute('RRPointID');

            if (objHexmlDOM.querySelector(`CgPoint[name='${resPointID}']`)) {
                const objCTAResult = {
                    pID: resPointID,
                    N: Number(res.getAttribute('TunnelAxisCentreDefinedNorthing')),
                    E: Number(res.getAttribute('TunnelAxisCentreDefinedEasting')),
                    H: Number(res.getAttribute('TunnelAxisCentreDefinedHeight')),
                    chainage: Number(res.getAttribute('RRCurrentChainage')),
                    rotation: Number(res.getAttribute('TunnelCurrentRotationAngle')),
                    bfr: Number(res.getAttribute('TunnelAxisRadius')),
                    radiusSigma: Number(res.getAttribute('TunnelAxisRadiusStdDev')),
                    ptsMeasured: Number(res.getAttribute('TunnelAxisMeasuredPoints')),
                    ptsUsed: Number(res.getAttribute('TunnelAxisUsedPoints')),
                    tunnelDesignCentreHOffset: Number(res.getAttribute('TunnelAxisCentreOffsetDiff')),
                    tunnelDesignCentreVOffset: Number(res.getAttribute('TunnelAxisCentreHeightDiff')),
                    alignmentHOffset: Number(res.getAttribute('TunnelAxisCentreOffsetCentreline')),
                    alignmentVOffset: Number(res.getAttribute('TunnelAxisCentreHeightDiffCentreline')),
                    topChainage: Number(res.getAttribute('TunnelAxisTopChainage')),
                    bottomChainage: Number(res.getAttribute('TunnelAxisBottomChainage')),
                    leftChainage: Number(res.getAttribute('TunnelAxisLeftChainage')),
                    rightChainage: Number(res.getAttribute('TunnelAxisRightChainage')),
                };
                objCTAResult.hTiltValue = objCTAResult.rightChainage - objCTAResult.leftChainage;
                objCTAResult.hTiltDirection = (objCTAResult.hTiltValue >= 0 ? 'Right' : 'Left') + ' Lead';
                objCTAResult.vTiltValue = objCTAResult.topChainage - objCTAResult.bottomChainage;
                objCTAResult.vTiltDirection = objCTAResult.vTiltValue >= 0 ? 'Overhang' : 'Lookup';

                arrCTAResults.push(objCTAResult);
                const objMeasPtsResults = objHexmlDOM.querySelectorAll(`ApplicationRoadRunnerTunnel[TunnelAxisApplicationRef='${res.getAttribute("ApplicationNumber")}']`);
                const arrMeasPoints = [];
                for (const measPointRes of objMeasPtsResults) {
                    const measPointID = measPointRes.getAttribute('RRPointID');
                    const measCgPoint = objHexmlDOM.querySelector(`CgPoint[name='${measPointID}']`);
                    const [N, E, H] = measCgPoint.innerHTML.split(' ');
                    if (measCgPoint) {
                        const objMeasPointRes = {
                            pID: measPointID,
                            N: Number(N),
                            E: Number(E),
                            H: Number(H),
                            chainage: Number(measPointRes.getAttribute('RRCurrentChainage')),
                            rotation: Number(res.getAttribute('TunnelCurrentRotationAngle')),
                            radiusResidual: Number(measPointRes.getAttribute('TunnelAxisRadiusResidual')),
                            planeResidual: Number(measPointRes.getAttribute('TunnelAxisPlaneResidual')),
                            profileOffset: Number(measPointRes.getAttribute('TunnelDeltaSurface')),
                            alignmentHOffset: Number(measPointRes.getAttribute('RROffsetCentreLine')),
                            alignmentVOffset: Number(measPointRes.getAttribute('RRHeightDiffCentreLine')),
                            used: measPointRes.getAttribute('TunnelAxisPointUsed') === 'true',
                        }

                        objMeasPointRes.tunnelBFCHOffset = objMeasPointRes.alignmentHOffset - objCTAResult.alignmentHOffset;
                        objMeasPointRes.tunnelBFCVOffset = objMeasPointRes.alignmentVOffset - objCTAResult.alignmentVOffset;

                        objMeasPointRes.tunnelDesignCentreHOffset = objMeasPointRes.tunnelBFCHOffset + objCTAResult.tunnelDesignCentreHOffset;
                        objMeasPointRes.tunnelDesignCentreVOffset = objMeasPointRes.tunnelBFCVOffset + objCTAResult.tunnelDesignCentreVOffset;
                        
                        objMeasPointRes.radialDistance = objMeasPointRes.radiusResidual + objCTAResult.bfr;

                        arrMeasPoints.push(objMeasPointRes);
                        // console.log(objMeasPointRes.pID, objMeasPointRes.N.toFixed(3), objMeasPointRes.E.toFixed(3), objMeasPointRes.H.toFixed(3), objMeasPointRes.rotation);
                    }
                }
                objCTAResult.measuredPoints = arrMeasPoints;
                // console.log(objCTAResult.pID, objCTAResult.N.toFixed(3), objCTAResult.E.toFixed(3), objCTAResult.H.toFixed(3), objCTAResult.rotation);
            }
        }
    }
    return arrCTAResults;
}