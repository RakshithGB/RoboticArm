var Leap = require('leapjs');
var five = require('johnny-five');
// Hardcoding PWM Values for servos for accuracy. These values were obtained through Trial and Error. These values will vary from each servo kind.
var tang = [900,910,920,933,945,956,966,976,986,1000,1010,1020,1030,1040,1050,1058,1068,1078,1090,1100,1110,1125,1135,1145,1156,1167,1177,1187,1197,1210,1222,1232,1242,1255,1265,1275,1285,1296,1307,1318,1330,1340,1350,1360,1373,1383,1393,1404,1414,1424,1434,1444,1456,1466,1478,1488,1498,1508,1520,1530,1543,1553,1563,1573,1585,1595,1605,1615,1625,1638,1648,1658,1670,1680,1691,1702,1712,1722,1734,1744,1754,1764,1774,1788,1798,1808,1818,1830,1840,1850,1860,1865,1878,1885,1893,1904,1915,1927,1938,1949,1956,1966,1976,1984,1994,2004,2014,2024,2034,2044,2054,2064,2074,2084,2094];

var board, servoBase, servoShoulder;
var baseAngle, shoulderAngle ,elbowAngle , palmAngle , clawAngle , pitchDegrees , yawAngle , yawDegrees;
var frames = [];
var PIN_BASE = 3;
var PIN_SHOULDER = 9;
var PIN_ELBOW = 6;
var PIN_PALM = 11;
var PIN_CLAW = 5;
var PIN_YAW = 10;
var MAX_Y = 415;
var MIN_Y = 0;
var MIN_Z = -250;
var MAX_Z = 0;
var armAngles;
var LENGTH1 = 195;
var LENGTH2 = 250;
var tempy;
var tempz;

var controller = new Leap.Controller();

controller.on('frame', function(frame)
{
  if(frame.hands.length > 0)
  {
    handPosition = frame.hands[0].palmPosition;
    var x =  150 - frame.hands[0].palmPosition[0];
    var z = 200 -  frame.hands[0].palmPosition[2];
    var y = frame.hands[0].palmPosition[1] - 100 ;
    baseAngle = calculatebaseAngle(x , z);
    tempy = y;
    tempz = z;
    armAngles = calculateInverseKinematics(y, z);
    shoulderAngle = armAngles.theta1;
    elbowAngle = armAngles.theta2;
    pitchDegrees = toDegrees(frame.hands[0].pitch());
    yawDegrees = toDegrees(frame.hands[0].roll());
    yawAngle = map(yawDegrees, -90 , 90 , 0 , 180);
    palmAngle = map(pitchDegrees , -40 , 40 , 0 , 114);
    clawAngle =map(100*(frame.hands[0].grabStrength) , 0 , 100  , 0 , 28);
  }
}
);

controller.on('connect', function(frame) {
  console.log("Leap Connected.");
  setTimeout(function() {
    var time = frames.length/2;
  }, 200);
});

controller.connect();
// Johnny-Five controller
board = new five.Board();
board.on('ready', function() {
  servoBase = new five.Servo(PIN_BASE);
  servoShoulder = this.pinMode(PIN_SHOULDER, five.Pin.SERVO);
  elbowShoulder = this.pinMode(PIN_ELBOW, five.Pin.SERVO);
  palmShoulder = this.pinMode(PIN_PALM, five.Pin.SERVO);
  clawShoulder = this.pinMode(PIN_CLAW, five.Pin.SERVO);
  yawShoulder = this.pinMode(PIN_YAW, five.Pin.SERVO);
  // Initial position of arm (As soon as power is supplied to the arm)
  servoBase.to(90);
  this.servoWrite(PIN_SHOULDER, tang[114]);
  this.servoWrite(PIN_ELBOW , tang[100]);
  this.servoWrite(PIN_PALM , tang [30]);
  this.servoWrite(PIN_YAW , tang [180]);
  this.servoWrite(PIN_CLAW , 10);

  this.loop(1, function() { //replaced 30 by 1 for delay
    if(!isNaN(elbowAngle) && !isNaN(shoulderAngle) ) {
      this.servoWrite(PIN_SHOULDER, tang[Math.floor(shoulderAngle)]);
      this.servoWrite(PIN_ELBOW, tang[Math.floor(elbowAngle)]);
    }
    else {
      //console.log("Shoulder in previous state.”);
    }
    if(!isNaN(palmAngle)){
      this.servoWrite(PIN_PALM, tang[Math.floor(palmAngle)]);
    }

    if(!isNaN(yawAngle)){
      this.servoWrite(PIN_YAW, Math.floor(yawAngle));
    }
    if(clawAngle >= 0 && clawAngle <= 180){
      this.servoWrite(PIN_CLAW, Math.floor(clawAngle));
    }
    if(baseAngle >= 0 && baseAngle <= 180) {
      servoBase.to(baseAngle);
    }
    console.log("Base: " + Math.floor(baseAngle) + "\telbow: " + Math.floor(elbowAngle) +  "\tshoulder: " + Math.floor(shoulderAngle)+ "\tpalm: " + Math.floor(palmAngle) +"\tyaw: " + Math.floor(yawAngle) +  "\tclaw: " + Math.floor(clawAngle) + "\ty: " + Math.floor(tempy) + "\tz: " + Math.floor(tempz) );
  });
});


function  map(x, in_min, in_max, out_min, out_max)
{
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function calculatebaseAngle(x , z){
  x = 150 -x;
  var angle = Math.tan(x/z);
  return 90 - toDegrees(angle);
}

function toDegrees(r){
  return r*57.2957795;
}

function calculateInverseKinematics(y , z){
  var hypotenuse = Math.sqrt(square(y)+square(z));
  var a = Math.atan(y/z);
  var b = Math.acos((square(LENGTH1)+square(hypotenuse)-square(LENGTH2))/(2*LENGTH1*hypotenuse));
  var theta1 = toDegrees(a+b);
  var c = Math.acos((square(LENGTH2)+square(LENGTH1)-square(hypotenuse))/(2*LENGTH1*LENGTH2));
  var theta2 = 180 - toDegrees(c);

  return {
    theta1: theta1,
    theta2: theta2
  }
}

function distance(x1,y1,z1,x2,y2,z2) {
  return Math.sqrt(square(x2-x1)+square(y2-y1)+square(z2-z1));
}

function square(x) {
  return x*x;
}
