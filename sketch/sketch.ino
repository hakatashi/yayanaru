void setup() {
  Serial.begin(9600) ;
}
void loop()
{
  int i;
  long x, y, z;
  x = y = z = 0;
  for (i = 0; i < 100; i++) {
    x = x + analogRead(3);
    y = y + analogRead(4);
    z = z + analogRead(5);
  }
  x = x / 100;
  y = y / 100;
  z = z / 100;
  Serial.print("{\"x\":" + String(x) + ",\"y\":" + String(y) + ",\"z\":" + String(z) + "}\n");
  delay(100);
}

