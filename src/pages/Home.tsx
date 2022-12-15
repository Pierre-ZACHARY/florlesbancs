import {Component} from "react";
import "./OpenLayers.sass";
import MapContainer from "../Components/Context/MapContainer";
import CurrentLocationContextCreator from "../Components/Context/CurrentLocationContainer";
import CurrentLocationMarker from "../Components/Markers/CurrentLocationMarker";



class Home extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {

    }
    render() {
        return (
            <MapContainer>
                <CurrentLocationContextCreator>
                    <CurrentLocationMarker/>
                </CurrentLocationContextCreator>
            </MapContainer>
        );
    }
}

export default Home;