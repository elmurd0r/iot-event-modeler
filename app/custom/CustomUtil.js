import * as SVGEncoded from "../svg/SvgExporter";

export const getEncodedSvg = (iotType, color) => {
    let imageHref;
    switch (iotType) {
        case 'start':
            imageHref = SVGEncoded.startEventSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.startEventSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.startEventSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.startEventSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'actor':
            imageHref = SVGEncoded.actuatorSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.actuatorSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.actuatorSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.actuatorSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'actor-sub':
            imageHref = SVGEncoded.actuatorGroupSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.actuatorGroupSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.actuatorGroupSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.actuatorGroupSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'sensor-sub':
            imageHref = SVGEncoded.sensorGroupSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.sensorGroupSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.sensorGroupSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.sensorGroupSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'throw':
            imageHref = SVGEncoded.throwEventSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.throwEventSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.throwEventSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.throwEventSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'catch':
            imageHref = SVGEncoded.catchEventSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.catchEventSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.catchEventSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.catchEventSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'artefact-catch':
            imageHref = SVGEncoded.catchSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.catchSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.catchSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.catchSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'artefact-catch-sub':
            imageHref = SVGEncoded.catchGroupSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.catchGroupSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.catchGroupSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.catchGroupSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'end':
            imageHref = SVGEncoded.endEventSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.endEventSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.endEventSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.endEventSVGEncodedGreen;
                        break;
                }
            }
            break;
        case 'obj':
            imageHref = SVGEncoded.objSVGEncoded;
            if(color) {
                switch (color) {
                    case 'RED':
                        imageHref = SVGEncoded.objSVGEncodedRed;
                        break;
                    case 'ORANGE':
                        imageHref = SVGEncoded.objSVGEncodedOrange;
                        break;
                    default :
                        imageHref = SVGEncoded.objSVGEncodedGreen;
                        break;
                }
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
