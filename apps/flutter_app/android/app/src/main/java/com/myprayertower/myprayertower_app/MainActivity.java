package com.myprayertower.myprayertower_app;

import com.ryanheise.audioservice.AudioServiceActivity;

public class MainActivity extends AudioServiceActivity {
    @Override
    protected void onCreate(android.os.Bundle savedInstanceState) {
        androidx.activity.EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
