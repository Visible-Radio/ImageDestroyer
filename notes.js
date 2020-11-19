
// ==================================================================================
// function that iterates over the entire divDisplay again to apply mods
// trying to separate mod function from basic translation of image from imageData array to divDisplay.  
// Nice in that this would make for a clean separation of the functions, but it means iterating over the entire divDisplay again

function patternMods(divDisplay) {	
	divDisplay.forEach((div,i) => {
		if (i > 0) return;		
		const currentDivColor = div.style.backgroundColor;
		// use string wrangling to get the channel values and modify them
		console.log(currentDivColor);				
	});
}
// ==================================================================================

// ORIGINAL displayDraw function with hard coded mods
// color each div with the color value from the manipulated image array
// could apply tinting here as each color channel gets written
// should pull these mods out into another function
// also consider how to make them respond to the content of the image
// at the moment they are static patterns 
function displayDraw(divDisplay, destroyedImg) {
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