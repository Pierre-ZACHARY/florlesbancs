import {Coordinate} from "ol/coordinate";
import {Feature} from "ol";
import VectorLayer from "ol/layer/Vector";



export default function findNearestPointOnVectorLayer(vertsLayers : VectorLayer<any>[], pavLayers : VectorLayer<any>[], coords: Coordinate) : Feature {
    let minDistance = Infinity;
    let nearestCoords;
    let nearestFeature;

    for (let i = 0; i < vertsLayers.length; i++){
        console.log(i)
        const feature = vertsLayers[i].getSource().getClosestFeatureToCoordinate(coords);
        const featureCoordinates = feature.getGeometry().getCoordinates();
        const distance = calculateDistance(coords, featureCoordinates);
        if (distance < minDistance) {
            console.log("SWITCH");
            minDistance = distance;
            nearestCoords = featureCoordinates;
            nearestFeature = feature;
        }
    }

    for (let i = 0; i < pavLayers.length; i++){
        console.log(i)
        const feature = pavLayers[i].getSource().getClosestFeatureToCoordinate(coords);
        const featureCoordinates = feature.getGeometry().getCoordinates();
        const distance = calculateDistance(coords, featureCoordinates);
        if (distance < minDistance) {
            console.log("SWITCH");
            minDistance = distance;
            nearestCoords = featureCoordinates;
            nearestFeature = feature;
        }
    }

    // @ts-ignore
    return nearestFeature;

}
function calculateDistance(point1:Coordinate, point2: Coordinate){
    const R = 6371e3;
    const phi1 = point1[1] * Math.PI / 180;
    const phi2 = point2[1] * Math.PI / 180;
    const deltaPhi = (point2[1] - point1[1]) * Math.PI / 180;
    const deltaLambda = (point2[0] - point1[0]) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}