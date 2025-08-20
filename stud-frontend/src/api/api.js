import axios from 'axios';
import useUserStore from '../store/userStore';

const apiClient = axios.create({
    baseURL: '/api',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = useUserStore.getState().token;
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default apiClient;