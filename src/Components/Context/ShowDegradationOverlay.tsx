import {useEffect, useState} from "react";
import {DegradationMarker} from "../Markers/DegradationMarker";
import serverAdress from "../../utils/serverAdress";



async function fetchDegradations(): Promise<any>{
    const resp = await fetch(serverAdress()+"/geoserver/toto/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=degradation&outputFormat=application/json")
    const json = await resp.json();
    console.log(json);
    return json;
}


export const ShowDegradationOverlay = () => {

    const [degradation, setDegradation] = useState<any>(null);

    useEffect(() => {
        fetchDegradations().then((degradation) => {
            setDegradation(degradation);
        });
    },[])


    return (
        <>
            {degradation && degradation.features.map((feature: any)=><DegradationMarker key={feature.geometry.coordinates} feature={feature}/>)}
        </>
    )
}