import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import fetchGeoserverData, {GeoServerData} from "../../utils/fetchGeoserverData";
import TileLayer from "ol/layer/Tile";
import {TileWMS} from "ol/source";
import {MapContext} from "./MapContainer";


interface GeoServerContextType { // TODO c'est juste un exemple de context, à toi de voir comment tu veux faire
    data: GeoServerData[] | null;
    filter: string; // TODO : Change to enum
}

export const GeoServerContext = createContext<TileWMS[] | null>(null);


export default function GeoServerContextComponent(props: PropsWithChildren<{}>) {

    // /!\ ne jamais fetch un objet à ce niveau, sinon il sera refetch à chaque re-render

    // const [context] = useState<GeoServerContextType | null>( () => {
    //     // TODO ici on fetch les données via le utils dans fetchGeoserverData.ts

    const [data,setData] = useState<TileWMS[] | null>( null );
    useEffect(() => {
        fetchGeoserverData().then((data) => setData(data))}, []);
    //var layers = [new TileLayer({source:data[0]}), new TileLayer({source:data[1]})]

    const map = useContext(MapContext);
    useEffect ( ()=>{
        if (data) {
            const espaces = new TileLayer({source: data[0]});
            const pav = new TileLayer({source: data[1]});

            map?.addLayer(espaces);
            map?.addLayer(pav);

            return () => {
                map?.removeLayer(espaces);
                map?.removeLayer(pav);
            }
        }
    }, [data])

    return (
        <GeoServerContext.Provider value={data}>
            {props.children}
        </GeoServerContext.Provider>
    )
}