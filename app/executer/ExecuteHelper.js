export function convertInputToFloatOrKeepType(input) {
    if (!isNaN(parseFloat(input))) {
        input = parseFloat(input);
    }
    return input;
}

export function convertInputToBooleanOrKeepType(input) {
    if(input === 'false' || input === 'true') {
        input = (input === 'true')
    }
    return input;
}

export function getResponseByAttributeAccessor(responseData, attributeAccessor) {
    let keyArr = attributeAccessor.split('.');
    keyArr.forEach(k => {
        responseData = responseData[k];
    });
    return responseData
}

