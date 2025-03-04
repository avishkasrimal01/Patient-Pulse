
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <Adafruit_Fingerprint.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFiManager.h>

#define FIREBASE_HOST "patientpulse-e29f3-default-rtdb.firebaseio.com" // https://patientpulse-e29f3-default-rtdb.firebaseio.com/
#define FIREBASE_AUTH "0KRJP18nMnkTEkFuk53DNwFSntRvuDSOozRmdamJ"

#define WIFI_SSID "Avishka Srimal" //Home_Wifi
#define WIFI_PASSWORD "avishka@123"   //bdg92813

LiquidCrystal_I2C lcd(0x27, 16, 4); 


#if (defined(__AVR__) || defined(ESP8266)) && !defined(__AVR_ATmega2560__)
// For UNO and others without hardware serial, we must use software serial...
// pin #2 is IN from sensor (GREEN wire)
// pin #3 is OUT from arduino  (WHITE wire)
// Set up the serial port to use softwareserial..
SoftwareSerial mySerial(4, 5);

#else
// On Leonardo/M0/etc, others with hardware serial, use hardware serial!
// #0 is green wire, #1 is white
#define mySerial Serial1

#endif


Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

String userID="";
uint8_t fingerprintCount;

uint8_t id;

void setup()
{

  // Initialize I2C with custom SDA and SCL pins (D3 = GPIO 0, D4 = GPIO 2)
  Wire.begin(14, 12);  // SDA = D5 (GPIO 14), SCL = D6 (GPIO 12)
  
  Serial.begin(9600);
  while (!Serial);  // For Yun/Leo/Micro/Zero/...
  delay(100);
  Serial.println("\n\nAdafruit Fingerprint sensor enrollment");

  lcd.init();  // Initialize the LCD
  lcd.backlight();  // Turn on the backlight
  lcd.setCursor(2, 0);  // Adjusted for 16 columns (centered for "WELCOME TO")
  lcd.print("#WELCOME TO");
  lcd.setCursor(1, 1);
  lcd.print("PATIENT PULSE!");
  lcd.setCursor(0, 3);
  lcd.print("Group 13");
  delay(5000);
  lcd.clear();

  // set the data rate for the sensor serial port
  finger.begin(57600);

  if (finger.verifyPassword()) {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    lcd.clear();
    lcd.setCursor(2, 1);
    lcd.print("Did Not Find");
    lcd.setCursor(1, 2);
    lcd.print("Sensor");
    while (1) { delay(1); }
  }

  Serial.println(F("Reading sensor parameters"));
  finger.getParameters();
  Serial.print(F("Status: 0x")); Serial.println(finger.status_reg, HEX);
  Serial.print(F("Sys ID: 0x")); Serial.println(finger.system_id, HEX);
  Serial.print(F("Capacity: ")); Serial.println(finger.capacity);
  Serial.print(F("Security level: ")); Serial.println(finger.security_level);
  Serial.print(F("Device address: ")); Serial.println(finger.device_addr, HEX);
  Serial.print(F("Packet len: ")); Serial.println(finger.packet_len);
  Serial.print(F("Baud rate: ")); Serial.println(finger.baud_rate);


    WiFi.begin(WIFI_SSID, WIFI_PASSWORD); 
    Serial.print("connecting");
    while (WiFi.status() != WL_CONNECTED) { 
      Serial.print("."); 
      delay(500); 
    } 
    Serial.println(); 
    Serial.print("connected: "); 
    lcd.clear();
    lcd.setCursor(3, 1);
    lcd.print("Connected");
    lcd.setCursor(0, 2);
    lcd.print("to WIFI");
    Serial.println(WiFi.localIP()); 
     
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH); 
}

uint8_t readnumber(void) {
  uint8_t num = 0;
  
  uint8_t fingerprintCount = Firebase.getInt("FingerPrintCount");
  Serial.print("fingerprintCount: ");
  Serial.println(fingerprintCount);

  // Wait for a serial input, then set 'num' to fingerprintCount
  while (num == 0) {
    num = fingerprintCount;
  }
  
  return num;
}


void loop()                     // run over and over again
{
  Serial.begin(9600);
  
  String deviceMode = Firebase.getString("DeviceMode");
  
  if(deviceMode == "signup"){
    Serial.println("Device Mode To SignUp");
    lcd.clear();
    lcd.setCursor(1, 1);
    lcd.print("Device Mode To");
    lcd.setCursor(-4, 2);
    lcd.print("SignUp the User!");
    delay(2000);
    
    Serial.println("-------------------------------------");
    
    uint8_t fingerprintCountCheck = Firebase.getInt("FingerPrintCount");
    String userIDcheck = Firebase.getString("GetUser");
  
    if(fingerprintCountCheck != 0 && userIDcheck != "0000") {
    
      Serial.println("Ready to enroll a fingerprint!");
      id = readnumber();
      if (id == 0) {// ID #0 not allowed, try again!
         return;
      }
      Serial.print("Enrolling ID #");
      Serial.println(id);
    
      while (! getFingerprintEnroll() );
  
    }else{
      Serial.println("Enter new user Fing count and User ID");
    }
    delay(1000);
  }

  if(deviceMode == "auth"){
    Serial.println("Device Mode To Auth the User");
    lcd.clear();
    lcd.setCursor(1, 1);
    lcd.print("Device Mode To");
    lcd.setCursor(-3, 2);
    lcd.print("Auth the User!");
    delay(2000);
    
    Serial.println("-------------------------------------");
    getFingerprintID();
    delay(50);  
  }
  
}

uint8_t getFingerprintEnroll() {

  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(id);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image Taken");
      lcd.clear();
      lcd.setCursor(-2, 2);
      lcd.print("Image Taken!");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print("Place Your Finger in the Sensor");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Place Ur #Finger");
      lcd.setCursor(1, 1);
      lcd.print("In the Sensor!");
      lcd.setCursor(-3, 3);
      userID = Firebase.getString("GetUser");
      lcd.print("User ID# " + userID);
      delay(3000);
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Communication");
      lcd.setCursor(0, 2);
      lcd.print("Error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Could not find");
      lcd.setCursor(0, 3);
      lcd.print("fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Could not find");
      lcd.setCursor(0, 3);
      lcd.print("fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Unknown error");
      return p;
  }

  Serial.println("Remove finger");
  lcd.clear();
  lcd.setCursor(-3, 2);
  lcd.print("Remove Finger!");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  lcd.clear();
  lcd.setCursor(3, 1);
  lcd.print("Place Same");
  lcd.setCursor(-2, 2);
  lcd.print("Finger Again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      lcd.clear();
      lcd.setCursor(-2, 2);
      lcd.print("Image Taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      lcd.clear();
      lcd.setCursor(3, 1);
      lcd.print("Place Same");
      lcd.setCursor(-2, 2);
      lcd.print("Finger Again");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Could not find");
      lcd.setCursor(0, 3);
      lcd.print("fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Could not find");
      lcd.setCursor(0, 3);
      lcd.print("fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Unknown error");
      return p;
  }

  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
    lcd.clear();
    lcd.setCursor(0, 2);
    lcd.print("Prints matched");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    lcd.clear();
    lcd.setCursor(0, 2);
    lcd.print("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    lcd.clear();
    lcd.setCursor(0, 2);
    lcd.print("Fingerprint");
    lcd.clear();
    lcd.setCursor(-2, 3);
    lcd.print("did not match");
    return p;
  } else {
    Serial.println("Unknown error");
    lcd.clear();
    lcd.setCursor(0, 2);
    lcd.print("Unknown error");
    return p;
  }

  Serial.print("ID "); Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
    lcd.clear();
    lcd.setCursor(2, 1);
    lcd.print("#Fingerprint");
    lcd.setCursor(1, 2);
    lcd.print("Stored!");
    userID = Firebase.getString("GetUser");
    if(userID != ""){
      Firebase.setString(userID + "/userID", userID);
      Firebase.setString(userID + "/Fingerprint_ID", String(id));
    }
    Serial.println("Firebase Stored!");
    delay(100);
    Firebase.setInt("FingerPrintCount",0);
    Firebase.setString("GetUser","0000");
    Firebase.setString("DeviceMode","auth");
    Serial.println("Variabels Claer!");
    delay(100);
    id = readnumber();
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  return true;
}



///////////////////////////////////////////////////
//Authentication



uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image Taken");
      lcd.clear();
      lcd.setCursor(-2, 2);
      lcd.print("Image Taken!");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      lcd.clear();
      lcd.setCursor(4, 1);
      lcd.print("No Finger");
      lcd.setCursor(0, 2);
      lcd.print("Detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      lcd.clear();
      lcd.setCursor(0, 2);
      lcd.print("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  Serial.println("User is authenticated");
  int fingerIDGet = finger.fingerID;
  Firebase.setInt("catchFingerPrintID", fingerIDGet);
  
  String userID;
  
  if (fingerIDGet < 10) {
    userID = "U00" + String(fingerIDGet);
  } else {
    userID = "U0" + String(fingerIDGet);
  }
  
  Firebase.setString("catchUserId", userID);
  Serial.print("catchUserId: ");
  Serial.println(userID);

    lcd.clear();
    lcd.setCursor(1, 1);
    lcd.print("User Taken ID#");
    lcd.setCursor(2, 2);
    lcd.print(userID);
    delay(3000);

  return finger.fingerID;
}
