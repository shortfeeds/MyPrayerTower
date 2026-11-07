package com.myprayertower.myprayertower_app;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.ryanheise.audioservice.AudioServiceFragmentActivity;

public class MainActivity extends AudioServiceFragmentActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
