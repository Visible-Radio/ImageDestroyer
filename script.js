// create a pixel display of divs
// style them like they are LEDs or some lo-fi display tech

// take an input image
// convert it to grayscale
// downsample it to fit in our archaic display
// target resolution is 128px wide

// reduce the gamut - ie, only 64 discrete values
// control colors etc in css 

const ctx = document.getElementById('canvas').getContext('2d');
const img = new Image();
img.src = 'cosmonaut.jpg';
img.onload = function() {
	ctx.drawImage(img, 0, 0, 128, 97); // image, x, y, width, height
  const imageData = ctx.getImageData(0, 0, 128, 97);
  destroyedImg = destroyImg(imageData); // ARRAY CREATED AS SIDE EFFECT
  createDisplay(destroyedImg.length);
	divDisplay = Array.from(gridContainer.children);
	// displayDraw(divDisplay, destroyedImg);
	
	timerId = setInterval(slowDraw, 50, divDisplay, destroyedImg, counter);
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
	const channels = bitReduceChannels([imageData.data[i], imageData.data[i+1], imageData.data[i+2]]);
	destroyedImg.push(avgChannels(channels));
	}
	return destroyedImg;
}


// 128 x 97 div grid

const gridContainer = document.querySelector('.gridContainer');

function createDisplay(imgArrLength) {
	for (let i = 0; i < imgArrLength; i++) {		
		let div = document.createElement('div');
		gridContainer.appendChild(div);
		div.classList.add('bigPixel');		
	}		
}

function displayDraw(divDisplay, destroyedImg) {
	divDisplay.forEach((div,i) => {
		div.style=`background-color: rgba(${destroyedImg[i]}, ${destroyedImg[i]}, ${destroyedImg[i]}, 1);`	
	});
}

let counter = 0;
function slowDraw(divDisplay, destroyedImg, drawIndex){
	for (let i = 0; i < 150; i++) {
		counter++;
		divDisplay[counter].style = `background-color: rgba(${destroyedImg[counter]}, ${destroyedImg[counter]}, ${destroyedImg[counter]}, 1);`
		if (counter === destroyedImg.length-1) {
			clearInterval(timerId);
			return;		
		}
	}
	
	
}


// challenges
// use setInterval to slow down the process of coloring the divs

// handling for images of different dimensions
// handling for different images period...

// scale the image down more
// 128 wide looks pretty good

// tint the grayscale

// grab images from somewhere automatically
	// something Dr. Strangelove related => "world targets in megadeaths"

// exportale HTML => image to HTML/CSS

// process video...on the fly? make gnarly looking video?

//clean this dang code up


