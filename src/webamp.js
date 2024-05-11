import { useEffect, useState, useRef } from '@wordpress/element';
import Webamp from 'webamp';

/**
 * Internal dependencies
 */
import milkdropOptions from './milkdrop';

export const WebAmp = ( props ) => {
	const { audio = [], currentSkin = '', preview = true } = props;
	const divRef = useRef( null );
	const [ webamp, setWebamp ] = useState( null );

	// Initial player load
	useEffect( () => {
		if ( divRef === null ) {
			return;
		}
		
		const options = {
			initialTracks: [],
		};

		audio.forEach( ( audioTrack ) =>
			options.initialTracks.push( { url: audioTrack.url } )
		);

		// Add the custom skin if it was set
		if ( currentSkin ) {
			const match = currentSkin.match(
				/(?:https?:)?(?:\/\/)?skins\.webamp\.org\/skin\/(\w+)\/(?:.*)?/
			);
			if ( match && match.length === 2 ) {
				options.initialSkin = {
					url: `https://cdn.webampskins.org/skins/${ match[ 1 ] }.wsz`,
				};
			}
		}

		const player = new Webamp( { ...options, ...milkdropOptions } );
		setWebamp( player );
		player.renderWhenReady( divRef.current ).then( () => {
			const webAmp = document.getElementById( 'webamp' );

			// Move the Webamp player markup into the block
			// so that the block can be interacted with while the player is visible
			const webampContainer = document.getElementById( 'webamp-container' );

			if ( webampContainer && webAmp ) {
				webampContainer.appendChild( webAmp );
			}

			// Make winamp windows not draggable everywhere
			document.querySelectorAll("div.draggable").forEach(elem => {
				elem.classList.remove("draggable");
			})

			function rePosition() {
				// This is a hack to move the UI elements into the correct position. The
				// Webamp library tries to center the player in the window, but we want it
				// to be tucked neatly in the block.
				var initPosX, initPosY;
				document.querySelector('#webamp div div').childNodes.forEach((elem, index) => {
					// re-positioning on axis X
					var elemPosX = parseFloat(elem.style.transform.match(/translate\(([-]?\d+)px,\s*[-]?\d+px\)/)[1]); // iterate X position of each window
					if (index == 0) { initPosX = elemPosX; } // get first window (Main window)'s X-position as baseline
					var elemPosX_new = (elemPosX - initPosX).toString()+'px'; // calc new X-position

					elem.style.transform = elem.style.transform.replace(/translate\(\d+px/, "translate(" + elemPosX_new); // apply change
					// re-positioning on axis Y
					var elemPosY = parseFloat(elem.style.transform.match(/, (.*?)px/)[1]); // iterate Y position of each window
					if (index == 0) { initPosY = elemPosY; } // get first window (Main window)'s Y-position as baseline
					var elemPosY_new = (elemPosY - initPosY).toString()+'px'; // calc new Y-position
					elem.style.transform = elem.style.transform.replace(/,(.*?\))/, ', ' + elemPosY_new + ')'); // apply change
				});
			}
			
			rePosition(); // run on init
				
			// Create a MutationObserver to watch for changes in the DOM
			function handleMutation(mutationsList, observer) {
				for (const mutation of mutationsList) {
					if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
						if (mutation.target.style.transform !== "translate(0px, 0px)") {
							//console.log(`'transform' property changed to: ${mutation.target.style.transform}`);
							rePosition();
						}
					}
				}
			}
			const observer = new MutationObserver(handleMutation);
			// Start observing the DOM
			observer.observe(document.querySelector('#webamp div div div'), { attributes: true, attributeFilter: ['style'] });

			// Add is loaded class after artifical delay to reduce page jank
			if ( webAmp ) {
				webAmp.classList.add( 'is-loaded' );
			}
		} );

		return () => {
			// Hide the player instead of destroying it. This allows the player
			// to persist between previews and playlist modification.
			const webampContainer = document.getElementById( 'webamp' );
			if ( webampContainer ) {
				webampContainer.style.display = ! preview ? 'none' : 'block';
			}
		};
	}, [ divRef.current ] );

	// Change the skin as it changes
	useEffect( () => {
		if ( webamp === null ) {
			return;
		}

		if ( currentSkin ) {
			const match = currentSkin.match(
				/(?:https?:)?(?:\/\/)?skins\.webamp\.org\/skin\/(\w+)\/(?:.*)?/
			);
			if ( match && match.length === 2 ) {
				webamp.setSkinFromUrl(
					`https://cdn.webampskins.org/skins/${ match[ 1 ] }.wsz`
				);
			}
		} else {
			webamp.setSkinFromUrl(
				'https://cdn.webampskins.org/skins/5e4f10275dcb1fb211d4a8b4f1bda236.wsz'
			);
		}
	}, [ currentSkin ] );

	return <div ref={ divRef } />;
};

export default WebAmp;
