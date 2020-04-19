import { HemisphereLight, HemisphereLightHelper, DirectionalLight, DirectionalLightHelper, Color } from '../libs/three.module.js'
import { scene } from './_basis.js'

const hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 2, 5, 0 );
scene.add( hemiLight );

const hemiLightHelper = new HemisphereLightHelper( hemiLight, 1, new Color().setHex(0x000000) );
scene.add( hemiLightHelper );

const dirLight = new DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -15, 10, 10 );
scene.add( dirLight );

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const  d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

const dirLightHeper = new DirectionalLightHelper( dirLight, 10 );
scene.add( dirLightHeper );