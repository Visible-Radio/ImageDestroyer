// break image open
// gridContainer.children[(parseInt(gridContainer.childElementCount/2))].style.setProperty(`margin-top`, 128 +`px`);

//========================API NOTES==========================//

// GET https://images-api.nasa.gov
// GET /search?q={q}
// &media_type=image specifies images only
// &year_end=1991 specifies newest date
// search?q=station specifies search string, in this case "station"

//=============Availavle in the response object==============//
// respObj.collection.items[0].links[0].href; // this is a thumbnail
// respObj.collection.items[0].data[0].description;
// respObj.collection.items[0].data[0].title;
// respObj.collection.items[0].data[0].location;
// respObj.collection.items[0].data[0].date_created;
// respObj.collection.items[0].href;
//===========================================================//

// (async () => {
//======================GET THE SOURCE IMAGE=================//	
const img = new Image();
// canvass doesn't like cross origin content
// setting this prevents some errors
img.setAttribute('crossOrigin', '');

	async function getImageCollection() {
		try {	
				return await fetch(
					"https://images-api.nasa.gov/search?q=station&media_type=image&year_end=1991")		
		} catch(e) {
				// API request failed, use local fallback
				console.log("Caught this error:", e);
				return e;	
		}
	}

	let srcIndex = 16;
	async function handleRender() {
		let respObj;	
		await getImageCollection().then(response => response.json()).then(response => respObj = response.collection.items);
		console.log(respObj.length);
		console.log(srcIndex);
		console.log(respObj[srcIndex].links[0].href);
		img.src = `${respObj[srcIndex].links[0].href}` + '?' + new Date().getTime();
		document.querySelector('.gridContainer').style.setProperty('transition-property', 'none');
		document.documentElement.style.setProperty(
		`--gridContainerWidthLeft`, 0 + 'px');

		destroyDisplay();
		Main();
		srcIndex = respObj.length-1 > srcIndex ? srcIndex + 1 : 0;
	}
	handleRender();



function Main() {
// ======================== Main Program ====================//
img.onload = function() {
	// get the canvas context
	const ctx = document.getElementById('canvas').getContext('2d');
	// set up the final output width of the destroyed image
	// keep image aspect ratio intact
	const targetWidth = 128; 
	const scaleFactor = img.width / targetWidth;
	const targetHeight = img.height / scaleFactor; 

	// input scaling happens here based on second pair of args
	// this draws the image onto the canvas, which is hidden using CSS
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	// retrieve the pixel data from the canvas
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // run the functions that reduce the bit depth and convert to grayscale  
  const destroyedImg = destroyImg(imageData);

  // for each pixel create a div
  const gridContainer = document.querySelector('.gridContainer');
  const divDisplay = createDisplay(destroyedImg.length, gridContainer);
  console.log(gridContainer.childElementCount);

	// color the divs based on the values from the image
	document.querySelector('.gridContainer').style.setProperty('transition-property', 'width');	
	displayDraw1(divDisplay, destroyedImg);

	// set the height of the container so when items don't fit, we can hide them
	// with overflowy: hidden;	
	const gridContainerHeight = (4 + 8) * parseInt(targetHeight);
	document.documentElement.style.setProperty(
		`--gridContainerHeight`, gridContainerHeight + 'px');

	const gridContainerWidthLeft = 12 * targetWidth;
	document.documentElement.style.setProperty(
		`--gridContainerWidthLeft`, gridContainerWidthLeft + 'px');	
 };

 // =====================End Main Program ====================//
}

function destroyDisplay() {
	document.querySelectorAll('.bigPixel').forEach(node => node.remove());
}

function bitReduce(channel) {
	// each pixel channel value gets mapped to a smaller gamut
	return parseInt((channel / 255) * 127)*2;
}

function bitReduceChannels(channels) {
	// reduce the bit depth of the image
	return channels.map(channel => bitReduce(channel));
}

function avgChannels(channels) {
	// simple grayscale conversion by averaging
	return parseInt(channels.reduce((acc, channel) => acc += channel, 0) /3);	
}

function destroyImg(imageData) {
	// iterate over the pixel data from the canvas	
	let destroyedImg = [];	
	for (let i=0; i < imageData.data.length; i+=4) {
	// pass each RGB triplet to bitReduceChannels
	const channels = bitReduceChannels([
		imageData.data[i],
		imageData.data[i+1],
		imageData.data[i+2]
		]);
	// pass each RGB triplet to avgChannels and append to new array
		destroyedImg.push(avgChannels(channels));
	}
	return destroyedImg;
}

// build the display grid
function createDisplay(imgArrLength, gridContainer) {
	for (let i = 0; i < imgArrLength; i++) {		
		let div = document.createElement('div');
		gridContainer.appendChild(div);
		div.classList.add('bigPixel');		
	}
	return Array.from(gridContainer.children);
}

// Manipulate CSS variables to scale the divs
function scaleDivs(divScale = 1){
	const cssVars = {
		divScale: divScale,
		gridContainerWidth: 1536 * divScale,
		bigPixelWidth: 12 * divScale,
		bigPixelHeight: 4 * divScale,
		interlaceWidth: 8 * divScale,
	}	
	document.documentElement.style.setProperty(
		`--gridContainerWidth`,
		cssVars.gridContainerWidth + 'px');
	document.documentElement.style.setProperty(
		`--bigPixelWidth`,
		cssVars.bigPixelWidth + 'px');
	document.documentElement.style.setProperty(
		`--bigPixelHeight`,
		cssVars.bigPixelHeight + 'px');
	document.documentElement.style.setProperty(
		`--interlaceWidth`,
		cssVars.interlaceWidth + 'px ' + 'solid #141a2b');

	return cssVars;
}

//========================Drawing Functions==============================//

function displayDraw1(divDisplay, destroyedImg) {
	let modR = 0;
	let modG = 0;
	let modB = 0;
	const rand1 = rndNum(15);		
	const rand2 = rndNum(15);		
	divDisplay.forEach((div,i) => {
		let monoValue = destroyedImg[i];
		
		if (monoValue % (rand1 * 5) === 0
			|| monoValue % (rand1 * 3) === 0 ) modR = rndNum(100);
		if (monoValue % (rand2 * 3) === 0 ) modG = -rndNum(100);
		if (monoValue < 30) monoValue -= 20;
		div.style=`background-color: rgba(
		${monoValue + modR - modG},
		${monoValue - (modR/2)},
		${monoValue + modG},
		1);`
		modR-=5;
		modG+=15;
		if (modR <= -55 || modR >= 150) modR = 0;
		if (modG >= 100 || modG <= -100) modG = 0;
		
	});
}

function rndNum(limit) {
	return Math.round(Math.random()*limit);	
}
//======================END OF DRAWING FUNCTIONS==============================//
 // })();
