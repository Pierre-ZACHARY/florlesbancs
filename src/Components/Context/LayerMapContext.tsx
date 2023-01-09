import {createContext} from "react";
import VectorLayer from "ol/layer/Vector";

export const LayersMapContext = createContext<Map<string, VectorLayer<any>>>(new Map() );


export default LayersMapContext;