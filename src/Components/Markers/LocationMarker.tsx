import {Coordinate} from "ol/coordinate";
import {PropsWithChildren, useContext, useEffect} from "react";
import {MapContext} from "../Context/MapContainer";
import Popup from "ol-ext/overlay/Popup";
import {renderToString} from "react-dom/server";
import styles from "./Markers.module.sass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";


const LocationMarker = ({ children, position, onClick }: PropsWithChildren<{position: Coordinate, onClick: ()=>void}>) => {
    const map = useContext(MapContext);
    useEffect(() => {
        const popup = new Popup({positioning: 'bottom-center', popupClass: styles.popup});
        map!.addOverlay(popup);
        popup.show(position, renderToString(
            <div className={styles.locationMarker} id={"currentLocation"}>
                <FontAwesomeIcon icon={faLocationDot}/>
            </div>));

        // On ne peut pas ajouter de Onclick dans le renderToString donc on le fait après... ( nul )
        document.getElementById("currentLocation")?.addEventListener("click", onClick);
        return () => {
            popup!.hide();
            map!.removeOverlay(popup!);
            document.getElementById("currentLocation")?.removeEventListener("click", onClick);
        }
    }, [position, onClick]);

    return (<>{children}</>);
}

export default LocationMarker;