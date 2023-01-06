


export abstract class GeoServerData{
    // TODO créer une classe avec la structure de données de GeoServer ( genre nom du batiment, type de batiment, etc...)
}

// TODO créer une fonction qui fait une requête à geoserver et retourne toutes les info sur les structures d'Orléans
export default async function fetchGeoserverData(): Promise<GeoServerData[]> {

    // pour un exemple de requête voir findNearestBench
    // /!\ faire très attention avec le système de coordonnées de geoserver ( je sais pas quel système il utilise, souvent c'est EPSG 3857. Il y a la fonction fromLonLat qui permet de convertir ) et celui de openlayers WGS 84 (EPSG:4326)

    return [] // TODO remplir la liste
}