import {useContext} from "react";
import {GeoServerContext} from "../Context/GeoServerContext";


const FilterButton = () => {


    // ici vous accéder au contexte de geoserver via le hook useContext ( car FilterButton est un enfant de GeoServerContextComponent )
    const GeoserverContext = useContext(GeoServerContext); // GeoserverContext est du type GeoServerContextType, comme défini dans GeoServerContext.tsx
    // TODO selon le type de batiment sélectionner, on veut modifier le filtre du contexte de geoserver
    return (<></>) // TODO ajouter l'html du bouton ici
}

export default FilterButton;