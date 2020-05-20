import React, { 
    useEffect, 
    useState,
    useCallback } from 'react'

import {
    Route,
    NavLink,
  } from "react-router-dom";
  
import './css/menu.css'
import './css/header.css'
import './css/main.css'


export {Menu, Header, ContentPane, News}

function Header(props){
    return <div className="headerContainer">4events - panel administratora</div>
}

function ContentPane(props){
    return <div className="contentContainer">
            {props.menuList.map(o => <Route path={o.id} component={o.class} />)}
           </div>
}

function Menu(props){
    return <div className="menuContainer"> 
            {props.menuList.map(o => <MenuBrick>{o}</MenuBrick>)}
          </div>
}

function MenuBrick(props){
    var opt = props.children

    return (<NavLink className="menuBrick" to={opt.id}>
              {opt.name}
            </NavLink>);
}

function News(props){

    var [newsArr, newsSet] = useState([])
    var [newsUpdate, updateRequest] = useState(1)
    var [addAccordion, changeAccordionState] = useState(false)

    var clearNews = {id: -1, title: "", content: ""}
    
    var newsEp="http://127.0.0.1:8000/news"

    useEffect(() => {
        fetch(newsEp)
        .then(res => res.json())
        .then(data => { 
            newsSet(data)
            updateRequest(0)
        })
        .catch(msg => console.log(`Cannot fetch news from API: ${msg}`))
    }, [newsUpdate])

    const updateNews = useCallback((o) => {
        console.log(o)
        var reqData = { method: "POST",
                        headers: {'Content-Type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(o)}

        fetch(newsEp, reqData)
        .then(res => { updateRequest(1) })
        .catch(msg => console.log(`Cannot update news in DB: ${msg}`))

    },[])

    const deleteNews = useCallback((o) => {
        var reqData = { method: "DELETE",
                        headers: {'Content-Type': 'application/json; charset=UTF-8'},
                        body: JSON.stringify(o)}

        fetch(newsEp, reqData)
        .then(res => { updateRequest(1) })
        .catch(msg => console.log(`Cannot delete news from DB: ${msg}`))
    },[])

    return (<>
                <div className="newsListBar">
                    <button onClick={() => changeAccordionState(!addAccordion)}>Dodaj newsa</button>
                    <NewsAccordion updateNews={updateNews} active={addAccordion}>{clearNews}</NewsAccordion>
                </div>
                {newsArr ? newsArr.map(o => <NewsBrick deleteNews={deleteNews} updateNews={updateNews} >{o}</NewsBrick>)
                : <div className="newsListContainer">Brak newsow w bazie danych</div>}
            </>);
}


function NewsBrick(props){

    const [updateAccordion, changeAccordionState] = useState(false)

    return (<>
                <div className="newsListBrick">
                    <div className="newsHeaderPane">
                        <p>{props.children.title}</p>
                        <p>{props.children.creation_date}</p>
                    </div>
                    <div className="newsEditionPane">
                        <button onClick={() => changeAccordionState(!updateAccordion)}>Edytuj</button>
                        <button onClick={() => (props.deleteNews(props.children))}>Usun</button>
                    </div>
                </div>
                <NewsAccordion updateNews={props.updateNews} active={updateAccordion}>{props.children}</NewsAccordion>
            </>
    )
}

function NewsAccordion(props){

    var inactiveStyle={display: 'none'}

    const [value, setValue] = React.useState({
                                title: props.children.title,
                                content: props.children.content });
    

    const handleSubmit = useCallback((e) => {
        /*
        * To prevent browser from reloading after submition
        */
        e.preventDefault()
        props.updateNews({
            ...props.children,
            ...value
        })
    })

    const handleChange = useCallback((e) => {
       console.log(`data gathered from multiple inputs: ${value}`)

       setValue({
           ...value,
           [e.target.id]: e.target.value,
       })
    })

    return props.active ? <form onSubmit={handleSubmit} className="newsAccordion">
                            <label htmlFor="title">Tytul</label>
                            <textarea id="title" name="title" rows="1" onChange={handleChange} value={value.title}/>

                            <br></br>

                            <label htmlFor="content">Tresc</label>
                            <textarea id="content" name="content" rows="10" onChange={handleChange} value={value.content}/>

                            <button type="submit">Zapisz</button>
                          </form>
                        : <div style={inactiveStyle}></div>
}