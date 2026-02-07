import Cookies from 'js-cookie';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'customer';
}

export const setAuth = (access: string, refresh: string, user: User) => {
    Cookies.set('access_token', access, { expires: 1 }); // 1 day
    Cookies.set('refresh_token', refresh, { expires: 7 }); // 7 days
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getUser = (): User | null => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
        try {
            return JSON.parse(userCookie);
        } catch {
            return null;
        }
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    return !!Cookies.get('access_token');
};

export const isAdmin = (): boolean => {
    const user = getUser();
    return user?.role === 'admin';
};

export const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    window.location.href = '/login';
};