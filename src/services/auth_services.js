import axios from 'axios';

const API_ADDRESS = "http://localhost:8000/auth";

export const login = function login(loginData) {
    const login_user = async (username, password) => {
        const finalResponse = ['err', '']
        try {
            const loginRes = await axios(
                {
                    method: 'POST',
                    url: API_ADDRESS + '/login',
                    data: { username, password },
                    validateStatus: () => true
                })
            console.log('login result :: ', loginRes)
            if (loginRes.status === 200) {
                localStorage.setItem("auth-token", loginRes.data.token);
                localStorage.setItem("user", loginRes.data.user);
                console.log('login success', localStorage.getItem("auth-token"))
                finalResponse[0] = ''
                finalResponse[1] = [loginRes.data.token, loginRes.data.user, loginRes.data.uname]
                return finalResponse;
            }
            else if (loginRes.status === 404) {
                return ["Invalid request", ""];
            }
            else {
                console.log(loginRes.data.error)
                return [loginRes.data.error, ""];
            }
        }
        catch (err) {
            console.log(err.message)
            return ["Something went wrong", ""]
        }
    }
    const value = login_user(loginData.username, loginData.password);
    return value;
}


export const register = function register(newUser) {
    const register_user = async (newUser) => {
        try {
            console.log('will try to register ', newUser.username)
            const registerRes = await axios(
                {
                    method: 'POST',
                    url: API_ADDRESS + '/register',
                    data: newUser,
                    validateStatus: () => true
                })
            console.log('registerRes :', registerRes)
            if (registerRes.status === 201) {
                console.log('registered successfully', registerRes)
                return login(newUser);
            }
            else if (registerRes.status === 404) {
                return ["Invalid request", ""];
            }
            else {
                console.log(registerRes.data.error)
                return [registerRes.data.error, ""];
            }
        }

        catch (err) {
            console.log(err.message)
            return ["Something went wrong", '']
        }
    }
    const value = register_user(newUser)
    return value
}

export const logout = function logout() {
    localStorage.clear();
}

