// break image open
// gridContainer.children[(parseInt(gridContainer.childElementCount/2))].style.setProperty(`margin-top`, 128 +`px`);

// probably could improbe performance by resizing gridContainer through JS, incrementing by 12 px
// instead of using the css transition on width
// pixels are only going to overflow into a new row when that row has gotten 12 px wider..

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

	let srcIndex = 17;
	async function handleRender() {
		let respObj;
		let description;
		await getImageCollection()
			.then(response => response.json())
			.then(response => respObj = response.collection.items);
		console.log(respObj);
		console.log("description:", respObj[srcIndex].data[0].description);
		console.log("description length:", respObj[srcIndex].data[0].description.length);	
		console.log("returned items: ", respObj.length);
		console.log("srcIndex: ", srcIndex);		

		img.src = `${respObj[srcIndex].links[0].href}` + '?' + new Date().getTime();
		imgDescription = respObj[srcIndex].data[0].description;

		document.querySelector('.gridContainer').style.setProperty('transition-property', 'none');
		document.documentElement.style.setProperty(
		`--gridContainerWidthLeft`, 0 + 'px');

		destroyDisplay();
		Main(imgDescription);
		srcIndex = respObj.length-1 > srcIndex ? srcIndex + 1 : 0;
	}

	const button = document.querySelector('button');
	button.addEventListener('click', handleRender);

	handleRender();



function Main(imgDescription) {
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

  // color the divs based on the values from the image
  const divDisplay = createDisplay(destroyedImg.length, gridContainer);
  console.log(gridContainer.childElementCount);

//********************************************************************
  
  sayHello(divDisplay, imgDescription.toUpperCase());
//********************************************************************
	
	document.querySelector('.gridContainer').style.setProperty('transition-property', 'width');	
	displayDraw1(divDisplay, destroyedImg);

	// set the height of the container so when items don't fit, we can hide them
	// with overflowy: hidden;	
	const gridContainerHeight = (2 + 4) * parseInt(targetHeight);
	document.documentElement.style.setProperty(
		`--gridContainerHeight`, gridContainerHeight + 'px');

	const gridContainerWidthLeft = 6 * targetWidth;
	document.documentElement.style.setProperty(
		`--gridContainerWidthLeft`, gridContainerWidthLeft + 'px');	
 };

 // =====================End Main Program ====================//
}


const width = 128;
const characterMaps = {
	'0' : [0, 1, 2, 3, 4, width, width+3, width+4, (width*2), (width*2)+2, (width*2)+4, (width*3), (width*3)+1, (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4], 
	'1': [],
	// '2': [], 
	// '3': [], 
	// '4': [], 
	// '5': [],
	// '6': [],      
	// '7': [],   
	'8': [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],   
	'9': [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3)+4, (width*4)+4],   	   
	' ': [],	
	A : [2, width+1, width+3, width*2, (width*2)+4, width*3, (width*3)+1, (width*3)+2, (width*3)+3,(width*3)+4, (width*4), (width*4)+4],
	B : [0,1,2,3, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, width*4, (width*4)+1, (width*4)+2, (width*4)+3],
	C : [0, 1, 2, 3, 4, width, (width*2), (width*3), (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	D : [0, 1, 2, 3, width, width+4, (width*2), (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4)+1, (width*4)+2, (width*4)+3],
	E : [0, 1, 2, 3, 4, width, (width*2), (width*2), (width*2)+1, (width*2)+2, (width*3), (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	F : [0, 1, 2, 3, 4, width, (width*2), (width*2), (width*2)+1, (width*2)+2, (width*3), (width*4), (width*4)],
	G : [0, 1, 2, 3, 4, width, (width*2), (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	H : [0, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4),(width*4)+4],
	I : [0, 1, 2, 3, 4, width+2, (width*2)+2, (width*3)+2, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	J : [width+4, width*3, (width*2)+4, (width*3)+4, (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	K : [0, 4, width, width+3, (width*2), (width*2)+1, (width*2)+2, (width*3), (width*3)+3, (width*4), (width*4),(width*4)+4],
	L : [0, width, (width*2), (width*3), (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	M : [0, 4, width, width+1, width+3, width+4, (width*2), (width*2)+2, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4),(width*4)+4],
	N : [0, 4, width, width+1, width+4, (width*2), (width*2)+2, (width*2)+4, (width*3), (width*3)+3, (width*3)+4, (width*4), (width*4),(width*4)+4],
	O : [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	P : [0,1,2,3, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), width*4],
	Q : [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4, (width*5)+2, (width*3)+2],
	R : [0,1,2,3, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, width*3, (width*3)+3, width*4, (width*4)+4],
	S : [0, 1, 2, 3, 4, width, (width*2), (width*2)+4, (width*2)+1, (width*2)+2, (width*2)+3, (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	T : [0, 1, 2, 3, 4, width+2, (width*2)+2, (width*3)+2, (width*4)+2],
	U : [0, 4, width, width+4, (width*2), (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
	V : [0, 4, width, width+4, (width*2), (width*2)+4, (width*3)+1, (width*3)+3, (width*4)+2],
	W : [0, 4, width, width+4, (width*2), (width*2)+4, width*3, (width*3)+1, (width*3)+3, (width*3)+4, (width*2)+2, width*4, (width*4)+4],
	X : [0, 4, width+1, width+3, (width*2)+2, (width*3)+1, (width*3)+3, (width*2)+2, width*4, (width*4)+4],
	Y : [0, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3)+2, (width*4)+2],
	Z : [0, 1, 2, 3, 4, width+3, (width*2)+2, (width*3)+1, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],
}

function sayHello(divDisplay, inputText) {
	let position = 129;
	let char;
	for (let i=0; i < inputText.length; i++) {
		char =`${inputText[i]}`;		
		if (characterMaps.hasOwnProperty(char)) {
			writeChar(characterMaps[char], divDisplay, position);	
		} else {
			writeChar(characterMaps[" "], divDisplay, position);	
		}
		
		if (position % 128 === 121) {
			position+= 648;
		} else {
			position+=6;	
		}
	}
}

function writeChar(charDefinitionArr, divDisplay, position) {	
	charDefinitionArr.forEach(charPixel => divDisplay[charPixel + position].classList.add('textPixel'))
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
		if (monoValue < 20) monoValue -= 20;
		if (monoValue < 200) monoValue -= 20;
		div.style=`background-color: rgba(
		${monoValue - modR - modG},
		${monoValue + (modR/2)},
		${monoValue - modG},
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
