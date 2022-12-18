
export default async function findPath(from: number[], to: number[]): Promise<any>{
    const apiUrl = 'https://router.project-osrm.org/route/v1/foot/';
    const query = `${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=polyline6`;
    console.log(apiUrl + query);
    const res = await (await fetch(apiUrl + query)).json();
    // Extract the route geometry from the response
    return res.routes[0].geometry;
}