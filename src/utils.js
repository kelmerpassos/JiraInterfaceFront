export function getPropertyName(propertyFunction) {
    return /\.([^\.;]+);?\s*\}$/.exec(propertyFunction.toString())[1];
};