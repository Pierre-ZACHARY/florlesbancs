import {Feature} from "ol";
import {Fill, Icon, Style} from "ol/style";

export default function styleFunctionEspacesVerts(feature: Feature): Style {
    const description = feature.getProperties().descriptio;
    let icon;
    const srcUrl = `${process.env.PUBLIC_URL}/`;
    switch (description) {
        case "Tête d'arrosage":
            icon = new Icon({
                src: srcUrl + 'arrosage.png',
                color: "#2d96e8"
            });
            break;
        case 'Banc public':
            icon = new Icon({
                src: srcUrl + 'bench.png',
            });
            break;
        case "Grille carrée arbre":
            icon = new Icon({
                src: srcUrl + 'tree.png'
            });
            break;
        case "Bac à fleur rectangulaire":
            icon = new Icon({
                src: srcUrl + 'flower.png'
            });
            break;
        case "Jardinière ronde":
            icon = new Icon({
                src: srcUrl + 'plante.png'
            });
            break;
        case "Jeu d'enfant rectangulaire":
            icon = new Icon({
                src: srcUrl + 'playground.png'
            });
            break;
        case "Robinet ou vanne d'arrosage":
            icon = new Icon({
                src: srcUrl + 'robinet.svg'
            });
            break;
        case "Armoire d'arrosage":
            icon = new Icon({
                src: srcUrl + 'colonnevege.png'
            });
            break;
        case "Jeu d'enfant rond":
            icon = new Icon({
                src: srcUrl + 'playground.png'
            });
            break;
        case "Statue, monument":
            icon = new Icon({
                src: srcUrl + 'monument.png'
            });
            break;
        case "Grille ronde arbre":
            icon = new Icon({
                src: srcUrl + 'tree.png'
            });
            break;
        case "Jardinière suspendue":
            icon = new Icon({
                src: srcUrl + 'plante.png'
            });
            break;
        case "Colonne végétale":
            icon = new Icon({
                src: srcUrl + 'plante.png'
            });
            break;
        case "Jardinière sur poteau":
            icon = new Icon({
                src: srcUrl + 'plante.png'
            });
            break;
        case "Portique pour végétation":
            icon = new Icon({
                src: srcUrl + 'plante.png'
            });
            break;
        case "Manège":
            icon = new Icon({
                src: srcUrl + 'manege.png',
            });
            break;
        default:
            icon = new Icon({
                src: srcUrl + 'pin.png',
                color: '#0000ff'
            });
    }
    return new Style({
        image: icon,
    });
};

