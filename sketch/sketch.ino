void setup() {
  Serial.begin(9600) ;
}
void loop()
{
  int i;
  long x, y, z;
  x = y = z = 0;
  for (i = 0; i < 100; i++) {
    x = x + analogRead(0);
    y = y + analogRead(1);
    z = z + analogRead(2);
  }
  x = x / 100;
  y = y / 100;
  z = z / 100;
  Serial.print("{\"x\":" + String(x) + ",\"y\":" + String(y) + ",\"z\":" + String(z) + "}\n");
  delay(40);
}

