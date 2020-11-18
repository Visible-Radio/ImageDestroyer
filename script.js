// support for different size images
// always 128 wide, but scale height appropriately 

const img = new Image();
img.src = './images/cosmonaut.jpg';

img.onload = function() {
	// get the canvas context
	const ctx = document.getElementById('canvas').getContext('2d');
	const targetWidth = 128;
	const scaleFactor = img.width / 128;
	const targetHeight = img.height / scaleFactor;

	// scaling happens here based on second pair of args
	// this draws the image onto the canvas, which is hidden using CSS
	ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

	// retrieve the pixel data from the canvas
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // run the functions that reduce the bit depth and convert to grayscale  
  const destroyedImg = destroyImg(imageData);

  // for each pixel create a div
  const divDisplay = createDisplay(destroyedImg.length);
	
	// color the divs based on the values from the image
	displayDraw(divDisplay, destroyedImg);

	// change the output size of the resultant image	
	scaleDivs(2.5);

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

// color each div with the color value from the manipulated image array
// could apply tinting here as each color channel gets written
function displayDraw(divDisplay, destroyedImg) {
	divDisplay.forEach((div,i) => {
		div.style=`background-color: rgba(
		${destroyedImg[i]},
		${destroyedImg[i]},
		${destroyedImg[i]},
		1);`	
	});
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






