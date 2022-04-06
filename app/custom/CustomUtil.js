import * as SVGEncoded from "../svg/SvgExporter";

export const getEncodedSvg = (iotType, color) => {
    let imageHref;
    switch (iotType) {
        case 'start':
            imageHref = SVGEncoded.startSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.startSVGEncodedRed : SVGEncoded.startSVGEncodedGreen;
            }
            break;
        case 'actor':
            imageHref = SVGEncoded.actorSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.actorSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.actorSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.actorSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'actor-sub':
            imageHref = SVGEncoded.actorSubSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.actorSubSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.actorSubSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.actorSubSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'sensor-sub':
            imageHref = SVGEncoded.sensorSubSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.sensorSubSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.sensorSubSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.sensorSubSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'throw':
            imageHref = SVGEncoded.throwEventEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.throwEventEncodedRed : SVGEncoded.throwEventEncodedGreen;
            }
            break;
        case 'catch':
            imageHref = SVGEncoded.catchEventEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.catchEventEncodedRed : SVGEncoded.catchEventEncodedGreen;
            }
            break;
        case 'artefact-catch':
            imageHref = SVGEncoded.sensorCatchSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.sensorCatchSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.sensorCatchSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.sensorCatchSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'artefact-catch-sub':
            imageHref = SVGEncoded.sensorCatchSVGEncodedSub;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.sensorCatchSVGEncodedSubRed : SVGEncoded.sensorCatchSVGEncodedSubGreen;
            }
            break;
        case 'end':
            imageHref = SVGEncoded.endSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.endSVGEncodedRed : SVGEncoded.endSVGEncodedGeen;
            }
            break;
        case 'obj':
            imageHref = SVGEncoded.objSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.objRedSVGEncoded : SVGEncoded.objGreenSVGEncoded;
            }
            break;
        case 'sensor':
        default:
            imageHref = SVGEncoded.sensorSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.sensorSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.sensorSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.sensorSVGEncodedGreen;
                        break;
                }
            }
    }
    return imageHref;
}
