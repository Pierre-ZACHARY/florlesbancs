import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {Coordinate} from "ol/coordinate";
import {fromLonLat} from "ol/proj";
import {MapContext} from "./MapContainer";

export const CurrentLocationContext = createContext<number[] | null>(null);
const CurrentLocationContextCreator = (props: PropsWithChildren<{}>) => {
    const map = useContext(MapContext);
    const [currentLocation, setCurrentLocation] = useState<Coordinate>(fromLonLat([0,0]));
    const [firstZoom, setFirstZoom] = useState<boolean>(true);
    const value = useMemo(() => currentLocation, [currentLocation]);
    useEffect(() => {
        const id = navigator.geolocation.watchPosition((position) => {
            if(firstZoom) {
                map?.getView().setZoom(12);
                setFirstZoom(false);
            }
            setCurrentLocation([position.coords.longitude, position.coords.latitude]);
        });
        return ()=>{navigator.geolocation.clearWatch(id)};
    }, [map, firstZoom]);
    useEffect(() => {
        map!.getView().animate({zoom: map?.getView().getZoom(), center: fromLonLat(currentLocation)}, {duration: 2000});
    }, [currentLocation, map]);

    return (
        <CurrentLocationContext.Provider value={value}>
            {props.children}
        </CurrentLocationContext.Provider>
    );
}

export default CurrentLocationContextCreator;