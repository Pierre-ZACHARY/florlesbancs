import {TileWMS} from "ol/source";
import {Point} from "ol/geom";
import {Vector} from "ol/source";
import {GeoJSON} from "ol/format";
import {log} from "util";


export abstract class GeoServerData{
    // TODO créer une classe avec la structure de données de GeoServer ( genre nom du batiment, type de batiment, etc...)

}

// TODO créer une fonction qui fait une requête à geoserver et retourne toutes les info sur les structures d'Orléans
export default async function fetchGeoserverData(): Promise<Vector[]> {

    // pour un exemple de requête voir findNearestBench
    // /!\ faire très attention avec le système de coordonnées de geoserver ( je sais pas quel système il utilise, souvent c'est EPSG 3857. Il y a la fonction fromLonLat qui permet de convertir ) et celui de openlayers WGS 84 (EPSG:4326)
    var espaces = new Vector({
        url: 'http://localhost:8080/geoserver/toto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=toto%3Aespaces_verts_voirie&outputFormat=application%2Fjson',
        format: new GeoJSON(),

        });
    var pav = new Vector({
            url: 'http://localhost:8080/geoserver/toto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=toto%3Adechets_pav&outputFormat=application%2Fjson',
            format: new GeoJSON(),
        });

    await console.log(espaces);

    return [espaces, pav] // TODO remplir la liste
}