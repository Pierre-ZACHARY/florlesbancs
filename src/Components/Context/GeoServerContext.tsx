import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Cluster, TileWMS, Vector} from "ol/source";
import {fromLonLat} from "ol/proj";
import fetchGeoserverData from "../../utils/fetchGeoserverData";
import {MapContext} from "./MapContainer";
import VectorLayer from "ol/layer/Vector";
import {Geometry} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import LayersMapContext from "./LayerMapContext";
import styleFunctionEspacesVerts, {styleFunctionDechets} from "../../utils/styleFunctions";
import LayerSwitcher from "ol-ext/control/LayerSwitcher";


export const GeoServerContext = createContext<TileWMS[] | null>(null);

export default function GeoServerContextComponent(props: PropsWithChildren<{}>) {

    // /!\ ne jamais fetch un objet à ce niveau, sinon il sera refetch à chaque re-render

    // const [context] = useState<GeoServerContextType | null>( () => {

    // const map = useContext(MapContext);
    const [espace, setEspace] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [pav, setPav] = useState<any>(null);
    useEffect ( ()=>{
        fetchGeoserverData().then(([espace, pav]) => {
            setEspace(espace);
            setPav(pav);
        });
    }, [])

    const map = useContext(MapContext);
    const layersMap = useContext(LayersMapContext);
    useEffect(()=> {
        if (espace && pav){
            const featureMap = new Map();
            espace.forEach((feature: {
                geometry: {coordinates : [any, any]};
                properties: { descriptio: any; }; }) => {
                const description = feature.properties.descriptio;
                if (!featureMap.has(description)) {
                    featureMap.set(description, []);
                }
                featureMap.get(description).push( {...feature, geometry: {...feature.geometry, coordinates: fromLonLat(feature.geometry.coordinates)}} );
            });
            const sortedMap = new Map(Array.from(featureMap.entries()).sort((a, b) => {
                return a[1].length - b[1].length;
            }));

            const vectorLayers: VectorLayer<Vector<Geometry>>[] = [];
            sortedMap.forEach((featureList, key) => {
                const geojsonData = {
                    type: 'FeatureCollection',
                    features: featureList
                };
                const source = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData)
                });
                const clusterSource = new Cluster({
                    source: source,
                    distance: 40,
                });
                const clusterLayer = new VectorLayer({
                    // @ts-ignore
                    title: `${key} (${featureList.length})`,
                    source: clusterSource,
                    // @ts-ignore
                    style: feature => styleFunctionEspacesVerts(feature, key),
                });
                vectorLayers.push(clusterLayer);
            });

            const pavMap = new Map();
            const currentTime = new Date();
            pav.forEach((feature: { properties: { status: any; opening_hou: any; }; geometry: {coordinates : [any, any]} }) => {
                let isOpen;
                if (feature.properties.opening_hou) {
                    const openingHours = feature.properties.opening_hou;
                    if (openingHours === "24/7") {
                        isOpen = true;
                    } else {
                        // parsez les heures d'ouverture pour obtenir des heures de début et de fin
                        const [startTime, endTime] = openingHours.split('-').map((time: { split: (arg0: string) => [any, any]; }) => {
                            const [hour, minute] = time.split(':');
                            return new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), parseInt(hour), parseInt(minute));
                        });
                        isOpen = currentTime >= startTime && currentTime < endTime;
                    }
                } else {
                    isOpen = feature.properties.status === 'open';
                }
                if (!pavMap.has(isOpen)) {
                    pavMap.set(isOpen, []);
                }
                pavMap.get(isOpen).push( {...feature, geometry: {...feature.geometry, coordinates: fromLonLat(feature.geometry.coordinates)}} );
            });

            const pavVectorLayers: VectorLayer<Vector<Geometry>>[] = [];
            pavMap.forEach((featureList,key) => {
                const geojsonData = {
                    type: 'FeatureCollection',
                    features: featureList
                };
                const source = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData)
                });
                const clusterSource = new Cluster({
                    source: source,
                    distance: 40
                });
                if (key) {
                    pavVectorLayers.push(
                        new VectorLayer({
                            // @ts-ignore
                            title: 'Poubelles disponibles',
                            source: clusterSource,
                            // @ts-ignore
                            style:  feature => styleFunctionDechets(feature, "#00ff00"),
                        }))
                } else {
                    pavVectorLayers.push(
                        new VectorLayer({
                            // @ts-ignore
                            title: 'Poubelles fermées',
                            source: clusterSource,
                            // @ts-ignore
                            style:  feature => styleFunctionDechets(feature, "#ff0000"),
                        }))
                }
            });

            const layerSwitcher = new LayerSwitcher({
                show_progress: false
            });
            map?.addControl(layerSwitcher);


            for (let i = 0 ; i < pavVectorLayers.length; i++){
                pavVectorLayers[i].setVisible(false)
                map?.addLayer(pavVectorLayers[i]);
            }

            for (let i = 0 ; i < vectorLayers.length; i++){
                vectorLayers[i].setVisible(false)
                map?.addLayer(vectorLayers[i]);
            }
            vectorLayers[vectorLayers.length-2].setVisible(true) // On affiche seulement les bancs au lancement



            return () => {
                for (let i = 0; i < vectorLayers.length; i++){
                    map?.removeLayer(vectorLayers[i]);
                }
                for (let i = 0; i < pavVectorLayers.length; i++){
                    map?.removeLayer(pavVectorLayers[i]);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [espace, pav])


    // let feature = <></>
    //
    // if(espace){
    //     //console.log(espace);
    //     feature = espace.slice(0, 100).map((feature: any) => {
    //         return <LocationMarker position={fromLonLat(feature.geometry.coordinates)} onClick={()=>{}} positioning={"bottom-center"}>
    //                     {changeIcon(feature)}
    //                 </LocationMarker>
    //     })
    //
    // }

    return (
        <GeoServerContext.Provider value={[]}>
            <>
                {/*{feature}*/}
                <LayersMapContext.Provider value={layersMap}>
                {props.children}
                </LayersMapContext.Provider>
            </>
        </GeoServerContext.Provider>
    )
}