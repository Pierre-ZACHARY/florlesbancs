import {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from "react";
import {MapContext} from "./MapContainer";
import findNearestPointOnVectorLayer from "../../utils/findNearestPoint";
import {Feature, MapBrowserEvent} from "ol";
import {Geometry} from "ol/geom";
import LocationMarker from "../Markers/LocationMarker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationPin} from "@fortawesome/free-solid-svg-icons";

export const NearestPointContext = createContext<Feature<Geometry>  | null | number[]>(null);

const OnClickListener = (props: PropsWithChildren<{}>) => {

    const map = useContext(MapContext);

    const [nearestPoint, setNearestPoint] = useState<Feature<Geometry> | null | number[]>(null);
    const value = useMemo(() => nearestPoint, [nearestPoint]);

    useEffect(()=>{
        if(map){
            const callback = (event: MapBrowserEvent<any>) => {
                const coordinate = event.coordinate;
                var pixel = map.getEventPixel(event.originalEvent);

                // Find the nearest point on the vector layer to the click
                const nearestPoint = findNearestPointOnVectorLayer(map, pixel, coordinate);
                console.log(nearestPoint);
                if(nearestPoint){
                    setNearestPoint(nearestPoint);
                }
                else{
                    setNearestPoint(coordinate);
                }

            }
            map.on('singleclick', callback);
            return () => {
                map.un('singleclick', callback);
            }
        }

    }, [map])

    return (<NearestPointContext.Provider value={value}>
        {
            nearestPoint && nearestPoint instanceof Feature<Geometry> && <LocationMarker onClick={() => {}} position={nearestPoint["values_"]["features"][0]["values_"]["geometry"]["flatCoordinates"]} positioning={"bottom-center"}>
                <FontAwesomeIcon icon={faLocationPin}/>
            </LocationMarker>
        }
        {
            nearestPoint && nearestPoint instanceof Feature<Geometry> &&  <LocationMarker onClick={() => {}} position={nearestPoint["values_"]["features"][0]["values_"]["geometry"]["flatCoordinates"]} positioning={"bottom-center"}>
                <div style={{marginBottom: 50, pointerEvents: "none"}}>
                    <h1 style={{color: "#1437e8", textAlign: "center"}}>{nearestPoint["values_"]["features"][0]["values_"]["descriptio"]}</h1>
                </div>
            </LocationMarker>
        }
        {
            nearestPoint && !(nearestPoint instanceof Feature<Geometry>) && <LocationMarker onClick={() => {}} position={nearestPoint as number[]} positioning={"bottom-center"}>
                <FontAwesomeIcon icon={faLocationPin}/>
            </LocationMarker>
        }
        {props.children}
    </NearestPointContext.Provider>)
}

export default OnClickListener;