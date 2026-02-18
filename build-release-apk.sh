#!/bin/bash

# Build Release APK Script for Tifto Rider App
# This script runs a clean expo prebuild to regenerate the android native project,
# then builds the release APK. Uses shared Gradle cache at project root.

set -e  # Exit on error

# Unset _JAVA_OPTIONS if it has a path with spaces (causes JVM parse error)
unset _JAVA_OPTIONS 2>/dev/null || true

# Project root directory
PROJECT_ROOT="/media/anoop/Extreme SSD/AndroidStudioProjects/food-delivery-multivendor-main1/food-delivery-multivendor-main"

# Storage: use $HOME when project drive is low (<5GB free) or exFAT (Gradle fails on exFAT)
PROJECT_FSTYPE=$(findmnt -o FSTYPE -n -T "$PROJECT_ROOT" 2>/dev/null || echo "")
PROJECT_AVAIL_GB=$(df -BG "$PROJECT_ROOT" 2>/dev/null | awk 'NR==2 {gsub(/G/,""); print $4}')
USE_HOME_STORAGE=false
if [ "$PROJECT_FSTYPE" = "exfat" ] || [ "$PROJECT_FSTYPE" = "exFAT" ]; then
  USE_HOME_STORAGE=true
elif [ -n "$PROJECT_AVAIL_GB" ] && [ "$PROJECT_AVAIL_GB" -lt 5 ]; then
  USE_HOME_STORAGE=true
fi

if [ "$USE_HOME_STORAGE" = true ]; then
  export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$HOME/.gradle-tifto}"
  export TMPDIR="${TMPDIR:-$HOME/.tmp-tifto}"
else
  export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$PROJECT_ROOT/.gradle}"
  export TMPDIR="${TMPDIR:-$PROJECT_ROOT/.tmp}"
fi
export TEMP="$TMPDIR"
export TMP="$TMPDIR"
mkdir -p "$TMPDIR"

# Set Android SDK location
export ANDROID_HOME="/usr/lib/android-sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

# Change to the rider app directory
cd "$PROJECT_ROOT/tifto-rider-app"

echo "========================================="
echo "Building Release APK for Tifto Rider"
echo "========================================="
echo "Project Root: $PROJECT_ROOT"
echo "Gradle Home: $GRADLE_USER_HOME"
echo ""

# Create .gradle directory if it doesn't exist
mkdir -p "$GRADLE_USER_HOME"
echo "✓ Gradle home directory configured: $GRADLE_USER_HOME"

# Ensure dependencies are installed (expo prebuild requires local expo)
# Use --no-bin-links on exFAT/FAT external drives (they don't support symlinks)
if [ ! -d "node_modules/expo" ]; then
    echo "Installing dependencies (npm install --no-bin-links)..."
    npm install --no-bin-links --ignore-scripts
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies present"
fi

# On exFAT drives, npm --no-bin-links skips .bin symlinks. Use expo's cli directly via node.
# Run from project dir so require('@expo/cli') resolves from node_modules
EXPO_CLI="node_modules/expo/bin/cli"
echo "Running expo prebuild --clean (regenerates native project with correct autolinking)..."
if [ -f "$EXPO_CLI" ]; then
    node "$EXPO_CLI" prebuild --platform android --clean
else
    npx expo prebuild --platform android --clean
fi
echo "✓ Android native code generated with all native modules autolinked"

# Ensure local.properties has sdk.dir for Gradle
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
echo "✓ Android SDK path written to local.properties"

# Make gradlew executable
if [ -f "android/gradlew" ]; then
    chmod +x android/gradlew
    echo "✓ Gradle wrapper is executable"
fi

# Navigate to android directory and build
cd android

# Merge shared gradle properties for faster builds (only if not already merged)
if [ -f "$PROJECT_ROOT/shared-gradle.properties" ] && ! grep -q "## Shared properties from shared-gradle.properties" gradle.properties 2>/dev/null; then
    echo "" >> gradle.properties
    echo "## Shared properties from shared-gradle.properties" >> gradle.properties
    cat "$PROJECT_ROOT/shared-gradle.properties" >> gradle.properties
    echo "✓ Shared Gradle properties merged"
fi

# Low-memory mode: reduce heap, disable parallel, limit workers (for systems with <8GB RAM or <1GB available)
AVAIL_MB=$(free -m | awk 'NR==2 {print $7}')
if [ "$LOW_MEMORY" = "1" ] || { [ -n "$AVAIL_MB" ] && [ "$AVAIL_MB" -lt 1024 ]; }; then
  LOW_MEMORY=1
    echo ""
    echo "⚠️  LOW_MEMORY=1: Using reduced heap (1GB), no parallel, 1 worker"
    if [ -f "$PROJECT_ROOT/low-memory-gradle.properties" ] && ! grep -q "## Low-memory overrides" gradle.properties 2>/dev/null; then
        echo "" >> gradle.properties
        echo "## Low-memory overrides" >> gradle.properties
        cat "$PROJECT_ROOT/low-memory-gradle.properties" >> gradle.properties
        echo "✓ Low-memory Gradle settings applied"
    fi
    # Free space from other apps before building
    if [ -f "$PROJECT_ROOT/scripts/clean-after-build.sh" ]; then
        echo "Cleaning other apps' build artifacts to free memory/disk..."
        bash "$PROJECT_ROOT/scripts/clean-after-build.sh"
    fi
fi

echo ""
echo "Cleaning previous build artifacts..."
# Remove APK output directory to ensure fresh build
rm -rf app/build/outputs/apk/release 2>/dev/null || true
./gradlew clean -x externalNativeBuildClean -x externalNativeBuildCleanRelease --no-daemon 2>/dev/null || ./gradlew cleanBuildCache --no-daemon 2>/dev/null || echo "⚠️  Some clean tasks were skipped, but continuing with build..."
echo "✓ Clean complete"

echo ""
echo "Clearing Metro bundler cache (ensures fresh JS bundle)..."
rm -rf ../node_modules/.cache/metro-* 2>/dev/null || true
rm -rf ../node_modules/.cache 2>/dev/null || true
echo "✓ Cache cleared"

echo ""
echo "Starting Gradle build (assembleRelease for APK)..."
echo ""

# Build release APK (use --no-parallel when LOW_MEMORY=1)
if [ "$LOW_MEMORY" = "1" ]; then
    ./gradlew assembleRelease --no-daemon --build-cache --no-parallel -Dorg.gradle.workers.max=1
else
    ./gradlew assembleRelease --no-daemon --build-cache --parallel
fi

echo ""
echo "========================================="
echo "Build Complete!"
echo "========================================="

# Find and display APK location
APK_PATH=$(find app/build/outputs/apk/release -name "*.apk" 2>/dev/null | head -1)

if [ -z "$APK_PATH" ]; then
    echo "⚠️  Warning: APK not found in expected location"
    echo "Expected location: app/build/outputs/apk/release/*.apk"
else
    APK_FULL_PATH="$PROJECT_ROOT/tifto-rider-app/android/$APK_PATH"
    APK_SIZE=$(du -h "$APK_FULL_PATH" | cut -f1)
    echo "✓ APK Location: $APK_FULL_PATH"
    echo "✓ APK Size: $APK_SIZE"
fi

echo ""
echo "Gradle cache location: $GRADLE_USER_HOME"
echo "========================================="
