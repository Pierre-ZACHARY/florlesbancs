import {Component} from "react";
import "./OpenLayers.sass";
import MapContainer from "../Components/Context/MapContainer";
import CurrentLocationContextCreator from "../Components/Context/CurrentLocationContainer";
import CurrentLocationMarker from "../Components/Markers/CurrentLocationMarker";
import NearestBenchButton from "../Components/Buttons/NearestBench";
import CurrentLocationButton from "../Components/Buttons/CurrentLocation";
import GeoServerContextComponent, {GeoServerContext} from "../Components/Context/GeoServerContext";
import FilterButton from "../Components/Buttons/FilterButton";



class Home extends Component<{}, {}> {

    // Home c'est la page d'accueil, celle renvoyee par defaut dans App.tsx, à priori c'est la seule page de l'application

    componentDidMount() {

    }
    render() {
        return (
            <MapContainer> {/* MapContainer est un composant qui permet de créer une carte OpenLayers, la map est ensuite accessible par tous les enfants via le hook : "useContext" ( voir exemple dans CurrentLocationMarker par exemple ) */}
                {/* TODO j'ai créer un component temporaire en dessous pour gérer le contexte de geoserver : le compléter */}
                <GeoServerContextComponent>

                    <CurrentLocationContextCreator>
                        <CurrentLocationMarker/>
                        <div style={{
                            position: "absolute",
                            left: 0,
                            paddingBottom: "env(safe-area-inset-bottom)",
                            bottom: 0,
                            zIndex: 10,
                        }}>
                            {/* ça c'est la div qui place automatiquement les boutons en bas à gauche de l'écran */}
                            {/* TODO complémenter le bouton en dessous pour ajouter le filtre */}
                            <FilterButton/>
                            <NearestBenchButton/>
                            <CurrentLocationButton/>
                        </div>
                    </CurrentLocationContextCreator>

                </GeoServerContextComponent>
            </MapContainer>
        );
    }
}

export default Home;