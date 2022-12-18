import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChair} from "@fortawesome/free-solid-svg-icons";
import styles from "./Button.module.sass";
import {Coordinate} from "ol/coordinate";
import {useContext, useEffect, useState} from "react";
import {CurrentLocationContext} from "../Context/CurrentLocationContainer";
import findNearestBenchAtCoordinate from "../../utils/findNearestBench";
import LocationMarker from "../Markers/LocationMarker";
import {fromLonLat, toLonLat} from "ol/proj";
import findPath from "../../utils/osmrFindPath";
import {MapContext} from "../Context/MapContainer";
import {Feature} from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Polyline} from "ol/format";
import {Stroke, Style} from "ol/style";
import {LineString} from "ol/geom";

const NearestBenchButton = () => {
    const currentlonlat = useContext(CurrentLocationContext);
    const map = useContext(MapContext);
    const [neareastBenchLonLat, setNearestBenchLonLat] = useState<Coordinate|null>(null);
    const [showNearestBench, setShowNearestBench] = useState<boolean>(false);
    const [polyline, setPolyline] = useState<any>(null);
    useEffect(() => {
        if(currentlonlat) {
            findNearestBenchAtCoordinate(currentlonlat).then((bench) => {
                setNearestBenchLonLat(bench);
            })
        }
    }, [currentlonlat]);
    useEffect(()=>{
        if(neareastBenchLonLat) {
            findPath(currentlonlat!, toLonLat(neareastBenchLonLat)).then((polyline)=>{
                setPolyline(polyline);
            });
        }
    }, [neareastBenchLonLat, currentlonlat]);
    useEffect(()=>{
        if(polyline && showNearestBench) {
            const route = new Polyline({
                factor: 1e6,
            }).readGeometry(polyline, {
                dataProjection: 'EPSG:4326',
                featureProjection: map!.getView().getProjection(),
            });
            const routeFeature = new Feature({
                type: 'route',
                geometry: route,
            });
            const routeLayer = new VectorLayer({
                source: new VectorSource({
                    features: [routeFeature],
                }),
                style: new Style({
                    stroke: new Stroke({
                        width: 4,
                        color: 'red',
                    }),
                }),
            });
            // Create a feature for the dot line
            const dotLineFeatureCurrentLocationToRoute = new Feature({
                geometry: new LineString([fromLonLat(currentlonlat!), route.getClosestPoint(fromLonLat(currentlonlat!))]),
            });
            // Create a feature for the dot line
            const dotLineFeatureRouteToBench = new Feature({
                geometry: new LineString([neareastBenchLonLat!, route.getClosestPoint(neareastBenchLonLat!)]),
            });

            const dotLineLayer = new VectorLayer({
                source: new VectorSource({
                    features: [dotLineFeatureCurrentLocationToRoute, dotLineFeatureRouteToBench],
                }),
                style:  new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2,
                        lineDash: [1, 4]
                    })
                })
            });
            map!.addLayer(routeLayer);
            map!.addLayer(dotLineLayer);
            map!.getView().fit(routeFeature.getGeometry()!.getExtent(), {
                    padding: [200, 200, 200, 200],
                    duration: 500,
            });
            return () => {
                map!.removeLayer(routeLayer);
                map!.removeLayer(dotLineLayer);
            }
        }
    }, [map, polyline, showNearestBench, neareastBenchLonLat, currentlonlat]);


    return (
        <>
            {neareastBenchLonLat && showNearestBench && <LocationMarker position={neareastBenchLonLat} onClick={() => {}} positioning={"center-center"}>
                <FontAwesomeIcon icon={faChair}/>
            </LocationMarker>}
            <div className={styles.main}>
                <button className={showNearestBench ? styles.active : ""} disabled={neareastBenchLonLat==null} onClick={()=>{setShowNearestBench(!showNearestBench)}}><FontAwesomeIcon icon={faChair}/></button>
            </div>
        </>
    )
}

export default NearestBenchButton;