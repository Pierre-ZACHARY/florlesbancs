import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {TileWMS} from "ol/source";
import {MapContext} from "./MapContainer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import LocationMarker from "../Markers/LocationMarker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChair, faLocation, faLocationPin, faMonument} from "@fortawesome/free-solid-svg-icons";
import {faPagelines} from "@fortawesome/free-brands-svg-icons";
import {fromLonLat} from "ol/proj";
import fetchGeoserverData from "../../utils/fetchGeoserverData";


interface GeoServerContextType { // TODO c'est juste un exemple de context, à toi de voir comment tu veux faire
    data:   null;
    filter: string; // TODO : Change to enum
}

export const GeoServerContext = createContext<TileWMS[] | null>(null);


function changeIcon(feat: any) {
    console.log(feat);
    var descr = feat.properties.descriptio;
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

    const map = useContext(MapContext);
    const [espace, setEspace] = useState<any>(null);
    const [pav, setPav] = useState<any>(null);
    useEffect ( ()=>{
        fetchGeoserverData().then(([espace, pav]) => {
            setEspace(espace);
            setPav(pav);
        });
    }, [])

    let feature = <></>

    if(espace){
        feature = espace.slice(0, 100).map((feature: any) => {
            return <LocationMarker position={fromLonLat(feature.geometry.coordinates)} onClick={()=>{}} positioning={"bottom-center"}>
                        {changeIcon(feature)}
                    </LocationMarker>
        })

    }

    return (
        <GeoServerContext.Provider value={[]}>
            <>
                {feature}
                {props.children}
            </>
        </GeoServerContext.Provider>
    )
}