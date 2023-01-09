import {fromLonLat} from "ol/proj";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFontAwesome} from "@fortawesome/free-solid-svg-icons";
import LocationMarker from "./LocationMarker";
import {useState} from "react";


export const SuggestionMarker = (feature: any) => {

    const [open, setOpen] = useState<boolean>(false);


    return (
        <>
            <LocationMarker position={fromLonLat(feature.feature.geometry.coordinates)} onClick={() => {
                setOpen(!open)
            }} positioning={"bottom-center"}>
                <FontAwesomeIcon icon={faFontAwesome}/>
            </LocationMarker>
            {open && <LocationMarker position={fromLonLat(feature.feature.geometry.coordinates)} onClick={()=>{setOpen(!open)}} positioning={"bottom-center"}>
                    <div style={{pointerEvents: "none", marginBottom: "50px"}}>
                        <p>{feature.feature.properties.type}</p>
                        <p>{feature.feature.properties.contenu}</p>
                    </div>
                </LocationMarker> }
        </>)
}