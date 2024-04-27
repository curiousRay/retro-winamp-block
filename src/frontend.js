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
				let equ = posEqu;
				let list = posList;
				let milk = posMilkdrop; 
				let res = [];

				let mat = [[0,0,0], [0,0,0], [0,0,0]];
				if (equ != 0) { mat[0][equ-1] = 1; }
				if (list != 0) { mat[1][list-1] = 1; }
				if (milk != 0) { mat[2][milk-1] = 1; }

				for (let col = 0; col < 3; col++) {
					for (let row = 0; row < 3; row++) {
						if (mat[row][col] == 1 ) {
							res.push(row)
						}
					}
				}

				let res_text = []
				for (let elem = 0;elem < 3; elem++) {
					if(res[elem] + 1 == 1) {
						res_text.push("Equ")
					}
					if(res[elem] + 1 == 2) {
						res_text.push("List")
					}if(res[elem] + 1 == 3) {
						res_text.push("Milk")
					}
				}
				console.log("Align order:")
				console.log(res_text)

				const webAmpUI = document.querySelectorAll( '#webamp > div > div > div' );
				const webAmpUI_Equ = document.querySelectorAll( '#webamp > div > div > div' )[2].querySelector( 'div' );
				const webAmpUI_List = document.querySelectorAll( '#webamp > div > div > div' )[1].querySelector( 'div > div' );
				const webAmpUI_Milkdrop = document.querySelectorAll( '#webamp > div > div > div' )[3].querySelector( 'div > div' );
				webAmpUI_Equ.style.display = "none";
				webAmpUI_List.style.display = "none";
				webAmpUI_Milkdrop.style.display = "none";
				
				switch (res_text[0]) {
					case "Equ": 
						webAmpUI_Equ.style.display = "flex";
						switch (res_text[1]) {
							case "List":
								webAmpUI_List.style.display = "flex";
								switch (res_text[2]) {
									case "Milk": 
										webAmpUI_Milkdrop.style.display = "flex";
										webAmpUI_Milkdrop.style.transform = "translate(-275px, 377px)";
										webAmpUI_Milkdrop.querySelector("div").style.width = "275px";
										webAmpUI_Milkdrop.querySelector("div").style.height = "238px";
										break;
									default: break; //res_text has only two elems
								}
								break;
							case "Milk":
								webAmpUI_Milkdrop.style.display = "flex";
								webAmpUI_Milkdrop.style.transform = "translate(-275px, 232px)";
								webAmpUI_Milkdrop.querySelector("div").style.width = "275px";
								webAmpUI_Milkdrop.querySelector("div").style.height = "238px";
								switch (res_text[2]) {
									case "List":
										webAmpUI_List.style.display = "flex";
										webAmpUI_List.style.transform = "translate(0px, 238px)"
										break;
									default: break; //res_text has only two elems
								}
								break;
							default: break; //res_text has only one elem
						}
						break;
					case "List": 
						webAmpUI_List.style.display = "flex";
						webAmpUI_List.style.transform = "translate(0, -116px)";
						switch (res_text[1]) {
							case "Equ":
								webAmpUI_Equ.style.display = "flex";
								webAmpUI_Equ.style.transform = "translate(0, 145px)";
								switch (res_text[2]) {
									case "Milk":
										webAmpUI_Milkdrop.style.display = "flex";
										webAmpUI_Milkdrop.style.transform = "translate(-275px, 377px)";
										webAmpUI_Milkdrop.querySelector("div").style.width = "275px";
										webAmpUI_Milkdrop.querySelector("div").style.height = "238px";
										break;
									default: break; //res_text has only two elems
								}
								break;
							case "Milk":
								webAmpUI_Milkdrop.style.display = "flex";
								webAmpUI_Milkdrop.style.transform = "translate(-275px, 260px)"
								webAmpUI_Milkdrop.querySelector("div").style.width = "275px";
								webAmpUI_Milkdrop.querySelector("div").style.height = "238px";
								switch (res_text[2]) {
									case "Equ":
										webAmpUI_Equ.style.display = "flex";
										webAmpUI_Equ.style.transform = "translate(0, 383px)"; // 383 = 145+238
										break;
									default: break; //res_text has only two elems
								}
								break;
							default: break;	 //res_text has only one elem
						}
						break;
					case "Milk":
						webAmpUI_Milkdrop.style.display = "flex";
						webAmpUI_Milkdrop.style.transform = "translate(-275px, 116px)";
						webAmpUI_Milkdrop.querySelector("div").style.width = "275px";
						webAmpUI_Milkdrop.querySelector("div").style.height = "238px";
						switch (res_text[1]) {
							case "Equ":
								webAmpUI_Equ.style.display = "flex";
								webAmpUI_Equ.style.transform = "translate(0, 238px)";
								switch (res_text[2]) {
									case "List":
										webAmpUI_List.style.display = "flex";
										webAmpUI_List.style.transform = "translate(0, 238px)";
										break;
									default: break; //res_text has only two elems
								}
								break;
							case "List":
								webAmpUI_List.style.display = "flex";
								webAmpUI_List.style.transform = "translate(0, 122px)"; //122=-116+238
								switch (res_text[2]) {
									case "Equ":
										webAmpUI_Equ.style.display = "flex";
										webAmpUI_Equ.style.transform = "translate(0, 383px)"; // 383=145+238
										break;
									default: break; //res_text has only two elems
								}
								break;
							default: break; //res_text has only one elem
						}
						break;
					default: break; //res_text is empty
						

				}


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
				const webAmpUI_Equ = document.querySelectorAll( '#webamp > div > div > div' )[2].querySelector( 'div' );
				const webAmpUI_List = document.querySelectorAll( '#webamp > div > div > div' )[1].querySelector( 'div > div' );
				const webAmpUI_Milkdrop = document.querySelectorAll( '#webamp > div > div > div' )[3].querySelector( 'div > div' );

				switch (posEqu) {
					
					case "0": 
						webAmpUI_Equ.style.display = "none";

						if ( posList == "0" ) {
							webAmpUI_List.style.display = "none";
							if ( posMilkdrop != "0" ) {
								webAmpUI_Milkdrop.querySelector("div").style.width = "136px";
								webAmpUI_Milkdrop.querySelector("div").style.height = "116px";
								webAmpUI_Milkdrop.querySelector("div > .gen-top-left").style.width = "20px";
								webAmpUI_Milkdrop.querySelector("div > .gen-top-right").style.width = "20px";
							}
						} else {
							// playlist shall be moved upwards, equalizer is hidden
							webAmpUI_List.style.transform = "translate(0, -116px)";
							webAmpUI_Milkdrop.querySelector("div").style.width = "304px";
							webAmpUI_Milkdrop.querySelector("div").style.height = "261px";
						}
						break;

					case "1":
						if ( posList == "0" ) {
							webAmpUI_List.style.display = "none";
							webAmpUI_Milkdrop.querySelector("div").style.width = "268px";
							webAmpUI_Milkdrop.querySelector("div").style.height = "232px";
						}
						break;

					case "2":
						if ( posList == "0" ) {
							webAmpUI_List.style.display = "none";
							webAmpUI_Milkdrop.querySelector("div").style.width = "268px";
							webAmpUI_Milkdrop.querySelector("div").style.height = "232px";
						} else if ( posList == "1" ) {
							// playlist and equalizer are shown, but place swapped
							webAmpUI_List.style.transform = "translate(0, -116px)";
							webAmpUI_Equ.style.transform = "translate(0, 145px)";
						}
						break;

					case "3":
						if ( posList == "0" ) {
							webAmpUI_List.style.display = "none";
							webAmpUI_Milkdrop.querySelector("div").style.width = "268px";
							webAmpUI_Milkdrop.querySelector("div").style.height = "232px";
						} else if ( posList == "1" || posList == "2" ) {
							// playlist and equalizer are shown, but place swapped
							webAmpUI_List.style.transform = "translate(0, -116px)";
							webAmpUI_Equ.style.transform = "translate(0, 145px)";
						}
						break;
					
				}

				switch ( posMilkdrop ) {
					case "0": 
						webAmpUI_Milkdrop.style.display = "none";
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
