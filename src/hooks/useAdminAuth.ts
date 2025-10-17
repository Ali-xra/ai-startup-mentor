import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

export const useAdminAuth = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                setIsSuperAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('admins')
                    .select('role, is_active')
                    .eq('user_id', user.id)
                    .eq('is_active', true)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching admin:', error);
                    setIsAdmin(false);
                    setIsSuperAdmin(false);
                } else if (!data) {
                    setIsAdmin(false);
                    setIsSuperAdmin(false);
                } else {
                    setIsAdmin(true);
                    setIsSuperAdmin(data.role === 'super_admin');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
                setIsSuperAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [user]);

    return {
        isAdmin,
        isSuperAdmin,
        isLoading
    };
};
