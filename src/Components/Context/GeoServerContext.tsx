import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import fetchGeoserverData, {GeoServerData} from "../../utils/fetchGeoserverData";
import TileLayer from "ol/layer/Tile";
import {TileWMS, Vector} from "ol/source";
import {MapContext} from "./MapContainer";
import VectorLayer from "ol/layer/Vector";
import {Feature} from "ol";
import LocationMarker from "../Markers/LocationMarker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChair, faLocationPin, faMonument} from "@fortawesome/free-solid-svg-icons";
import {faPagelines} from "@fortawesome/free-brands-svg-icons";
import {Geometry, Point} from "ol/geom";
import {Coordinate} from "ol/coordinate";


interface GeoServerContextType { // TODO c'est juste un exemple de context, à toi de voir comment tu veux faire
    data: GeoServerData[] | null;
    filter: string; // TODO : Change to enum
}

export const GeoServerContext = createContext<Vector[] | null>(null);

function changeIcon(feat: Feature) {
    var descr = feat.getProperties()["descriptio"];
    switch (descr) {
        case "Banc public":
            return <FontAwesomeIcon icon={faChair}/>

        case "Colonne végétale":
            return <FontAwesomeIcon icon={faPagelines}/>

        case "Statue, monument" :
            return <FontAwesomeIcon icon={faMonument}/>

        default:
            return <FontAwesomeIcon icon={faLocationPin}/>
    }
}

export default function GeoServerContextComponent(props: PropsWithChildren<{}>) {

    // /!\ ne jamais fetch un objet à ce niveau, sinon il sera refetch à chaque re-render

    // const [context] = useState<GeoServerContextType | null>( () => {
    //     // TODO ici on fetch les données via le utils dans fetchGeoserverData.ts

    const [data, setData] = useState<Vector[] | null>(null);
    const [layers, setLayers] = useState<VectorLayer<any>[]>();
    useEffect(() => {
        fetchGeoserverData().then((data) => setData(data))
    }, []);

    const map = useContext(MapContext);
    useEffect(() => {
        if (data) {
            const espaces = new VectorLayer({source: data[0]});
            const pav = new VectorLayer({source: data[1]});

            // @ts-ignore
            setLayers([espaces, pav]);
            const es_s = espaces.getSource();

            // @ts-ignore
            es_s.on('change', function(evt){
                var source=evt.target;
                if(source.getState() === 'ready'){
                    // @ts-ignore
                    console.log(es_s.getFeatures()[0].getGeometry()["flatCoordinates"]);
                }
            });

            map?.addLayer(espaces);
            map?.addLayer(pav);

            return () => {
                map?.removeLayer(espaces);
                map?.removeLayer(pav);
            }
        }
    }, [data])

    return (
        <GeoServerContext.Provider value={data}>
            {/*{layers[0].getSource().getFeatures()?.map((feature) => <LocationMarker position={feature.getGeometry()["flatCoordinates"]} onClick={() => {}} positioning={"center-center"}>*/}
            {/*    {changeIcon(feature)}*/}
            {/*</LocationMarker>)}*/}
            {/*{layers[1].getSource().getFeatures()?.map( (feature) => <LocationMarker position={feature.getGeometry()["flatCoordinates"]} onClick={() => {}} positioning={"center-center"}>*/}
            {/*    {changeIcon(feature)}*/}
            {/*</LocationMarker>)}*/}
            {props.children}
        </GeoServerContext.Provider>
    )
}