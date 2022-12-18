import {fromLonLat} from "ol/proj";


export default async function findNearestBenchAtCoordinate(lonlat: number[]) : Promise<any> {
    // Set the Overpass API endpoint URL
    const apiUrl = 'https://overpass-api.de/api/interpreter';

    // Set the query to retrieve benches within a radius of 500 meters around the given position
    const query = `
        [out:json][timeout:25];
        (
          node["amenity"="bench"](around:1000,${lonlat[1]},${lonlat[0]});
          way["amenity"="bench"](around:1000,${lonlat[1]},${lonlat[0]});
        );
        out body;
        >;
        out skel qt;
    `;

    const res = await (await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
    })).json();

    const benchData = res.elements;

    // Convert the given position and bench locations to WGS 84 (EPSG:4326) coordinates
    var givenPosition = fromLonLat([lonlat[0], lonlat[1]]);
    var benchLocations = benchData.map(function(bench : any) {
        return fromLonLat([bench.lon, bench.lat]);
    });
    
    console.log(benchLocations);

// Find the bench that is closest to the given position
    var closestBench = null;
    var minDistance = Infinity;
    benchLocations.forEach(function(benchLocation : any) {
        // Calculate the distance between the given position and the current bench
        var distance = Math.sqrt(Math.pow(benchLocation[0] - givenPosition[0], 2) + Math.pow(benchLocation[1] - givenPosition[1], 2));
        if (distance < minDistance) {
            closestBench = benchLocation;
            minDistance = distance;
        }
    });

    return closestBench;
}