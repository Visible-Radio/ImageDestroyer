//TODOS

// Address responsive design issues.  Scaling elements is going to cause trouble since the script 
// manipulates CSS variables in some places, applying pixel units

// need to handle portrait oriented images somehow
// maybe if the vertical dimension is more than 128px, crop it in the canvas

//======================SHOW/HIDE description=================//
// this is all in global scope right now
infoVisible = true;
const gridContainer = document.querySelector('.gridContainer');
const infoButton = document.querySelector('.info');
const downArrow = document.querySelector('.downArrow');
const upArrow = document.querySelector('.upArrow');
let imgData;
let destroyedImg;
let divDisplay;

let textPixels = [];
infoButton.addEventListener('click', () => {
	if (infoVisible) {
		textPixels = Array.from(document.querySelectorAll('.textPixel'));
		textPixels.forEach(textPixel => textPixel.classList.remove('textPixelOn'));
		infoVisible = false;
		downArrow.disabled = true;	
		upArrow.disabled = true;
		displayDrawNormal();	

	} else {		
		textPixels = Array.from(document.querySelectorAll('.textPixel'));
		console.log(textPixels);
		textPixels.forEach(textPixel => textPixel.classList.add('textPixelOn'));
		infoVisible = true;
		downArrow.disabled = false;	
		upArrow.disabled = false;
		displayDrawLowContrast();

	}	
});

//======================GET THE SOURCE IMAGE=================//
const img = new Image();
// canvass doesn't like cross origin content
// setting this prevents some errors
img.setAttribute('crossOrigin', '');

	async function getImageCollection() {
		try {	
				return await fetch(
					"https://images-api.nasa.gov/search?q=moon&media_type=image&year_end=1991")		
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
		
		img.src = `${respObj[srcIndex].links[0].href}` + '?' + new Date().getTime();
		imgDescription = respObj[srcIndex].data[0].description;		

		destroyDisplay();

		setTimeout(() => {
			gridContainer.style.setProperty('transition-property', 'none');
			document.documentElement.style.setProperty(
			`--gridContainerWidthLeft`, 0 + 'px');
		},100);

		Main(imgDescription);
		srcIndex = respObj.length-1 > srcIndex ? srcIndex + 1 : 0;
	}

	const button = document.querySelector('button');
	button.addEventListener('click', handleRender);

	handleRender();


// ======================== Main Program ====================//
function Main(imgDescription) {

img.onload = function() {
	// get the canvas context
	const ctx = document.getElementById('canvas').getContext('2d');
	// set up the final output width of the destroyed image
	// keep image aspect ratio intact
	const targetWidth = 128; // lots of things are now hard coded around this value...
	const scaleFactor = img.width / targetWidth;
	const targetHeight = img.height / scaleFactor; 

	// input scaling happens here based on second pair of args
	// this draws the image onto the canvas, which is hidden using CSS
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	// retrieve the pixel data from the canvas
  imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // run the functions that reduce the bit depth and convert to grayscale  
  destroyedImg = destroyImg();  

  // for each pixel create a div
  divDisplay = createDisplay(destroyedImg.length);
  console.log("div grid count: ", gridContainer.childElementCount);

//**************************TEXT HANDLING*****************************
	handleInfo(imgDescription.toUpperCase(), divDisplay);	
//********************************************************************
	
	// re-assign the width transition property so the flex box will slowly get bigger
	gridContainer.style.setProperty('transition-property', 'width');

	// color the divs based on the values from the image
	displayDrawLowContrast();

	// set the height of the container so when items don't fit, we can hide them
	// with overflowy: hidden;	
	const gridContainerHeight = (2 + 4) * parseInt(targetHeight);
	document.documentElement.style.setProperty(
		`--gridContainerHeight`, gridContainerHeight + 'px');

	// reset the width of the grid container for the 'loading' animation
	setTimeout(()=> {
		const gridContainerWidthLeft = 6 * targetWidth;
		document.documentElement.style.setProperty(
			`--gridContainerWidthLeft`, gridContainerWidthLeft + 'px');	

	},100);
 // =====================End Main Program ====================//
}//img.onload()
}//MAIN()


const width = 128;
const characterMaps = {
	'0' : [0, 1, 2, 3, 4, width, width+3, width+4, (width*2), (width*2)+2, (width*2)+4, (width*3), (width*3)+1, (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4], 
	'1': [1, 2, width+2, (width*2)+2, (width*3)+2, (width*4)+1, (width*4)+2, (width*4)+3],
	'2': [0, 1, 2, 3, 4, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4], 
	'3': [0, 1, 2, 3, 4, width+4, (width*2)+2, (width*2)+3, (width*2)+4, (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4], 
	'4': [0, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3)+4, (width*4)+4], 
	'5': [0, 1, 2, 3, 4, width, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*3)+3, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3],
	'6': [0, 1, 2, 3, 4, width, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],      
	'7': [0, 1, 2, 3, 4, width+4, (width*2)+4, (width*3)+4, (width*4)+4],
	'8': [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3), (width*3)+4, (width*4), (width*4), (width*4)+1, (width*4)+2, (width*4)+3, (width*4)+4],   
	'9': [0, 1, 2, 3, 4, width, width+4, (width*2), (width*2)+1, (width*2)+2, (width*2)+3, (width*2)+4, (width*3)+4, (width*4)+4],
	' ': [],
	'.': [width*4+1],
	',': [width*4+1, (width*5)+1],
	"'": [1, width+1],
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

function handleInfo(preSlicedText, divDisplay) {

	const verticalChars = parseInt(divDisplay.length/128/6);
	const horizontalChars = parseInt(128/6);
	const charsPerPage = horizontalChars*verticalChars;
	
	let pagesArr = [];
	let slice;
	let charsRemaining;
	let currentPage = 0;	

	for (let i=0; i < preSlicedText.length; i += charsPerPage) {		
			slice = preSlicedText.slice(i, charsPerPage+i);			
			pagesArr.push(slice);
	}		

	printPage(divDisplay, pagesArr[currentPage]);

	updateButtonStatus(downArrow, upArrow, currentPage, pagesArr);

	downArrow.addEventListener('click', () => {
		clearPage();
		if (pagesArr[currentPage+1]) currentPage++;
		printPage(divDisplay, pagesArr[currentPage]);
		updateButtonStatus(downArrow,upArrow, currentPage, pagesArr);					
	});

	upArrow.addEventListener('click', () => {
		clearPage();
		if (pagesArr[currentPage-1]) currentPage--;			
		printPage(divDisplay, pagesArr[currentPage]);
		updateButtonStatus(downArrow,upArrow, currentPage, pagesArr);						
	});

}

function printPage(divDisplay, inputText) {	

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


function clearPage() {
	Array.from(document.querySelectorAll('.textPixel')).forEach(textPixel => textPixel.classList.remove('textPixel', 'textPixelOn'));
}

function writeChar(charDefinitionArr, divDisplay, position) {	
	charDefinitionArr.forEach(charPixel => divDisplay[charPixel + position].classList.add('textPixel', 'textPixelOn'));
	infoVisible = true;	
}

function updateButtonStatus(downArrow, upArrow, currentPage, pagesArr){
	downArrow.disabled = pagesArr[currentPage+1]===undefined ? true : false	
	upArrow.disabled = pagesArr[currentPage-1]===undefined ? true : false;	
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

function destroyImg() {
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
function createDisplay(imgArrLength) {
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
		gridContainerWidth: 768 * divScale,
		bigPixelWidth: 6 * divScale,
		bigPixelHeight: 2 * divScale,
		interlaceWidth: 4 * divScale,
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

function displayDrawNormal() {
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
		div.style=`background-color: rgba(
		${(monoValue - modR - modG)},
		${(monoValue + (modR/2))},
		${(monoValue - modG)},
		1);`
		modR-=5;
		modG+=15;
		if (modR <= -55 || modR >= 150) modR = 0;
		if (modG >= 100 || modG <= -100) modG = 0;		
		
	});
}

function displayDrawLowContrast() {
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
		div.style=`background-color: rgba(
		${(monoValue - modR - modG)/2},
		${(monoValue + (modR/2))/2},
		${(monoValue - modG)/2},
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


