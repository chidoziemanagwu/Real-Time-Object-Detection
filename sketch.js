let video;
let detector;
let detections;

function setup() {
	//INITIATE THE CREATE CANVAS FUNCTION AND DEFINE THE WIDTH AND HEIGHT FOR THE CANVAS
	createCanvas(windowWidth, 360)
	// DEFINE THE BACKGROUND COLOR TO BE DISPLAYED WHILE THE VIDEO FEATURE IS YET TO BE INITIATED
	background(200);
	//SET THE FRAMERATE FOR THE VIDEO
	frameRate(60); // Attempt to refresh at starting FPS

	//DEFINE CONSTRAINTS FOR THE VIDEO ELEMENT WHEN INITIATED 
	var constraints = {
		audio: false,
		video: {
			facingMode: {
				exact: "environment"
			}
		}
		//video: {
		//facingMode: "user"
		//} 
	};

	//VARIABLE TO CONTAIN THE CAPTURED SEGMENTS FROM THE MOBILE CAMERA
	video = createCapture(constraints);
	video.size(width, height);
	video.hide();

	//SET THE PREFERRED MACHINE LEARNING MODEL FOR OBJECT DETECTION WHICH WILL BE CALLED ONLY WHEN THE MODEL IS FULLY LOADED INTO THE WEB APPLICATION
	detector = ml5.objectDetector('cocossd', modelReady)
}


function modelReady() {
	console.log('model loaded')
	detect();
}

function detect() {
	detector.detect(video, gotResults);
}

function gotResults(err, results) {
	if (err) {
		console.log(err);
		return
	}

	detections = results;

	detect();
}

function draw() {
	image(video, 0, 0, width, height);

	if (detections) {
		detections.forEach(detection => {
			noStroke();
			fill(0, 0, 255);
			strokeWeight(2);
			text(`${detection.label.toUpperCase()} (${(detection.confidence * 100).toFixed(2)}%)`, detection.x + 10, detection.y + 20)

			noFill();
			strokeWeight(3);
			if (detection.label === 'bottle') {
				stroke(0, 255, 0);
			} else {
				stroke(0, 0, 255);
			}
			rect(detection.x, detection.y, detection.width, detection.height);
		})
	}
}