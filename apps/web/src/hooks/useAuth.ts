'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    session: Session | null;
    loading: boolean;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        session: null,
        loading: true,
    });

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setState({
                    isAuthenticated: !!session,
                    user: session?.user ?? null,
                    session,
                    loading: false,
                });
            } catch (error) {
                console.error('Error getting session:', error);
                setState(prev => ({ ...prev, loading: false }));
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setState({
                isAuthenticated: !!session,
                user: session?.user ?? null,
                session,
                loading: false,
            });
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return {
        ...state,
        signOut,
    };
}
