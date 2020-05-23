import React, { useEffect, useCallback} from 'react'

import {Redirect} from 'react-router-dom'

import './css/login.css'

function LoginForm(props){
    const [error, setError] = React.useState(false)
    const [value, setValue] = React.useState({
                                    username: "",
                                    password: ""});


    var authEp = "http://127.0.0.1:8000/admin/login"
    var defaultErr = "Nieprawidlowa dane logowania"

    const authRequest = useCallback((e) => {
        e.preventDefault()

        var reqData = { method: "POST",
                        headers: {'Content-Type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(value)}

        fetch(authEp, reqData)
        .then(res => {
                        if(res.ok){
                            var token = res.headers.get("Authorization")

                            if(token) {
                                localStorage.setItem("auth-token", token)
                                console.log(props.history)
                                props.history.push('/panel')
                            }
                        }
                        else {
                            setError(true)
                        }
        })
        .catch(msg => console.log(`Cannot update news in DB: ${msg}`))
    })

    const handleChange = useCallback((e) => {
        setValue({
            ...value,
            [e.target.id]: e.target.value,
        })
    })

    return (
        localStorage.getItem("auth-token") 
        ? <Redirect to="/panel" />
        : <div className="loginPageContainer">
            {error ? <p className="loginErrorBox">{defaultErr}</p> : <></>}
            <form onSubmit={authRequest} className="loginForm">
                <div>
                    <label htmlFor="username">Login</label>
                    <input id="username" onChange={handleChange}></input>
                </div>

                <div>
                    <label htmlFor="password">Haslo</label>
                    <input id="password" type="password" onChange={handleChange}></input>
                </div>

                <button type="submit">Zaloguj sie</button>
            </form>
        </div>)
}

export {LoginForm};