
export default async function fetchGeoserverData(): Promise<any[]> {
    const resp1 = await fetch("http://localhost:8080/geoserver/toto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=toto%3Aespaces_verts_voirie&outputFormat=application%2Fjson")
    const resp2 = await fetch("http://localhost:8080/geoserver/toto/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=toto%3Adechets_pav&outputFormat=application%2Fjson")
    const json1 = await resp1.json()
    const json2 = await resp2.json()
    const espace = json1.features
    const pav = json2.features

    return [espace, pav] // TODO remplir la liste
}