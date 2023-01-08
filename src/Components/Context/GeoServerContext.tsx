import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {TileWMS, Vector} from "ol/source";
import {fromLonLat} from "ol/proj";
import fetchGeoserverData from "../../utils/fetchGeoserverData";
import {MapContext} from "./MapContainer";
import VectorLayer from "ol/layer/Vector";
import {Geometry} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {Icon, Style} from "ol/style";
import styleFunctionEspacesVerts from "../../utils/styleFunctions";
import findNearestPointOnVectorLayer from "../../utils/findNearestPoint";


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

            const vectorLayers: VectorLayer<Vector<Geometry>>[] = [];
            featureMap.forEach((featureList) => {
                const geojsonData = {
                    type: 'FeatureCollection',
                    features: featureList
                };
                const source = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData)
                });
                vectorLayers.push(new VectorLayer({
                    source: source,
                    // @ts-ignore
                    style: styleFunctionEspacesVerts,
                }));
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
            const srcUrl = `${process.env.PUBLIC_URL}/`;
            pavMap.forEach((featureList,key) => {
                const geojsonData = {
                    type: 'FeatureCollection',
                    features: featureList
                };
                const source = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData)
                });
                if (key) {
                    pavVectorLayers.push(new VectorLayer({
                        source: source,
                        style: new Style({
                            image: new Icon({
                                src: srcUrl + 'bin.svg',
                                color: "#00ff00"
                            }),
                        }),
                    }));
                } else {
                    pavVectorLayers.push(new VectorLayer({
                        source: source,
                        style: new Style({
                            image: new Icon({
                                src: srcUrl + 'bin.svg',
                                color: "#ff0000"
                            }),
                        }),
                    }));
                }
            });

            for (let i = 0 ; i < pavVectorLayers.length; i++){
                map?.addLayer(pavVectorLayers[i]);
            }

            for (let i = 0 ; i < vectorLayers.length; i++){
                map?.addLayer(vectorLayers[i]);
            }

            console.log(vectorLayers);
            console.log(pavVectorLayers);

            map?.on('singleclick', (event) => {
                const coordinate = event.coordinate;
                var pixel = map.getEventPixel(event.originalEvent);
                console.log(`User clicked the map at coordinates: ${coordinate}`);

                // Find the nearest point on the vector layer to the click
                const nearestPoint = findNearestPointOnVectorLayer(vectorLayers, pavVectorLayers, coordinate);
                console.log(nearestPoint);
            });

            return () => {
                for (let i = 0; i < vectorLayers.length; i++){
                    map?.removeLayer(vectorLayers[i]);
                }
                for (let i = 0; i < pavVectorLayers.length; i++){
                    map?.removeLayer(pavVectorLayers[i]);
                }
            }
        }
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
                {props.children}
            </>
        </GeoServerContext.Provider>
    )
}