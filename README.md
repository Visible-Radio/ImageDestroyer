# ImageDestroyer

When I took CS50 in 2020, I was fascinated by a series of projects related to iterating through information representing image data. My background in photography probably accounts for this fascination. Looping through image data made me feel close to the material of the image itself in a way that was familiar from my days spent in the darkroom and in photoshop.

In one CS50 project, we had to search for jpeg headers in a disk image to recover lost images. In another we implemented a series of filter algorithms which mutated image information pixel by pixel. Doing this in C was exciting due to all the trouble you can get into with pointers or otherwise accessing the wrong area in memory. It felt like being close to the materiality of the machine.

I wanted to try a similar project in Javascript. Image Destroyer reads pixel data from a canvas element, and renders a div element for every pixel. By constraining the divs in a flexible container, they form a grid, and when the width of this flexible container corresponds to the width of the original image, the 'div image' resolves. By manipulating this width, it is possible to scramble the image. The text is rendered in the same grid, by calculating from a string which divs should be assigned a special 'text pixel' class. Obviously this is not the most efficient way of rendering text or images, but I was excited by the visual effect of it.
