# Robotic Arm
## Overview
A robotic arm was designed using Turnigy Digital Servos. It is an articulated robotic arm that has 5DOF. An articulated robotic arm is an arm with rotary joints that uses actuators.

The code is written in Node.js using the Johny Five Library and Arduino.

## Demo
![DEMO](/Images/RoboticArm_Demo.gif?raw=true "Optional Title")

1. [YouTube Link Demo 1](https://www.youtube.com/watch?v=Rbl2ym7H7-E)
2. [YouTube Link Demo 2](https://youtu.be/sUQKA8lwDa0)

## Specifications
* Lengths
  * Base to Elbow(L1) : 25cm
  * Elbow to Wrist(L2) : 32cm
  * Wrist to Actuator(L3): 10cm

* Weigts:
  * Base to Elbow: 102gm
  * Elbow to Wrist: 85gm
  * Wrist to Actuator: 26gm
  * Servo: 70gm each

* Degrees of Freedom: 5
* Hardware Interfacing: USB
* Base Spin: 114 &#176;
* Shoulder Pitch: 114 &#176;
* Elbow Pitch: 114 &#176;
* Wrist Pitch: 114 &#176;

## Components Used
1. Arduino Mega
2. Turnigy Servos
3. Leap Motion Sensor
4. Power Supply for servos
5. Gripper
6. Metal Rods for bodywork

## Intallations
leapjs:
```sh
npm install leapjs
```
johnny-five (macOS only):
```sh
npm install -g node-gyp
```
[Installation steps for all operating system](https://github.com/rwaldron/johnny-five/wiki/Getting-Started)

## Usage
1. For Leap Motion control, first upload and run the Firmata Code on the arduino board. Execute the LeapInverseKinematics.js file from terminal. Please install leapjs and johnny-five library for NodeJS before executing.
2. For shape drawing tasks, upload the Shapes_Sketch.ino and comment out the shape which is not needed.

## Model
![Model](/Images/RoboticArm.jpg?raw=true "Optional Title")

## References
1. [Johnny Five Introduction](http://johnny-five.io)
2. [Inverse Kinematics](http://www.societyofrobots.com/robot_arm_tutorial.shtml)
