import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Coordinate} from "ol/coordinate";
import {fromLonLat} from "ol/proj";
import {MapContext} from "./MapContainer";

export const CurrentLocationContext = createContext<Coordinate | null>(null);
const CurrentLocationContextCreator = (props: PropsWithChildren<{}>) => {
    const map = useContext(MapContext);
    const [currentLocation, setCurrentLocation] = useState<Coordinate>(fromLonLat([0,0]));
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const center = fromLonLat([position.coords.longitude, position.coords.latitude]);
            const zoom = 12;
            map!.getView().animate({zoom: zoom, center: center}, {duration: 2000});
            setCurrentLocation(center);
        });
    }, [map]);

    return (
        <CurrentLocationContext.Provider value={currentLocation}>
            {props.children}
        </CurrentLocationContext.Provider>
    );
}

export default CurrentLocationContextCreator;