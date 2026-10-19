# Proguard / R8 Optimization Rules for MyPrayerTower TWA

# Keep AndroidBrowserHelper classes
-keep class com.google.androidbrowserhelper.** { *; }
-keep interface com.google.androidbrowserhelper.** { *; }

# Keep Custom Tabs
-keep class androidx.browser.customtabs.** { *; }
-keep class androidx.browser.trusted.** { *; }

# Keep Google Play Services Ads
-keep class com.google.android.gms.ads.** { *; }

# Keep application and launcher activity
-keep class com.myprayertower.myprayertower_app.** { *; }

# Optimization settings
-repackageclasses
-allowaccessmodification
