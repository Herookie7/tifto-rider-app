#!/bin/bash
# Full ADB Test Script for Tifto Rider App
# Tests all screens and captures UI state
# Usage: ./scripts/adb-full-test.sh [device_id]

DEVICE="${1:-25cce2ee}"
PKG="com.tifto.rider"
OUT_DIR="/tmp/rider_adb_test_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT_DIR"

echo "=== Tifto Rider App - Full ADB Test ==="
echo "Device: $DEVICE | Output: $OUT_DIR"
echo ""

# Check device
if ! adb -s "$DEVICE" get-state 2>/dev/null | grep -q "device"; then
  echo "Error: Device $DEVICE not found"
  exit 1
fi

launch_and_capture() {
  local name=$1
  adb -s "$DEVICE" shell am start -n "$PKG/com.tifto.rider.MainActivity" 2>/dev/null
  sleep 2
  adb -s "$DEVICE" shell uiautomator dump /sdcard/ui.xml 2>/dev/null
  adb -s "$DEVICE" pull /sdcard/ui.xml "$OUT_DIR/${name}_ui.xml" 2>/dev/null
  adb -s "$DEVICE" exec-out screencap -p > "$OUT_DIR/${name}.png" 2>/dev/null
  echo "  Captured: $name"
}

# Tab center coordinates (720x1280)
# Home: 90,1231 | Wallet: 270,1231 | Earnings: 450,1231 | Profile: 630,1231
tap_tab() {
  local x=$1
  adb -s "$DEVICE" shell input tap $x 1231
  sleep 2
}

echo "1. Launching app..."
adb -s "$DEVICE" shell am start -n "$PKG/com.tifto.rider.MainActivity"
sleep 3

echo "2. Capturing initial state (Profile)..."
launch_and_capture "01_profile"

echo "3. Tapping Home tab..."
tap_tab 90
launch_and_capture "02_home"

echo "4. Tapping Wallet tab..."
tap_tab 270
launch_and_capture "03_wallet"

echo "5. Tapping Earnings tab..."
tap_tab 450
launch_and_capture "04_earnings"

echo "6. Tapping Profile tab..."
tap_tab 630
launch_and_capture "05_profile"

echo ""
echo "=== Test Complete ==="
echo "Screenshots and UI dumps saved to: $OUT_DIR"
echo ""
echo "Manual tests required:"
echo "  - Open drawer (menu icon) -> Language, Vehicle Type, Work Schedule, Bank, Help"
echo "  - Profile: Edit, Theme toggle, Driving License Add, Vehicle Plate Add"
echo "  - Wallet: Withdraw button"
echo "  - Home: New Orders, Processing, Delivered tabs"
echo ""
