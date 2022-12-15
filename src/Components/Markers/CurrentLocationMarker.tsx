import {useContext, useState} from "react";
import {MapContext} from "../Context/MapContainer";
import {CurrentLocationContext} from "../Context/CurrentLocationContainer";
import Popup from "ol-ext/overlay/Popup";
import LocationMarker from "./LocationMarker";
import styles from "./Markers.module.sass";
import {renderToString} from "react-dom/server";
import {Coordinate} from "ol/coordinate";


const CurrentLocationMarker = () => {
    const map = useContext(MapContext);
    const [openPopup, setOpenPopup] = useState<Popup | null>(null);
    const togglePopup = (position: Coordinate) => {
        console.log(openPopup);
        console.log(position);
        if(openPopup) {
            openPopup.hide();
            map!.removeOverlay(openPopup);
            setOpenPopup(null);
            console.log(openPopup);
            return;
        }
        const popup = new Popup({positioning: 'bottom-center', popupClass: styles.popup+" "+styles.popupWithBottomMargin});
        map!.addOverlay(popup);
        popup.show(position!, renderToString(
            <div className={styles.locationMarkerPopup} id={"currentLocationPopUp"}>
                <h1>Votre position !</h1>
            </div>));
        console.log(popup);
        setOpenPopup(popup);
        console.log(openPopup);
    }

    return (<CurrentLocationContext.Consumer>
                {
                    (position) => {
                        return <LocationMarker position={position!} onClick={()=>togglePopup(position!)}/>
                    }
                }
            </CurrentLocationContext.Consumer>);
}

export default CurrentLocationMarker;