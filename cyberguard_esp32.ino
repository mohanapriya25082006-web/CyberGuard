/*
  CyberGuard - ESP32 Firmware (Mini Project)
  -------------------------------------------
  Reads an accelerometer (ADXL345 / MPU6050 over I2C), compares movement
  against a threshold, sounds a local buzzer, and posts an event to the
  Spring Boot backend whenever the laptop is ARMED and moves.

  Libraries needed (install via Arduino IDE Library Manager):
    - Wire.h            (built-in)
    - WiFi.h            (built-in, ESP32 core)
    - HTTPClient.h       (built-in, ESP32 core)
    - ArduinoJson         (by Benoit Blanchon)
    - Adafruit_MPU6050 + Adafruit_Sensor  (if using MPU6050)
*/

#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// ------------- CONFIG -------------
const char* WIFI_SSID      = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD  = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL     = "http://YOUR_SERVER_IP:8080/api/device/event";
const char* DEVICE_ID      = "ESP32-LAPTOP-001";   // must match Laptop.deviceId in DB
const char* API_KEY        = "cyberguard-esp32-key-001"; // must match device.api.key

const int   BUZZER_PIN     = 25;
const float MOVEMENT_THRESHOLD = 1.5;  // g-force delta that counts as "moved"
const unsigned long CHECK_INTERVAL_MS = 300;

// ------------- STATE -------------
Adafruit_MPU6050 mpu;
bool armed = false; // toggled remotely later, or via a physical push-button for the mini project
unsigned long lastCheck = 0;

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
}

void sendEvent(const char* eventType, float movementValue) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping send");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["eventType"] = eventType;
  doc["movementValue"] = movementValue;
  doc["apiKey"] = API_KEY;

  String payload;
  serializeJson(doc, payload);

  int responseCode = http.POST(payload);
  Serial.printf("POST %s -> %d\n", eventType, responseCode);
  http.end();
}

void soundAlarm() {
  for (int i = 0; i < 5; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  Wire.begin();
  if (!mpu.begin()) {
    Serial.println("MPU6050 not found - check wiring!");
    while (1) delay(10);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_4_G);

  connectWiFi();

  // For the mini project, arm/disarm can be toggled with a physical
  // button on a GPIO pin, or hard-set here for demo purposes:
  armed = true;
  sendEvent("ARMED", 0);
}

void loop() {
  if (millis() - lastCheck < CHECK_INTERVAL_MS) return;
  lastCheck = millis();

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float magnitude = sqrt(a.acceleration.x * a.acceleration.x +
                          a.acceleration.y * a.acceleration.y +
                          a.acceleration.z * a.acceleration.z);

  // Roughly subtract gravity (9.8) to get "extra" movement magnitude
  float movementDelta = abs(magnitude - 9.8);

  if (armed && movementDelta > MOVEMENT_THRESHOLD) {
    Serial.printf("Movement detected! delta=%.2f\n", movementDelta);
    soundAlarm();
    sendEvent("MOVEMENT_DETECTED", movementDelta);
    delay(2000); // brief cooldown to avoid flooding the server
  }
}
