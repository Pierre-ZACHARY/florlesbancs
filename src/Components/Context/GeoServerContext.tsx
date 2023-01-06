import {createContext, PropsWithChildren, useState} from "react";
import {GeoServerData} from "../../utils/fetchGeoserverData";


interface GeoServerContextType { // TODO c'est juste un exemple de context, à toi de voir comment tu veux faire
    data: GeoServerData[] | null;
    filter: string; // TODO : Change to enum
}

export const GeoServerContext = createContext<GeoServerContextType | null>(null);


export default function GeoServerContextComponent(props: PropsWithChildren<{}>) {

    // /!\ ne jamais fetch un objet à ce niveau, sinon il sera refetch à chaque re-render

    const [context] = useState<GeoServerContextType | null>( () => {
        // TODO ici on fetch les données via le utils dans fetchGeoserverData.ts
        // et il suffit de les return en dessous ( en respectant le type définit plus haut )
        return {data: null, filter: "all"}
    });



    return (
        <GeoServerContext.Provider value={context}>
            {props.children}
        </GeoServerContext.Provider>
    )
}