import {Coordinate} from "ol/coordinate";
import {Feature} from "ol";
import {Map} from "ol"
import {Pixel} from "ol/pixel";

export default function findNearestPointOnVectorLayer(map : Map, pixel : Pixel, coords: Coordinate) : Feature {
    let minDistance = Infinity;
    let nearestCoords;
    let nearestFeature;
    console.log("aaa");
    map.forEachFeatureAtPixel(pixel, (feature) => {
        console.log(feature);
        // @ts-ignore
        const featureCoordinates = feature.getGeometry().getCoordinates();
        const distance = calculateDistance(coords, featureCoordinates);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCoords = featureCoordinates;
            nearestFeature = feature;
        }
    });
    // @ts-ignore
    return nearestFeature;

}
function calculateDistance(point1:Coordinate, point2: Coordinate){
    // Use the Haversine formula to calculate the distance between two points on a sphere
    // More info: https://en.wikipedia.org/wiki/Haversine_formula
    const R = 6371e3; // Earth's radius in meters
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