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
                imageHref = color === 'RED' ? SVGEncoded.actorSVGEncodedRed : SVGEncoded.actorSVGEncodedGreen;
            }
            break;
        case 'actor-sub':
            imageHref = SVGEncoded.actorSubSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.actorSubSVGEncodedRed : SVGEncoded.actorSubSVGEncodedGreen;
            }
            break;
        case 'sensor-sub':
            imageHref = SVGEncoded.sensorSubSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.sensorSubSVGEncodedRed : SVGEncoded.sensorSubSVGEncodedGreen;
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
                imageHref = color === 'RED' ? SVGEncoded.sensorCatchSVGEncodedRed : SVGEncoded.sensorCatchSVGEncodedGreen;
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
        case 'sensor':
        default:
            imageHref = SVGEncoded.sensorSVGEncoded;
            if(color) {
                imageHref = color === 'RED' ? SVGEncoded.sensorSVGEncodedRed : SVGEncoded.sensorSVGEncodedGreen;
            }
    }
    return imageHref;
}
