import { scene, camera, renderer, stats } from './_basis.js'

export function animate() {
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update()
}