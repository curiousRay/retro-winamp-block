import butterchurnPresets from 'butterchurn-presets';
import { useSelect } from '@wordpress/data';
export const milkdropOptions = {
	__butterchurnOptions: {
		butterchurnOpen: true,
		importButterchurn: () => import( 'butterchurn' ),
		getPresets: () => {
			const presets = butterchurnPresets.getPresets();

			return Object.keys( presets ).map( ( name ) => {
				return {
					name,
					butterchurnPresetObject: presets[ name ],
				};
			} );
		},
	},
	__initialWindowLayout: {
		main: { position: { x: 0, y: 0 } },
		equalizer: { position: { x: 0, y: 116 } },
		playlist: { position: { x: 0, y: 232 }, size: [ 0, 1 ] },
		milkdrop: { position: { x: 275, y: 0 }, size: [ 7, 9 ] },
	},
};


//const currentPosEqu = container.dataset.currentPosEqu || "1";


//const block = document.querySelector(".wp-block-tenup-winamp-block")


//var posEqu = block.getAttribute("data-posEqu");
//var posList = block.getAttribute("data-posList");
//var posMilkdrop = block.getAttribute("data-posMilkdrop");

// todo: 如果在插件配置选择Equ为隐藏，则最终显示的插件仍然有Equ===使用css隐藏掉.

const block = document.querySelector( '.wp-block-tenup-winamp-block' );


var posEqu = document.querySelector(".wp-block-tenup-winamp-block")?.dataset.posequ || "1";
var posList = document.querySelector(".wp-block-tenup-winamp-block")?.dataset.poslist || "2";
var posMilkdrop = document.querySelector(".wp-block-tenup-winamp-block")?.dataset.posmilkdrop || "3";


console.log("posEqu: "+posEqu);
console.log("posList: "+posList);
console.log("posMilkdrop: "+posMilkdrop);

// 开始构建变量
var options = {};
options.main = { position: { x: 0, y: 0 } }; // main windows is forcely displayed
var y_anchor = 116;

//milkdropOptions.__initialWindowLayout.main.position = {x: 10, y: 10};

let res_text = [];
let mat = [[0,0,0], [0,0,0], [0,0,0]];
if (posEqu != 0) { mat[0][posEqu - 1] = 1; } else { options.equalizer = {}; }
if (posList != 0) { mat[1][posList - 1] = 1; } else { options.playlist = {}; }
if (posMilkdrop != 0) { mat[2][posMilkdrop - 1] = 1; } else { options.milkdrop = {}; }

for (let col = 0; col < 3; col++) {
	for (let row = 0; row < 3; row++) {
		if (mat[row][col] == 1 ) {
			switch (row + 1) {
				case 1: res_text.push("Equ");break;
				case 2: res_text.push("List");break;
				case 3: res_text.push("Milkdrop");break;
			}
		}
	}
}

console.log(res_text);

if (block) {
	if (block.closest(".widget")) {
	// is a webAmp block in sidebar widget
	console.log("位于侧边栏");
	res_text.forEach((window_name) => {
		switch (window_name) {
			case "Equ":
				options.equalizer = { position: { x: 0, y: y_anchor } };
				y_anchor += 116;
				break;
			case "List":
				options.playlist = { position: { x: 0, y: y_anchor }, size: [ 0, 1 ] };
				y_anchor += 144;
				break;
			case "Milkdrop":
				options.milkdrop = { position: { x: 0, y: y_anchor }, size: [ 0, 4 ] };
				y_anchor += 232;
				break;
		}
	});
	} else {
		// is a webAmp block in Post/Page
		console.log("位于文章页面内");
		res_text.forEach((window_name) => {
			switch (window_name) {
				case "Equ":
					options.equalizer = { position: { x: 0, y: y_anchor } };
					y_anchor += 116;
					console.log("TEST")
					break;
				case "List":
					options.playlist = { position: { x: 0, y: y_anchor }, size: [ 0, 1 ] };
					y_anchor += 144;
					console.log("TEST")
					break;
				case "Milkdrop":
					options.milkdrop = { position: { x: 275, y: 0 }, size: [ 0, 1 ] };
					// 仅equ---size:[0,4]
					// 仅list---size:[]
					// equ&list---size:[5,9]
					// none---size:[]
					y_anchor += 0;
					console.log("TEST")
					break;
			}
		});

	}
	
}
console.log(options)
milkdropOptions.__initialWindowLayout = options;

export default milkdropOptions;
