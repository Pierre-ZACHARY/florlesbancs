import {Component} from "react";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {View, Map} from "ol";
import {fromLonLat} from "ol/proj";
import styles from "./Home.module.sass";
import "../global-styles/OpenLayers.sass";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import Popup from "ol-ext/overlay/Popup";
import {renderToString} from "react-dom/server";

class Home extends Component<{}, {currentLocation: number[], myMap: Map, openPopup: null | Popup}> {
    constructor(props: any) {
        super(props);
        const view = new View({
                center: [0,0],
                zoom: 0,
            });
        const map = new Map({
            target: "",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: view
        });
        this.state = {
            currentLocation: [0,0],
            myMap: map,
            openPopup: null
        };

        this.setPosition = this.setPosition.bind(this);
        this.showPopup = this.showPopup.bind(this);
    }

    showPopup() {
        if(this.state.openPopup) {
            this.state.openPopup.hide();
            this.state.myMap.removeOverlay(this.state.openPopup);
            this.setState({...this.state, openPopup: null});
            return;
        }
        const popup = new Popup({positioning: 'bottom-center', popupClass: styles.popup});
        this.state.myMap.addOverlay(popup);
        const center = fromLonLat(this.state.currentLocation);
        popup.show(center, renderToString(
            <div className={styles.locationMarkerPopup} id={"currentLocationPopUp"}>
                <h1>Votre position !</h1>
            </div>));
        this.setState({...this.state, openPopup: popup});
    }

    setPosition(position: GeolocationPosition) {
        if(position.coords.longitude+position.coords.latitude>0) {
            console.log(position)
            const center = fromLonLat([position.coords.longitude, position.coords.latitude]);
            const zoom = 12;
            this.state.myMap.getView().animate({zoom: zoom, center: center}, {duration: 2000});

            const popup = new Popup({positioning: 'bottom-center', popupClass: styles.popup});
            this.state.myMap.addOverlay(popup);
            popup.show(center, renderToString(
                <div className={styles.locationMarker} id={"currentLocation"}>
                    <FontAwesomeIcon icon={faLocationDot}/>
                </div>));

            // On ne peut pas ajouter de Onclick dans le renderToString donc on le fait après... ( nul )
            document.getElementById("currentLocation")?.addEventListener("click", this.showPopup);

            this.setState({...this.state, currentLocation: [position.coords.longitude, position.coords.latitude]});
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(this.setPosition);
        if(this.state.myMap) {
            this.state.myMap.setTarget("map-container");
        }
    }

    render() {
        return (
            <div className={styles.main+" map-container"} id="map-container"/>
        );
    }
}

export default Home;