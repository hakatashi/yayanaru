void setup() {
  Serial.begin(9600);
}

void loop()
{
  int i;
  long ax, ay, az, bx, by, bz;
  ax = ay = az = bx = by = bz = 0;
  for (i = 0; i < 100; i++) {
    ax = ax + analogRead(0);
    ay = ay + analogRead(1);
    az = az + analogRead(2);
    bx = bx + analogRead(3);
    by = by + analogRead(4);
    bz = bz + analogRead(5);
  }
  ax = ax / 100;
  ay = ay / 100;
  az = az / 100;
  bx = bx / 100;
  by = by / 100;
  bz = bz / 100;
  Serial.print("{\"id\":0,\"x\":" + String(ax) + ",\"y\":" + String(ay) + ",\"z\":" + String(az) + "}\n");
  Serial.print("{\"id\":1,\"x\":" + String(bx) + ",\"y\":" + String(by) + ",\"z\":" + String(bz) + "}\n");
  delay(40);
}

