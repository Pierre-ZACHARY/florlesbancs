import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {TileWMS, Vector} from "ol/source";

import LocationMarker from "../Markers/LocationMarker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChair, faLocationPin, faMonument} from "@fortawesome/free-solid-svg-icons";
import {faPagelines} from "@fortawesome/free-brands-svg-icons";
import {fromLonLat} from "ol/proj";
import fetchGeoserverData from "../../utils/fetchGeoserverData";
import {MapContext} from "./MapContainer";
import VectorLayer from "ol/layer/Vector";
import {Geometry} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";
import {transformExtent} from "ol/proj";


export const GeoServerContext = createContext<TileWMS[] | null>(null);


function changeIcon(feat: any) {
    // console.log(feat);
    var descr = feat.properties.descriptio;
    switch (descr) {
        case "Banc public":
            return <FontAwesomeIcon icon={faChair}/>

        case "Colonne végétale":
            return <FontAwesomeIcon icon={faPagelines}/>

        case "Statue, monument" :
            return <FontAwesomeIcon icon={faMonument}/>

        case "Bac à fleur rectangulaire":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Armoire d'arrosage":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Grille ronde arbre":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Jardinière sur poteau" :
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Jeu d'enfant rond":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Jeu d'enfant rectangulaire":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Tête d'arrosage":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Portique pour végétation" :
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Robinet ou vanne d'arrosage":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Manège":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Jardinière suspendue":
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Grille carrée arbre" :
            return <FontAwesomeIcon icon={faLocationPin}/>

        case "Jardinière ronde":
            return <FontAwesomeIcon icon={faLocationPin}/>

        default:
            return <FontAwesomeIcon icon={faLocationPin}/>
    }
}

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
                    // vous pouvez définir un style pour la couche ici
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
            pavMap.forEach((featureList) => {
                const geojsonData = {
                    type: 'FeatureCollection',
                    features: featureList
                };
                const source = new VectorSource({
                    features: new GeoJSON().readFeatures(geojsonData)
                });
                pavVectorLayers.push(new VectorLayer({
                    source: source,
                    // vous pouvez définir un style pour la couche ici
                }));
            });

            for (let i = 0 ; i < vectorLayers.length; i++){
                map?.addLayer(vectorLayers[i]);
            }
            for (let i = 0 ; i < pavVectorLayers.length; i++){
                map?.addLayer(pavVectorLayers[i]);
            }

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