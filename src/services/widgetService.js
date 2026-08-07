import { generateWidget } from "../widget/generateWidget";
import { sendToGHL } from "../communication/ghlCommunication"


export function buildWidget(settings) {

    return generateWidget(settings);
}
export function publishWidget(settings) {

    const widget = buildWidget(settings)
    
    sendToGHL(widget);

    return widget;
}