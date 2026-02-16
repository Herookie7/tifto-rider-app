#!/bin/bash
# ADB Rider App QA Test Script
# Run with: ./scripts/adb-rider-test.sh
# Device: 25cce2ee (or omit -s for default)

DEVICE="${1:-25cce2ee}"
PKG="com.tifto.rider"
ACTIVITY="com.tifto.rider.MainActivity"

echo "=== Tifto Rider App ADB Test Script ==="
echo "Device: $DEVICE"
echo ""

# Check device
if ! adb -s "$DEVICE" get-state 2>/dev/null | grep -q "device"; then
  echo "Error: Device $DEVICE not found. Run 'adb devices'"
  exit 1
fi

echo "1. Launching app..."
adb -s "$DEVICE" shell am start -n "$PKG/$ACTIVITY"
sleep 3

echo "2. Dumping UI hierarchy..."
adb -s "$DEVICE" shell uiautomator dump /sdcard/ui.xml
adb -s "$DEVICE" pull /sdcard/ui.xml /tmp/rider_ui_dump.xml 2>/dev/null
echo "   UI dump saved to /tmp/rider_ui_dump.xml"

echo "3. Taking screenshot..."
adb -s "$DEVICE" exec-out screencap -p > /tmp/rider_screenshot.png 2>/dev/null
echo "   Screenshot saved to /tmp/rider_screenshot.png"

echo ""
echo "=== Manual Test Checklist ==="
echo "- Grant Location permission when prompted"
echo "- Login: rider@tensi.org / 9827453137@aS"
echo "- Test: Home tabs (New Orders, Processing, Delivered)"
echo "- Test: Drawer (Language, Vehicle, Work Schedule, Bank, Help)"
echo "- Test: Wallet, Earnings, Profile"
echo "- Test: Order detail, Assign Me, Pick Up, Mark Delivered"
echo ""
