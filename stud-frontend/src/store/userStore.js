import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';
import { persist, createJSONStorage} from 'zustand/middleware';

const useUserStore = create(
    persist(
        (set) => ({
            user: null, //사용자 정보
            token: null,
            isLoggedIn: false, //로그인 상태
            role: null,

            login: (token) =>{
                
                const decoded = jwtDecode(token);
                const userEmail = decoded.sub;
                const userRole = decoded.auth;

                set({
                    user: {email: userEmail},
                    token: token,
                    isLoggedIn: true,
                    role: userRole,
                });
            },

            logout: () => set({user : null, token: null, isLoggedIn:false, role: null}),
        }),
        {
            name: 'user-login-status',
            storage: createJSONStorage(() => localStorage),
        }

    )
);

export default useUserStore;