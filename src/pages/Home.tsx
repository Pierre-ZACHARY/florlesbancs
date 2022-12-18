import {Component} from "react";
import "./OpenLayers.sass";
import MapContainer from "../Components/Context/MapContainer";
import CurrentLocationContextCreator from "../Components/Context/CurrentLocationContainer";
import CurrentLocationMarker from "../Components/Markers/CurrentLocationMarker";
import NearestBenchButton from "../Components/Buttons/NearestBench";



class Home extends Component<{}, {}> {

    componentDidMount() {

    }
    render() {
        return (
            <MapContainer>
                <CurrentLocationContextCreator>
                    <CurrentLocationMarker/>
                    <div style={{
                        position: "absolute",
                        left: 0,
                        paddingBottom: "env(safe-area-inset-bottom)",
                        bottom: 0,
                        zIndex: 10,
                    }}>
                        <NearestBenchButton/>
                    </div>
                </CurrentLocationContextCreator>
            </MapContainer>
        );
    }
}

export default Home;