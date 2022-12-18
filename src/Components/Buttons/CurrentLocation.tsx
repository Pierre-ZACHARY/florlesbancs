import styles from "./Button.module.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocation} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useState} from "react";
import {fromLonLat} from "ol/proj";
import {CurrentLocationContext} from "../Context/CurrentLocationContainer";
import {MapContext} from "../Context/MapContainer";


const CurrentLocationButton = () => {
    const [showCurrentLocation, setShowCurrentLocation] = useState<boolean>(false);
    const map = useContext(MapContext);
    const currentLocation = useContext(CurrentLocationContext);
    useEffect(
        () => {
            if(currentLocation && showCurrentLocation){
                map!.getView().animate({zoom: Math.max(map?.getView().getZoom()??12, 12), center: fromLonLat(currentLocation!)}, {duration: 2000});
            }
        }, [showCurrentLocation, currentLocation, map]
    )
    return (
        <div className={styles.main}>
            <button className={showCurrentLocation ? styles.active : ""} onClick={()=>{setShowCurrentLocation(!showCurrentLocation)}}><FontAwesomeIcon icon={faLocation}/></button>
        </div>
    )
}

export default CurrentLocationButton;