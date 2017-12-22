var mySound, myPhrase, myPart;
var pattern = [1,1,1,2,1,2,1,1];

var mic, recorder, soundFile;
var fft;

var canvas, guiBeats, guiPitch;
var recording = false;
var beat1=true,beat2=false,beat3=false,beat4=true,beat5=false,beat6=false,beat7=true,beat8=false;
var pitch1=1,pitch2=0,pitch3=0,pitch4=1,pitch5=0,pitch6=1,pitch7=0,pitch8=0;
// var pitch1Max=4,pitch2Max=4,pitch3Max=4,pitch4Max=4,pitch5Max=4,pitch6Max=4,pitch7Max=4,pitch8Max=4;

function preload() {
  mySound = loadSound('assets/beatbox.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed( function() {
    if (mic.enabled) {
      recording = true;
      soundFile = new p5.SoundFile();
      recorder.record(soundFile);    
    }
  });

  canvas.mouseReleased( function() {
    recording = false;
    recorder.stop();
    mySound = soundFile;
  });

  mic = new p5.AudioIn();
  mic.start();
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  masterVolume(0.5);

  var myPattern = [ pitch1*beat1,
    pitch2 * beat2,
    pitch3 * beat3,
    pitch4 * beat4,
    pitch5 * beat5,
    pitch6 * beat6,
    pitch7 * beat7,
    pitch8 * beat8];
  myPhrase = new p5.Phrase('bbox', makeSound, myPattern);
  myPart = new p5.Part();
  myPart.addPhrase(myPhrase);
  myPart.setBPM(60);
  myPart.loop();

  fft = new p5.FFT();

  guiBeats = createGui('BEATS');
  guiBeats.addGlobals('beat1','beat2','beat3','beat4','beat5','beat6','beat7','beat8');
  guiBeats.show();

  guiPitch = createGui('PITCH');
  sliderRange(0,4);
  guiPitch.addGlobals('pitch1','pitch2','pitch3','pitch4','pitch5','pitch6','pitch7','pitch8');
  // guiPitch.show();
}

function draw() {
  if (recording) background(200,0,0);
  else background(0);

  // update pattern
  var curPattern = [ pitch1*beat1,
    pitch2 * beat2,
    pitch3 * beat3,
    pitch4 * beat4,
    pitch5 * beat5,
    pitch6 * beat6,
    pitch7 * beat7,
    pitch8 * beat8];
  myPart.getPhrase('bbox').sequence = curPattern;

  var spectrum = fft.analyze();
  var octaveBands = fft.getOctaveBands(6);
  var logAverages = fft.logAverages(octaveBands);
  noStroke();
  fill(0,255,0); 
  for (var i = 0; i< logAverages.length; i++){
    var x = map(i, 0, logAverages.length, 0, width);
    var h = -height + map(logAverages[i], 0, 255, height, 0);
    rect(x, height, width / logAverages.length, h )
  }
  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(2);
  for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
}

function makeSound(time, playbackRate) {
  mySound.rate(playbackRate);
  mySound.play(time);
}

function keyPressed() {
  // myPart.loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}