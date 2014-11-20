int ledPin = 13;  

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);
  Serial.begin(9600);
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
  Serial.print("{\"id\":0,\"x\":" + String(x) + ",\"y\":" + String(y) + ",\"z\":" + String(z) + "}\n");
  delay(40);
}

