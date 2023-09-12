import Webamp from 'webamp';

/**
 * Internal dependencies
 */
import milkdropOptions from './milkdrop';

// Run on window.load to reduce jank on page load
window.addEventListener( 'load', () => {
	const container = document.querySelector( '.wp-block-tenup-winamp-block' );

	// Ensure our container exists
	if ( ! container ) {
		return;
	}

	// Ensure we actually have some audio to play
	const audioElements = container.querySelectorAll( 'audio' );
	if ( ! audioElements ) {
		return;
	}

	const options = {
		initialTracks: [],
	};

	audioElements.forEach( ( audio ) => {
		const { src: url = '', artist = '', title = '' } = audio.dataset;

		options.initialTracks.push( {
			url,
			metaData: {
				artist,
				title,
			},
		} );
	} );

	// Ensure our audio tracks were added correctly
	if ( options.initialTracks.length === 0 ) {
		return;
	}

	const skin = container.dataset.skin || '';

	// Add the custom skin if it was set
	if ( skin ) {
		const match = skin.match(
			/(?:https?:)?(?:\/\/)?skins\.webamp\.org\/skin\/(\w+)\/(?:.*)?/
		);
		if ( match && match.length === 2 ) {
			options.initialSkin = {
				url: `https://cdn.webampskins.org/skins/${ match[ 1 ] }.wsz`,
			};
		}
	}

	// Render the player
	new Webamp( { ...options, ...milkdropOptions } ).renderWhenReady( container ).then( () => {
		
		// Move webamp from body root to our container
		container.appendChild(document.getElementById( 'webamp' ));

		const player = document.getElementById( 'webamp' );

		// Add is loaded class after artifical delay to reduce page jank
		if ( player ) {
			setTimeout( () => {
				player.classList.add( 'is-loaded' );

				// Adjust layouts
				document.querySelector('#webamp div div').childNodes.forEach(elem => {
					elem.style.transform = "";
					elem.style.position = "";
				})

				// Callback function to handle mutations in the DOM
				function handleMutation(mutationsList, observer) {
					for (const mutation of mutationsList) {
						if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
							for (const newNode of mutation.addedNodes) {
								if (newNode.nodeType === Node.ELEMENT_NODE && newNode.id === 'webamp-context-menu') {
									// Find the newly-added menu node, set z-index to make it visible
									newNode.style.zIndex = '5';
								}
							}
						}

						if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
							if (mutation.target.style.transform) {
								// console.log(`'transform' property changed to: ${mutation.target.style.transform}`);
								
								// Forcely clear transform to prevent webamp from shifting
								document.querySelector('#webamp div div').childNodes.forEach(elem => {
									elem.style.transform = "";
								})
							}
						}
					}
				}

				// Create a MutationObserver to watch for changes in the DOM
				const observer = new MutationObserver(handleMutation);

				// Start observing the DOM
				observer.observe(document, { childList: true, subtree: true });

				observer.observe(document.querySelector('#webamp div div div'), { attributes: true, attributeFilter: ['style'] });

			}, 1000 );
		}
	} );
} );
