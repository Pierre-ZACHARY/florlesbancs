import {Coordinate} from "ol/coordinate";
import {PropsWithChildren, useContext, useEffect} from "react";
import {MapContext} from "../Context/MapContainer";
import Popup from "ol-ext/overlay/Popup";
import {renderToString} from "react-dom/server";
import styles from "./Markers.module.sass";

const LocationMarker = ({ children, position, onClick, positioning }: PropsWithChildren<{position: Coordinate, onClick: ()=>void, positioning: string}>) => {
    const map = useContext(MapContext);
    useEffect(() => {
        const popup = new Popup({positioning: positioning, popupClass: styles.popup});
        map!.addOverlay(popup);
        popup.show(position, renderToString(
            <div className={styles.locationMarker} id={"marker"+position.toString()}>
                {children}
            </div>));

        // On ne peut pas ajouter de Onclick dans le renderToString donc on le fait après... ( nul )
        document.getElementById("marker"+position.toString())?.addEventListener("click", onClick);
        return () => {
            popup!.hide();
            map!.removeOverlay(popup!);
            document.getElementById("marker"+position.toString())?.removeEventListener("click", onClick);
        }
    }, [position, onClick, map, children, positioning]);

    return (<></>);
}

export default LocationMarker;