import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import styles from "./Context.module.sass";

export const MapContext = createContext<Map | null>(null);

const MapContainer = (props: PropsWithChildren<{}>) => {
    const [map] = useState<Map>(new Map({
        target: "",
        layers: [
            new TileLayer({
                // @ts-ignore
                title: 'OSM',
                source: new OSM(),
            }),
        ],
        view: new View({
            center: [0,0],
            zoom: 0,
        })
    }));

    useEffect(() => {
        map.setTarget("map-container");
    }, [map]);

    return (
        <MapContext.Provider value={map}>
            <div className={styles.main+" map-container"} id="map-container">
                {props.children}
            </div>
        </MapContext.Provider>
    )
};

export default MapContainer;