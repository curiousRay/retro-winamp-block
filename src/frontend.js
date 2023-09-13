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

				

				// 取消鼠标模式下的点击拖动功能
					document.querySelectorAll("div.draggable").forEach(elem => {
						elem.classList.remove("draggable");
					})

				// Adjust layouts
				var first_match = document.querySelector('#webamp div div').childNodes[0].style.transform.match(/, (.*?)px/);
				var initNum = parseFloat(first_match[1]); //获取第一个窗口的y坐标

				document.querySelector('#webamp div div').childNodes.forEach(elem => {
					
					 //x方向对齐
					 elem.style.transform = elem.style.transform.replace(/\([^,]+,/, '(' + '0px' + ','); //x坐标一律重置为0
					 
					//y方向对齐
					 var match = elem.style.transform.match(/, (.*?)px/);
					 var extractedNum = parseFloat(match[1]); //获取每个窗口的y坐标

					 var newNum = (extractedNum - initNum).toString()+'px'; //计算每个窗口新的y坐标
					 elem.style.transform = elem.style.transform .replace(/,(.*?\))/, ', ' + newNum + ')'); //执行更新y坐标
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
								console.log(`'transform' property changed to: ${mutation.target.style.transform}`);
								
								// Forcely clear transform to prevent webamp from shifting
								document.querySelector('#webamp div div').childNodes.forEach(elem => {
									console.log("被更新的tramsform"+elem.style.transform);
									elem.style.transform = "";
								})
							}
						}

						if (mutation.type === 'attributes' && mutation.attributeName === 'draggable') {
							console.log("球球别再下沉了");
						}
					}
				}

				// Create a MutationObserver to watch for changes in the DOM
				const observer = new MutationObserver(handleMutation);

				// Start observing the DOM
				observer.observe(document, { childList: true, subtree: true });

				observer.observe(document.querySelector('#webamp div div div'), { attributes: true, attributeFilter: ['style'] });

				observer.observe(document.querySelector('#webamp div div div'), { attributes: true, attributeFilter: ['draggable'] });

			}, 1000 );
		}
	} );
} );
