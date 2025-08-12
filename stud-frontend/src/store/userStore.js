import { create } from 'zustand'

const useUserStore = create((set) => ({
    user: null, //사용자 정보
    token: null,
    isLoggedIn: false, //로그인 상태

    login: (userData, token) =>set({
        user:userData, token:token, isLoggedIn: true}),
    
    logout: () =>set({ user:null, token: null, isLoggedIn:false}),

}));

export default useUserStore;