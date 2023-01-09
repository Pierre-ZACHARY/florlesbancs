import {Component} from "react";
import "./OpenLayers.sass";
import MapContainer from "../Components/Context/MapContainer";
import CurrentLocationContextCreator from "../Components/Context/CurrentLocationContainer";
import CurrentLocationMarker from "../Components/Markers/CurrentLocationMarker";
import NearestBenchButton from "../Components/Buttons/NearestBench";
import CurrentLocationButton from "../Components/Buttons/CurrentLocation";
import GeoServerContextComponent from "../Components/Context/GeoServerContext";
import OnClickListener from "../Components/Context/OnClickListener";
import {SuggestButton} from "../Components/Buttons/SuggestButton";
import {ShowSuggestionOverlay} from "../Components/Context/ShowSuggestionOverlay";
import {ShowDegradationOverlay} from "../Components/Context/ShowDegradationOverlay";



class Home extends Component<{}, {}> {

    // Home c'est la page d'accueil, celle renvoyee par defaut dans App.tsx, à priori c'est la seule page de l'application

    componentDidMount() {

    }
    render() {
        return (
            <MapContainer> {/* MapContainer est un composant qui permet de créer une carte OpenLayers, la map est ensuite accessible par tous les enfants via le hook : "useContext" ( voir exemple dans CurrentLocationMarker par exemple ) */}
                <GeoServerContextComponent>

                    <CurrentLocationContextCreator>
                        <OnClickListener>
                            <ShowSuggestionOverlay/>
                            <ShowDegradationOverlay/>
                            <CurrentLocationMarker/>
                            <div style={{
                                position: "absolute",
                                left: 0,
                                paddingBottom: "env(safe-area-inset-bottom)",
                                bottom: 0,
                                zIndex: 10,
                            }}>
                                {/* ça c'est la div qui place automatiquement les boutons en bas à gauche de l'écran */}
                                <SuggestButton/>
                                <NearestBenchButton/>
                                <CurrentLocationButton/>
                            </div>
                        </OnClickListener>
                    </CurrentLocationContextCreator>

                </GeoServerContextComponent>
            </MapContainer>
        );
    }
}

export default Home;