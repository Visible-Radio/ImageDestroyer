// support for different size images
// always 128 wide, but scale height appropriately 

const img = new Image();
img.src = './images/spaceman.jpg';

img.onload = function() {
	// get the canvas context
	const ctx = document.getElementById('canvas').getContext('2d');
	const targetWidth = 128;
	const scaleFactor = img.width / 128;
	const targetHeight = img.height / scaleFactor;

	// input scaling happens here based on second pair of args
	// this draws the image onto the canvas, which is hidden using CSS
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	// retrieve the pixel data from the canvas
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // run the functions that reduce the bit depth and convert to grayscale  
  const destroyedImg = destroyImg(imageData);

  // for each pixel create a div
  const divDisplay = createDisplay(destroyedImg.length);
	
	// color the divs based on the values from the image
	// call displayDrawMono for monocrhome image
	displayDraw1(divDisplay, destroyedImg);

	// change the output size of the resultant image	
	// scaleDivs(2);

	

	console.log('Scale factor: ', scaleFactor);
  console.log('Target width constant : ', targetWidth);
  console.log('Target height calc: ', targetHeight);
  console.log(imageData);	
 };


function bitReduce(channel) {
	return parseInt((channel / 255) * 127)*2;
}

function bitReduceChannels(channels) {
	return channels.map(channel => bitReduce(channel));
}

function avgChannels(channels) {
	return parseInt(channels.reduce((acc, channel) => acc += channel, 0) /3);	
}

function destroyImg(imageData) {
	let destroyedImg = [];
	for (let i=0; i < imageData.data.length; i+=4) {
	const channels = bitReduceChannels([
		imageData.data[i],
		imageData.data[i+1],
		imageData.data[i+2]
		]);
		destroyedImg.push(avgChannels(channels));
	}
	return destroyedImg;
}

// build the display grid
const gridContainer = document.querySelector('.gridContainer');
function createDisplay(imgArrLength) {
	for (let i = 0; i < imgArrLength; i++) {		
		let div = document.createElement('div');
		gridContainer.appendChild(div);
		div.classList.add('bigPixel');		
	}
	return Array.from(gridContainer.children);
}

// Manipulate CSS variables to scale the divs
function scaleDivs(divScale = 1, warpOffset = 0){		
	const gridContainerWidth = 768 * divScale + warpOffset;
	const bigPixelWidth = 6 * divScale;
	const bigPixelHeight = 2 * divScale;
	const interlaceWidth = 4 * divScale;
	document.documentElement.style.setProperty(
		`--gridContainerWidth`,
		gridContainerWidth + 'px');
	document.documentElement.style.setProperty(
		`--bigPixelWidth`,
		bigPixelWidth + 'px');
	document.documentElement.style.setProperty(
		`--bigPixelHeight`,
		bigPixelHeight + 'px');
	document.documentElement.style.setProperty(
		`--interlaceWidth`,
		interlaceWidth + 'px ' + 'solid #141a2b');
}

//========================Various Drawing Functions==============================//
//displayDrawMono produces grayscale image
//displayDraw0 produces a very nice, but static pattern on the imgage
//display Draw1 produces randomized artifacts in the image

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

function displayDraw0(divDisplay, destroyedImg) {
	let modR = 0;
	let modG = 0;
	let modB = 0;	
	divDisplay.forEach((div,i) => {
		const monoValue = destroyedImg[i];
		if (i % 101 === 0 ) modR = 255;
		if (i % 86 === 0 ) modG = -100;
		div.style=`background-color: rgba(
		${monoValue + modR - modG},
		${monoValue - (modR/2)},
		${monoValue + modG},
		1);`
		modR-=30;
		modG+=10;
		if (modR <= -55) modR = 0;
		if (modG >= 100) modG = 0;
		
	});
}

function displayDrawMono(divDisplay, destroyedImg) {
	divDisplay.forEach((div,i) => {
		const monoValue = destroyedImg[i];		
		div.style=`background-color: rgba(
		${monoValue},
		${monoValue},
		${monoValue},
		1);`		
	});
}

function rndNum(limit) {
	return Math.round(Math.random()*limit);	
}
//======================END OF DRAWING FUNCTIONS==============================//
