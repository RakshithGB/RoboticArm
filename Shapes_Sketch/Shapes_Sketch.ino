#include <Servo.h>

Servo base;
Servo shoulder;
Servo elbow;
Servo palm;
// Hardcoding Servo PWM values for accuracy.
int tang[] = {900,910,920,933,945,956,966,976,986,1000,1010,1020,1030,1040,1050,1058,1068,1078,1090,1100,1110,1125,1135,1145,1156,1167,1177,1187,1197,1210,1222,1232,1242,1255,1265,1275,1285,1296,1307,1318,1330,1340,1350,1360,1373,1383,1393,1404,1414,1424,1434,1444,1456,1466,1478,1488,1498,1508,1520,1530,1543,1553,1563,1573,1585,1595,1605,1615,1625,1638,1648,1658,1670,1680,1691,1702,1712,1722,1734,1744,1754,1764,1774,1788,1798,1808,1818,1830,1840,1850,1860,1865,1878,1885,1893,1904,1915,1927,1938,1949,1956,1966,1976,1984,1994,2004,2014,2024,2034,2044,2054,2064,2074,2084,2094};
float LENGTH1 = 200.0;
float LENGTH2 = 250.0;

void setup() {
  Serial.begin(9600);
  base.attach(3);
  shoulder.attach(9);
  elbow.attach(6);
  palm.attach(11);
}

void loop() {
  //setArm(0.0 ,0.0, 350.0 ,0.0);
  delay(2000);
  circle();
  //square();
}

void square(){
  float out = 0.0;
  float  out2 = 0.0;
  for(out = 300.0; out < 370.0; out += 1 ) {
    setArm( 0, 0, out, 0 );
    delay( 10 );
  }
  delay(100);
  for(out2 = 0 ; out2 < 150.0 ; out2 += 1){
    setArm(out2 , 0 , out , 0);
    delay(10);
  }
  delay(100);
  for(; out > 300.0; out -= 1 ) {
    setArm( out2, 0, out, 0 );
    delay(10);
  }
  delay(100);
  for(; out2 > 0.0 ; out2 -= 1){
    setArm(out2 , 0 , out , 0);
    delay(10);
  }
}

void setArm( float x, float y, float z, float grip_angle_d )
{ y = -50;
  float baseAngle = calculatebaseAngle(x,z);
  base.write(abs(baseAngle));

  float hypotenuse = sqrt(square(y)+square(z));
  float a = atan(y/z);
  float b = acos((square(LENGTH1)+square(hypotenuse)-square(LENGTH2))/(2*LENGTH1*hypotenuse));
  float theta1 = toDegrees(a+b);
  int temp = (int)abs(theta1);
  shoulder.write(tang[temp]);

  float c = acos((square(LENGTH2)+square(LENGTH1)-square(hypotenuse))/(2*LENGTH1*LENGTH2));
  float  theta2 = 180 - toDegrees(c);
  int temp2  = (int)abs(theta2);
  elbow.write(tang[temp2]);

  float palmAngle = 360 - abs(temp +temp2 );
  int temp3 = (int)palmAngle;
  palm.write(tang[temp3]);

}

float calculatebaseAngle(float x ,float z){
  float angle = atan(x/z);
  return (57 + toDegrees(angle));    //Max turnigy servos can move is 114 deg therefore base spin = +- 57 deg
}

float square(float x) {
  return x*x;
}

float toDegrees(float angle){
  return (angle*57.2957795 );
}
void circle()
{
  #define RADIUS 40.0
  float zaxis,xaxis;
  for( float angle = 0.0; angle < 360.0; angle += 5.0 ) {
    zaxis = RADIUS * sin( radians( angle )) + 320;
    xaxis = RADIUS * cos( radians( angle )) ;
    xaxis = xaxis*2.2; // To compensate for offset in base movement
    setArm( xaxis, 0, zaxis, 0 );
    delay(75);
  }
}
