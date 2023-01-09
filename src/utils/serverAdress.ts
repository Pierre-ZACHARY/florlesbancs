import {Capacitor} from "@capacitor/core";

function getServerAdress() {
    if(Capacitor.getPlatform() === 'android') {
        // the android emulator ip address for localhost
        return "http://10.0.2.2:8080"
    }
  return 'http://localhost:8080';
}

export default getServerAdress;