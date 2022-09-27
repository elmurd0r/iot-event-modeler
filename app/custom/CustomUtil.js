import * as SVGEncoded from "../svg/SvgExporter";
//default
import startEventSVG from "../svg/default/start_event.svg";
import catchEventSVG from "../svg/default/catch_event.svg";
import throwEventSVG from "../svg/default/throw_event.svg";
import endEventSVG from "../svg/default/end_event.svg";
import actuatorSVG from "../svg/default/actuator.svg";
import actuatorGroupSVG from "../svg/default/actuator_group.svg";
import sensorSVG from "../svg/default/sensor.svg";
import sensorGroupSVG from "../svg/default/sensor_group.svg";
import catchSVG from "../svg/default/catch.svg";
import catchGroupSVG from "../svg/default/catch_group.svg";
import objSVG from "../svg/default/obj.svg";
import decisionLargeSVG from "../svg/default/decision_group_large.svg";
//RED
import startEventSVGRed from "../svg/red/start_event_red.svg";
import catchEventSVGRed from "../svg/red/catch_event_red.svg";
import throwEventSVGRed from "../svg/red/throw_event_red.svg";
import endEventSVGRed from "../svg/red/end_event_red.svg";
import actuatorSVGRed from "../svg/red/actuator_red.svg";
import actuatorGroupSVGRed from "../svg/red/actuator_group_red.svg";
import sensorSVGRed from "../svg/red/sensor_red.svg";
import sensorGroupSVGRed from "../svg/red/sensor_group_red.svg";
import catchSVGRed from "../svg/red/catch_red.svg";
import catchGroupSVGRed from "../svg/red/catch_group_red.svg";
import objSVGRed from "../svg/red/obj_red.svg"
//GREEN
import startEventSVGGreen from "../svg/green/start_event_green.svg";
import catchEventSVGGreen from "../svg/green/catch_event_green.svg";
import throwEventSVGGreen from "../svg/green/throw_event_green.svg";
import endEventSVGGreen from "../svg/green/end_event_green.svg";
import actuatorSVGGreen from "../svg/green/actuator_green.svg";
import actuatorGroupSVGGreen from "../svg/green/actuator_group_green.svg";
import sensorSVGGreen from "../svg/green/sensor_green.svg";
import sensorGroupSVGGreen from "../svg/green/sensor_group_green.svg";
import catchSVGGreen from "../svg/green/catch_green.svg";
import catchGroupSVGGreen from "../svg/green/catch_group_green.svg";
import objSVGGreen from "../svg/green/obj_green.svg"
//ORANGE
import startEventSVGOrange from "../svg/orange/start_event_orange.svg";
import catchEventSVGOrange from "../svg/orange/catch_event_orange.svg";
import throwEventSVGOrange from "../svg/orange/throw_event_orange.svg";
import endEventSVGOrange from "../svg/orange/end_event_orange.svg";
import actuatorSVGOrange from "../svg/orange/actuator_orange.svg";
import actuatorGroupSVGOrange from "../svg/orange/actuator_group_orange.svg";
import sensorSVGOrange from "../svg/orange/sensor_orange.svg";
import sensorGroupSVGOrange from "../svg/orange/sensor_group_orange.svg";
import catchGroupSVGOrange from "../svg/orange/catch_group_orange.svg";
import catchSVGOrange from "../svg/orange/catch_orange.svg";
import objSVGOrange from "../svg/orange/obj_orange.svg"

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

export const getSvg = (iotType, color) => {
    let svg;
    switch (iotType) {
        case 'start':
            svg = startEventSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = startEventSVGRed;
                        break;
                    case 'ORANGE':
                        svg = startEventSVGOrange;
                        break;
                    default :
                        svg = startEventSVGGreen;
                        break;
                }
            }
            break;
        case 'actor':
            svg = actuatorSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = actuatorSVGRed;
                        break;
                    case 'ORANGE':
                        svg = actuatorSVGOrange;
                        break;
                    default :
                        svg = actuatorSVGGreen;
                        break;
                }
            }
            break;
        case 'actor-sub':
            svg = actuatorGroupSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = actuatorGroupSVGRed;
                        break;
                    case 'ORANGE':
                        svg = actuatorGroupSVGOrange;
                        break;
                    default :
                        svg = actuatorGroupSVGGreen;
                        break;
                }
            }
            break;
        case 'sensor-sub':
            svg = sensorGroupSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = sensorGroupSVGRed;
                        break;
                    case 'ORANGE':
                        svg = sensorGroupSVGOrange;
                        break;
                    default :
                        svg = sensorGroupSVGGreen;
                        break;
                }
            }
            break;
        case 'throw':
            svg = throwEventSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = throwEventSVGRed;
                        break;
                    case 'ORANGE':
                        svg = throwEventSVGOrange;
                        break;
                    default :
                        svg = throwEventSVGGreen;
                        break;
                }
            }
            break;
        case 'catch':
            svg = catchEventSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = catchEventSVGRed;
                        break;
                    case 'ORANGE':
                        svg = catchEventSVGOrange;
                        break;
                    default :
                        svg = catchEventSVGGreen;
                        break;
                }
            }
            break;
        case 'artefact-catch':
            svg = catchSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = catchSVGRed;
                        break;
                    case 'ORANGE':
                        svg = catchSVGOrange;
                        break;
                    default :
                        svg = catchSVGGreen;
                        break;
                }
            }
            break;
        case 'artefact-catch-sub':
            svg = catchGroupSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = catchGroupSVGRed;
                        break;
                    case 'ORANGE':
                        svg = catchGroupSVGOrange;
                        break;
                    default :
                        svg = catchGroupSVGGreen;
                        break;
                }
            }
            break;
        case 'end':
            svg = endEventSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = endEventSVGRed;
                        break;
                    case 'ORANGE':
                        svg = endEventSVGOrange;
                        break;
                    default :
                        svg = endEventSVGGreen;
                        break;
                }
            }
            break;
        case 'obj':
            svg = objSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = objSVGRed;
                        break;
                    case 'ORANGE':
                        svg = objSVGOrange;
                        break;
                    default :
                        svg = objSVGGreen;
                        break;
                }
            }
            break;
        case 'decision-group':
            svg = decisionLargeSVG;
            break;
        case 'sensor':
        default:
            svg = sensorSVG;
            if(color) {
                switch (color) {
                    case 'RED':
                        svg = sensorSVGRed;
                        break;
                    case 'ORANGE':
                        svg = sensorSVGOrange;
                        break;
                    default :
                        svg = sensorSVGGreen;
                        break;
                }
            }
    }
    return svg;
}