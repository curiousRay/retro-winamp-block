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
	new Webamp( { ...options, ...milkdropOptions } )
		.renderWhenReady( container )
		.then( () => {
			const player = document.getElementById( 'webamp' );

			const block = document.querySelector(".wp-block-tenup-winamp-block")
			var posEqu = block.getAttribute("data-pos-equ");
			console.log("posEqu is: "+posEqu);
			var posList = block.getAttribute("data-pos-list");
			console.log("posList is: "+posList);
			var posMilkdrop = block.getAttribute("data-pos-milkdrop");
			console.log("posMilkdrop is: "+posMilkdrop);

			if (block.closest(".widget")) {
				console.log("Sidebar player");

			} else {
				console.log("Post/Page player");

				// This is a hack to move the UI elements into the correct position. The
				// Webamp library tries to center the player in the window, but we want it
				// to be tucked neatly in the block.
				const mapping = {
					0: 'translate( 0px, 0px )',
					1: 'translate( 0px, 232px )',
					2: 'translate( 0px, 116px )',
					3: 'translate( 275px, 0px )',
				}
				const webAmpUI = document.querySelectorAll( '#webamp > div > div > div' );

				switch (posEqu) {
					
					case "0": 
						document.querySelectorAll( '#webamp > div > div > div' )[2].querySelector( 'div' ).style.display = "none";
						//webAmpUI[1].style.display = "none";
						console.log("隐藏了1：");
						//console.log(webAmpUI[1]);
					break;
					
				}
				
				switch (posList) {
					case "0": 
						document.querySelectorAll( '#webamp > div > div > div' )[1].querySelector( 'div > div' ).style.display = "none";
						//webAmpUI[2].style.display = "none";
						console.log("隐藏了2：");
						//console.log(webAmpUI[2]);
					break;
				}

				switch (posMilkdrop) {
					case "0": 
						document.querySelectorAll( '#webamp > div > div > div' )[3].querySelector( 'div > div' ).style.display = "none";
						//webAmpUI[3].style.display = "none";
						console.log("隐藏了3：");
						//console.log(webAmpUI[3]);
					break;
				}
				
				webAmpUI.forEach( ( ui, i ) => {
				//	ui.style.transform = mapping[ i ];
				} );

			}

			// Add is loaded class after artifical delay to reduce page jank
			if ( player ) {
				setTimeout( () => {
					player.classList.add( 'is-loaded' );
				}, 1000 );
			}
		} );
} );
