import Webamp from 'webamp';

/**
 * Internal dependencies
 */
import milkdropOptions from './milkdrop';

// Run on window.load to reduce jank on page load
window.addEventListener( 'load', () => {

	// move webamp from body root to our container
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
			container.appendChild(document.getElementById( 'webamp' ));



			const player = document.getElementById( 'webamp' );

			const block = document.querySelector(".wp-block-tenup-winamp-block");
			if ( block ) {
				var posEqu = block?.dataset.posequ || "1";
				var posList = block?.dataset.poslist || "2";
				var posMilkdrop = block?.dataset.posmilkdrop || "3";
				const webAmpUI_Equ = document.querySelectorAll( '#webamp > div > div > div' )[2].querySelector( 'div' );
				const webAmpUI_List = document.querySelectorAll( '#webamp > div > div > div' )[1].querySelector( 'div > div' );
				const webAmpUI_Milkdrop = document.querySelectorAll( '#webamp > div > div > div' )[3].querySelector( 'div > div' );
				if (posEqu == "0") { webAmpUI_Equ.style.display = "none"; }
				if (posList == "0") { webAmpUI_List.style.display = "none"; }
				if (posMilkdrop == "0") { webAmpUI_Milkdrop.style.display = "none"; }
			}

			// Add is loaded class after artifical delay to reduce page jank
			if ( player ) {
				setTimeout( () => {
					player.classList.add( 'is-loaded' );

					// Make winamp windows not draggable everywhere
					document.querySelectorAll("div.draggable").forEach(elem => {
						elem.classList.remove("draggable");
					})

					// Adjust position after putting webamp into the block container 
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
				   })

				}, 1000 );
			}
		} );
} );
