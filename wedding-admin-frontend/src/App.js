import React from 'react'
import { Redirect, BrowserRouter } from "react-router-dom"
import { Switch, Route} from "react-router-dom"

import {Header,
        Menu,
        ContentPane,
        News } from './Shared.js'

import {LoginForm} from './Login.js'

import Chat from './Chat.js'

var menuList = [{name: "News", id: "/panel/news", class: News},
                {name: "Chat", id: "/panel/chat", class: Chat}];

function MainPanel(){
    return(<>
               <Header/>
               <Menu menuList={menuList} />
               <ContentPane menuList={menuList} />
           </>)
}

function ProtectedRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render={(props) => {
            var token =localStorage.getItem("auth-token")

            return token != undefined 
            ? <Component {...props} /> 
            : <Redirect to="/" />
        }} />)
}

function App(){
    return (<BrowserRouter>
                <Switch>
                    <Route exact path="/" component={LoginForm}/>
                    <ProtectedRoute path="/panel" component={MainPanel}/>
                </Switch>
            </BrowserRouter>)
}

export default App;