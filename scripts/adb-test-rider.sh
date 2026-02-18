#!/bin/bash
# ADB-based smoke test for Tifto Rider App
# Usage: ./scripts/adb-test-rider.sh
# Requires: device connected, app installed, PIN 1111 for unlock

set -e
PACKAGE="com.tifto.rider"
DELAY=2

log() { echo "[$(date +%H:%M:%S)] $*"; }
tap() { adb shell input tap "$1" "$2"; sleep $DELAY; }
text() { adb shell input text "$1"; sleep $DELAY; }
key() { adb shell input keyevent "$1"; sleep $DELAY; }

log "=== Rider App ADB Smoke Test ==="
adb devices | grep -q "device$" || { log "No device connected"; exit 1; }

log "Launching app..."
adb shell am force-stop $PACKAGE
adb shell am start -n $PACKAGE/.MainActivity
sleep 5

log "Dumping UI..."
adb shell uiautomator dump /sdcard/uidump.xml
adb pull /sdcard/uidump.xml /tmp/uidump.xml 2>/dev/null || true

# Check for error screen
if grep -q "Something went wrong" /tmp/uidump.xml 2>/dev/null; then
  log "FAIL: Error screen detected"
  if grep -q "content-desc=\"Try Again\"" /tmp/uidump.xml 2>/dev/null; then
    log "Tapping Try Again..."
    tap 360 773
    sleep 4
  fi
fi

# Check for login screen (Email placeholder)
if grep -q "Email\|Enter Your Credentials" /tmp/uidump.xml 2>/dev/null; then
  log "PASS: Login screen visible"
  log "Entering credentials..."
  # Tap email field (approx), type email
  tap 360 400
  text "rider@tensi.org"
  tap 360 500
  text "9827453137@aS"
  tap 360 650
  sleep 5
  log "Login submitted"
else
  log "Check: Login screen or home may be visible"
fi

log "=== Test complete ==="
