import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../context/UserContext';
import { logout } from '../services/auth_services';
import logo from '../logo.svg';

export default function Header() {
    const { userData, setUserData } = useContext(UserContext)
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-light bg-light border">
                <div><Link className="nav-link" to="/"><img src={logo}></img> </Link></div>
                <>
                    {
                        userData && userData.user ?
                            <>
                                <div><Link className="nav-link" to="/transactions">Transactions </Link></div>
                                <div><Link className="nav-link" to="/buy">Buy </Link></div>
                                <div><Link className="nav-link" to="/sell">Sell </Link></div>
                                <div><Link className="nav-link" to="/quote">Quote </Link></div>
                            </>
                            :
                            <></>
                    }
                </>
                <button aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler" data-target="#navbar" data-toggle="collapse" type="button">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav ml-auto mt-2">
                        {
                            userData && userData.user ? (
                                <li className="nav-item">
                                    <div><Link className="nav-link" onClick={() => { logout(); setUserData(null, null); window.location = "/"; }} to="/loadingPage" >Logout</Link></div>
                                </li>)
                                :
                                <>
                                    <li className="nav-item">
                                        <div><Link className="nav-link" to="/register">Register</Link></div>
                                    </li>
                                    <li className="nav-item"><div>
                                        <Link className="nav-link" to="/login">Log In</Link></div></li>
                                </>
                        }
                    </ul>
                </div>
            </nav>
        </div>
    )
}
