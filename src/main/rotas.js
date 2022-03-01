import React from "react";
import {Route, Switch, HashRouter, Redirect} from 'react-router-dom'

import Login from "../views/login";
import Home from "../views/home";
import Cadastro from "../views/cadastro";
import Lancamento from "../views/lancamentos/lancamento";
import cadastroLancamentos from "../views/lancamentos/cadastroLancamentos";
import { AuthConsumer } from "./provedorAutenticacao";

function RotaAutenticada({component: Component, isUsuarioAutenticado, ...props}) {
    return (
        <Route {...props} render={ (componentProps) => {
            if (isUsuarioAutenticado) {
                return (
                    <Component {...componentProps} />
                )
            } else {
                return(
                    <Redirect to={{pathname: '/login', state: {from: componentProps.location}}} />
                )
            }
        }} />
    )
}

function Rotas(props){
    return(
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/cadastro-usuario" component={Cadastro}/>
                
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/lancamentos" component={Lancamento}/>
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-lancamentos/:id?" component={cadastroLancamentos}/>
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        {(context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />)}
    </AuthConsumer>
)