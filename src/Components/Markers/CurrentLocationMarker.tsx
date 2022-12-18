import {useContext, useState} from "react";
import {MapContext} from "../Context/MapContainer";
import {CurrentLocationContext} from "../Context/CurrentLocationContainer";
import Popup from "ol-ext/overlay/Popup";
import LocationMarker from "./LocationMarker";
import styles from "./Markers.module.sass";
import {renderToString} from "react-dom/server";
import {Coordinate} from "ol/coordinate";
import {fromLonLat} from "ol/proj";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocation} from "@fortawesome/free-solid-svg-icons";


const CurrentLocationMarker = () => {
    const map = useContext(MapContext);
    const currentLocation = useContext(CurrentLocationContext);
    const [openPopup, setOpenPopup] = useState<Popup | null>(null);
    const togglePopup = (position: Coordinate) => {
        if(openPopup) {
            openPopup.hide();
            map!.removeOverlay(openPopup);
            setOpenPopup(null);
            return;
        }
        const popup = new Popup({positioning: 'bottom-center', popupClass: styles.popup+" "+styles.popupWithBottomMargin});
        map!.addOverlay(popup);
        popup.show(position!, renderToString(
            <div className={styles.locationMarkerPopup} id={"currentLocationPopUp"}>
                <h1>Votre position !</h1>
            </div>));
        setOpenPopup(popup);
    }

    return (
        <LocationMarker position={fromLonLat(currentLocation!)} onClick={()=>togglePopup(currentLocation!)} positioning={"center-center"}>
            <FontAwesomeIcon icon={faLocation}/>
        </LocationMarker>);
}

export default CurrentLocationMarker;