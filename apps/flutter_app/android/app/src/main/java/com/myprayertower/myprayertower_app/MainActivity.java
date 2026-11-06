package com.myprayertower.myprayertower_app;

import android.os.Build;
import android.os.Bundle;
import com.ryanheise.audioservice.AudioServiceActivity;

public class MainActivity extends AudioServiceActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        }
    }
}
