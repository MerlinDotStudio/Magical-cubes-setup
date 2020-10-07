import { scene, camera, renderer, stats } from './basis.js'

export function animate() {
	requestAnimationFrame( animate );
    renderer.render( scene, camera );
    stats.update()
}