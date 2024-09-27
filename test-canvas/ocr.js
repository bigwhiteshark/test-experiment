import * as ocr from '@paddlejs-models/ocr';

// Model initialization
await ocr.init();

// Get the text recognition result API, img is the user's upload picture, and option is an optional parameter
// option.canvas as HTMLElementCanvas：if the user needs to draw the selected area of the text box, pass in the canvas element
// option.style as object：if the user needs to configure the canvas style, pass in the style object
// option.style.strokeStyle as string：select a color for the text box
// option.style.lineWidth as number：width of selected line segment in text box
// option.style.fillStyle as string：select the fill color for the text box
const res = await ocr.recognize(img, option ?);
// character recognition results
console.log(res.text);
// text area points
console.log(res.points);