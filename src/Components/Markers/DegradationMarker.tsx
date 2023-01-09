import {fromLonLat} from "ol/proj";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import LocationMarker from "./LocationMarker";
import {useState} from "react";


export const DegradationMarker = (feature: any) => {

    const [open, setOpen] = useState<boolean>(false);


    return (
        <>
            <LocationMarker position={fromLonLat(feature.feature.geometry.coordinates)} onClick={() => {
                setOpen(!open)
            }} positioning={"bottom-center"}>
                <FontAwesomeIcon icon={faTriangleExclamation}/>
            </LocationMarker>
            {open && <LocationMarker position={fromLonLat(feature.feature.geometry.coordinates)} onClick={()=>{setOpen(!open)}} positioning={"bottom-center"}>
                    <div style={{pointerEvents: "none", marginBottom: "50px"}}>
                        <p>{feature.feature.properties.mobilier_concerne}</p>
                        <p>{feature.feature.properties.date}</p>
                        {/*@es-lint-disable-next-line*/}
                        <p>{feature.feature.properties["nature_de_la_degradation"]}</p>
                    </div>
                </LocationMarker> }
        </>)
}