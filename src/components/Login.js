import React, { useState } from 'react'
// import { useHistory } from 'react-router-dom';
import ErrorMsg from './ErrorMsg';
import { login } from '../services/auth_services';
// import UserContext from '../context/UserContext';

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [usernameMsg, setUsernameMsg] = useState();
    const [passwordMsg, setPasswordMsg] = useState();
    const [formMsg, setFormMsg] = useState();
    // const { setUserData } = useContext(UserContext);
    // const history = useHistory()

    const submit = async (e) => {
        e.preventDefault();
        setFormMsg('')
        let check = true
        if (!username) {
            check = false
            setUsernameMsg('please fill username')
        }
        else {
            setUsernameMsg('')
        }
        if (!password || password.length < 5) {
            check = false
            setPasswordMsg('please enter password (atleast 5 characters long)')
        }
        else {
            setPasswordMsg('')
        }
        if (check) {
            const loginRes = await login({ username: username, password: password })
            console.log(loginRes)
            setFormMsg(loginRes[0])
            // const [token, user, uname] = loginRes[1]
            if (loginRes[0] === '') {
                // setUserData({ token, user: user, uname: uname })
                // history.push('/')
                window.location = '/';
            }
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <ErrorMsg value={formMsg} />
            <form onSubmit={submit} className="form-group">
                <div >
                    <label htmlFor="username" >Username</label>
                    <input name="username" id="username" required
                        className="form-input"
                        placeholder="my username" onChange={
                            (e) =>
                                setUsername(e.target.value)
                        } />
                    <ErrorMsg id="usernameMessage" value={usernameMsg} />
                </div>
                <div>

                    <label htmlFor="pasword" >Password</label>
                    <input name='password' id="password" type="password"
                        className="form-input"
                        required minLength={5}
                        onChange={(e) =>
                            setPassword(e.target.value)

                        } placeholder="my password" />

                    <ErrorMsg id="passwordMessage" value={passwordMsg} />
                </div>
                <input className="btn btn-primary" type="submit" value="Login"></input>
            </form>
        </div>
    )
}
