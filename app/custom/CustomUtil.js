import * as SVGEncoded from "../svg/SvgExporter";

export const getEncodedSvg = (iotType, color) => {
    let imageHref;
    switch (iotType) {
        case 'start':
            imageHref = SVGEncoded.startEventSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.startEventSVGEncodedRed : SVGEncoded.startEventSVGEncodedGreen;
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
                imageHref = color === 'RED' ? SVGEncoded.throwEventSVGEncodedRed : SVGEncoded.throwEventSVGEncodedGreen;
            }
            break;
        case 'catch':
            imageHref = SVGEncoded.catchEventSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.catchEventSVGEncodedRed : SVGEncoded.catchEventSVGEncodedGreen;
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
                imageHref = color === 'RED' ? SVGEncoded.endEventSVGEncodedRed : SVGEncoded.endEventSVGEncodedGreen;
            }
            break;
        case 'obj':
            imageHref = SVGEncoded.objSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.objSVGEncodedRed : SVGEncoded.objSVGEncodedGreen;
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
