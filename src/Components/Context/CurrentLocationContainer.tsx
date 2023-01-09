import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {Coordinate} from "ol/coordinate";
import {fromLonLat} from "ol/proj";
import {MapContext} from "./MapContainer";
import {Geolocation} from "@capacitor/geolocation";

export const CurrentLocationContext = createContext<number[] | null>(null);
const CurrentLocationContextCreator = (props: PropsWithChildren<{}>) => {
    const map = useContext(MapContext);
    const [currentLocation, setCurrentLocation] = useState<Coordinate>(fromLonLat([0,0]));
    const [firstZoom, setFirstZoom] = useState<boolean>(true);
    const [watchId, setWatchId] = useState<string | null>(null);
    const [oldwatchId, setOldWatchId] = useState<string | null>(null);
    const value = useMemo(() => currentLocation, [currentLocation]);
    useEffect(() => {

        Geolocation.getCurrentPosition().then((position) => {
           setCurrentLocation(fromLonLat([position.coords.longitude, position.coords.latitude]));
        });

        console.log("watch position");
        Geolocation.watchPosition( {}, (position) => {
            if(position){
                if(firstZoom) {
                    map?.getView().setZoom(12);
                    setFirstZoom(false);
                    map!.getView().animate({zoom: map?.getView().getZoom(), center: fromLonLat([position.coords.longitude, position.coords.latitude])}, {duration: 2000});
                }
                setCurrentLocation([position.coords.longitude, position.coords.latitude]);
            }

        }).then((id)=>{setWatchId(id)})

    }, [map, firstZoom]);

    useEffect(()=>{
        if(oldwatchId && watchId) {
            console.log("clearing old watch id");
            Geolocation.clearWatch({id: oldwatchId}).then(() => {
                setOldWatchId(null);
            })
        }
        if(watchId) setOldWatchId(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchId])

    return (
        <CurrentLocationContext.Provider value={value}>
            {props.children}
        </CurrentLocationContext.Provider>
    );
}

export default CurrentLocationContextCreator;