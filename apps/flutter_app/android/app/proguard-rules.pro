# Flutter & AndroidX
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.embedding.**

# Keep MainActivity & HomeWidgetProvider
-keep class com.myprayertower.myprayertower_app.** { *; }

# Gson / JSON Serialization
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Firebase & Google Play Billing
-keep class com.google.firebase.** { *; }
-keep class com.android.billingclient.** { *; }
-dontwarn com.google.errorprone.annotations.**

# Flutter Local Notifications
-keep class com.dexterous.** { *; }

# Audio Service / ExoPlayer
-keep class com.ryanheise.** { *; }

# OkHttp / Retrofit
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
