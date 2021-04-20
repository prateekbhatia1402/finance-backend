import React, { useState, useContext } from 'react'
import ErrorMsg from './ErrorMsg';
import { register } from '../services/auth_services';
import { useHistory } from 'react-router-dom';
import UserContext from '../context/UserContext';


export default function Register() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [cpassword, setCPassword] = useState();
    const [usernameMsg, setUsernameMsg] = useState();
    const [passwordMsg, setPasswordMsg] = useState();
    const [cPasswordMsg, setCPasswordMsg] = useState();
    const [formMsg, setFormMsg] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();
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
        if (cpassword !== password) {
            check = false
            setCPasswordMsg('Password and confirm password do not match')
            console.log("password does not match")
        }
        else {
            setCPasswordMsg('')
        }
        if (check) {
            const newUser = { username, password }
            const [result, data] = await register(newUser)
            setFormMsg(result)
            if (result === '') {
                setUserData(data.token, data.user)
                history.push('/')
            }
        }
    }
    return (
        <div>
            <h2>Register</h2>
            <ErrorMsg value={formMsg} />
            <form onSubmit={submit} className="form-group">
                <div >
                    <label htmlFor="username" >Username</label>
                    <input name="username" id="username" required
                        className="form-input"
                        placeholder="my unique username" onChange={
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

                        } placeholder="tobe password" />

                    <ErrorMsg id="passwordMessage" value={passwordMsg} />
                </div>
                <div>

                    <label htmlFor="cpassword" >Confirm Password</label>
                    <input type="password" id="cpassword"
                        className="form-input"
                        placeholder="tobe password again"
                        required minLength={5}
                        onChange={(e) => setCPassword(e.target.value)} />

                    <ErrorMsg value={cPasswordMsg} />
                </div>
                <input className="btn btn-primary" type="submit" value="Register"></input>
            </form>
        </div>
    )
}
