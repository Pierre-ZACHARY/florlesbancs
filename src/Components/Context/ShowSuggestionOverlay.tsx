import {useEffect, useState} from "react";
import {SuggestionMarker} from "../Markers/SuggestionMarker";
import serverAdress from "../../utils/serverAdress";



async function fetchSuggestions(): Promise<any>{
    const resp = await fetch(serverAdress()+"/geoserver/toto/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=suggestion_ajout&outputFormat=application/json")
    const json = await resp.json();
    console.log(json);
    return json;
}


export const ShowSuggestionOverlay = () => {



    const [suggestion, setSuggestion] = useState<any>(null);

    useEffect(() => {
        fetchSuggestions().then((suggestions) => {
            setSuggestion(suggestions);
        });
    },[])


    return (
        <>
            {suggestion && suggestion.features.map((feature: any)=><SuggestionMarker key={feature.geometry.coordinates} feature={feature}/>)}
        </>
    )
}