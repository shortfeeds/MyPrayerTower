
'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioTrack {
    id: string;
    name: string;
    url: string;
    category: 'chant' | 'ambient' | 'instrumental';
}

interface AudioContextType {
    isPlaying: boolean;
    activeTrack: AudioTrack | null;
    volume: number;
    togglePlay: () => void;
    setTrack: (track: AudioTrack) => void;
    setVolume: (volume: number) => void;
    stop: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const TRACKS: AudioTrack[] = [
    {
        id: 'gregorian-chant',
        name: 'Gregorian Chant (Kyrie)',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Kyrie_eleison_Xii.ogg',
        category: 'chant'
    },
    {
        id: 'ambient-rain',
        name: 'Wind in the Cloister',
        url: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
        category: 'ambient'
    },
    {
        id: 'sacred-organ',
        name: 'Cathedral Organ',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Bach_Toccata_and_Fugue_in_D_Minor.ogg',
        category: 'instrumental'
    }
];

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);
    const [volume, setVolume] = useState(0.3);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current || !activeTrack) return;

        audioRef.current.src = activeTrack.url;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [activeTrack]);

    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            if (!activeTrack && TRACKS.length > 0) {
                setActiveTrack(TRACKS[0]);
            }
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const setTrack = (track: AudioTrack) => {
        setActiveTrack(track);
        setIsPlaying(true);
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    };

    return (
        <AudioContext.Provider value={{ isPlaying, activeTrack, volume, togglePlay, setTrack, setVolume, stop }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
