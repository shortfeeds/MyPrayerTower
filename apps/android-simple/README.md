# MyPrayerTower - Simple Android App

A lightweight Android WebView app that wraps myprayertower.com.

## Features

- ✅ WebView with full JavaScript support
- ✅ Swipe-to-refresh
- ✅ Offline error page
- ✅ Deep linking support
- ✅ Location permissions for church finder
- ✅ Material Design theme
- ✅ Back button navigation

## Prerequisites

- Java 17 or higher
- Android SDK (API 34)
- Gradle 8.4+

Or just use Android Studio (recommended).

## Building

### Using Gradle Wrapper

```bash
cd apps/android-simple

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Build release AAB (for Play Store)
./gradlew bundleRelease
```

### Output Locations

- Debug APK: `app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `app/build/outputs/apk/release/app-release-unsigned.apk`
- Release AAB: `app/build/outputs/bundle/release/app-release.aab`

### Using Android Studio

1. Open `apps/android-simple` in Android Studio
2. Wait for Gradle sync
3. Build > Build Bundle(s) / APK(s) > Build APK(s)

## Signing for Release

Create a keystore and add to `app/build.gradle.kts`:

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("keystore.jks")
            storePassword = "your-password"
            keyAlias = "your-alias"
            keyPassword = "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

## First Time Setup

1. Install Android Studio or Android SDK
2. Set ANDROID_HOME environment variable
3. Run `./gradlew wrapper` to download Gradle
4. Run `./gradlew assembleDebug` to build

## App Package

- Package ID: `com.myprayertower.app`
- Min SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
