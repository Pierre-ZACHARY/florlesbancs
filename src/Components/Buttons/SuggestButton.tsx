import styles from "./Button.module.sass";
import {faFontAwesome, faTriangleExclamation, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext, useEffect, useState} from "react";
import {NearestPointContext} from "../Context/OnClickListener";
import {toLonLat} from "ol/proj";
import {Feature} from "ol";
import {Geometry} from "ol/geom";


async function addDegradation(mobilier_concerne: String, nature_de_la_degradation: String, coordinates: number[]): Promise<any> {
    const now = new Date();
    const isoString = now.toISOString();
    await fetch("http://localhost:8080/geoserver/toto/wfs", {
        method: 'post',
        headers: new Headers({
        'Authorization': 'Basic admib:geoserver',
        'Content-Type': 'application/text/xml',
        'Accept': 'application/json'
        }),
        mode: 'no-cors',
        body: `
                <wfs:Transaction service="WFS" version="1.1.0"
                             xmlns:wfs="http://www.opengis.net/wfs"
                             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                             xsi:schemaLocation="http://www.opengis.net/wfs">
                    <wfs:Insert>
                        <degradation>
                            <mobilier_concerne>${mobilier_concerne}</mobilier_concerne>
                            <nature_de_la_degradation>${nature_de_la_degradation}</nature_de_la_degradation>
                            <date>${isoString}</date>
                            <geometry>
                                <gml:Point srsDimension="2" srsName="EPSG:2263" xmlns:gml="http://www.opengis.net/gml">
                                    <gml:coordinates decimal="." cs="," ts=" " xmlns:gml="http://www.opengis.net/gml">${coordinates[0]},${coordinates[1]}</gml:coordinates>
                                </gml:Point>
                            </geometry>
                        </degradation>
                    </wfs:Insert>
                </wfs:Transaction>
                `
    } )
    return null;
}

async function addSuggestion(type: String, contenu: String, coordinates: number[]): Promise<any> {
    const now = new Date();
    const isoString = now.toISOString();
    //@ts-ignore
    await fetch("http://localhost:8080/geoserver/toto/wfs", {
        method: 'post',
        headers: new Headers({
            'Authorization': 'Basic admib:geoserver',
            'Content-Type': 'application/text/xml',
            'Accept': 'application/json'
        }),
        mode: 'no-cors',
        body: `
                <wfs:Transaction service="WFS" version="1.1.0"
                             xmlns:wfs="http://www.opengis.net/wfs"
                             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                             xsi:schemaLocation="http://www.opengis.net/wfs">
                    <wfs:Insert>
                        <suggestion_ajout>
                            <type>${type}</type>
                            <contenu>${contenu}</contenu>
                            <date>${isoString}</date>
                            <geometry>
                                <gml:Point srsDimension="2" srsName="EPSG:2263" xmlns:gml="http://www.opengis.net/gml">
                                    <gml:coordinates decimal="." cs="," ts=" " xmlns:gml="http://www.opengis.net/gml">${coordinates[0]},${coordinates[1]}</gml:coordinates>
                                </gml:Point>
                            </geometry>
                        </suggestion_ajout>
                    </wfs:Insert>
                </wfs:Transaction>
                `
    } )
    return null;
}


export const SuggestButton = () => {


    const selectedFeature = useContext(NearestPointContext);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [suggestionValue, setSuggestionValue] = useState<string>("");
    const [typeValue, setTypeValue] = useState<string>("");
    const [isDegradation, setIsDegradation] = useState<boolean>(false);
    useEffect(() => {

        setIsDegradation(selectedFeature instanceof Feature<Geometry>);

    },[selectedFeature]);

    if(!selectedFeature && modalOpen) {
        setModalOpen(false);
    }

    return (
        <>
            <div className={styles.main}>
                <button className={modalOpen? styles.active : ""} disabled={selectedFeature==null} onClick={()=>setModalOpen(!modalOpen)}>{isDegradation ? <FontAwesomeIcon icon={faTriangleExclamation}/> : <FontAwesomeIcon icon={faFontAwesome}/> }</button>
            </div>
            {modalOpen && selectedFeature instanceof Feature<Geometry> && <div className={styles.modal}>
                <div className={styles.modalMain}>
                    <button className={styles.close} onClick={()=>{setModalOpen(false)}}><FontAwesomeIcon icon={faXmark}/></button>
                    <h1>{selectedFeature && selectedFeature["values_"]["descriptio"]}</h1>
                    <p>{selectedFeature && toLonLat(selectedFeature["values_"]["geometry"]["flatCoordinates"]).toString()}</p>
                    <textarea placeholder={"Signaler une dégradation ici..."} onChange={(change) => {setSuggestionValue(change.target.value)}} value={suggestionValue}></textarea>
                    <button className={styles.send} onClick={()=>{
                        if(selectedFeature) addDegradation(selectedFeature["values_"]["descriptio"], suggestionValue, toLonLat(selectedFeature["values_"]["geometry"]["flatCoordinates"], "EPSG:3857")).then(()=>setModalOpen(false))}
                    }>Envoyer</button>
                </div>
            </div>}

            {modalOpen && !isDegradation && <div className={styles.modal}>
                <div className={styles.modalMain}>
                    <button className={styles.close} onClick={()=>{setModalOpen(false)}}><FontAwesomeIcon icon={faXmark}/></button>
                    <p>{selectedFeature && toLonLat(selectedFeature as number[]).toString()}</p>
                    <textarea placeholder={"Type de mobilier..."} onChange={(change) => {setTypeValue(change.target.value)}} value={typeValue}></textarea>
                    <textarea placeholder={"Votre suggestion ici..."} onChange={(change) => {setSuggestionValue(change.target.value)}} value={suggestionValue}></textarea>
                    <button className={styles.send} onClick={()=>{
                        if(selectedFeature) addSuggestion(typeValue, suggestionValue, toLonLat(selectedFeature as number[], "EPSG:3857")).then(()=>setModalOpen(false))}
                    }>Envoyer</button>
                </div>
            </div>}
        </>

    )
}