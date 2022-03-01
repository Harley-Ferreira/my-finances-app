import React from "react";
import Card from "../componentes/card"
import FormGroup from "../componentes/form-group";
import {withRouter} from 'react-router-dom'
import UsuarioService from "../app/service/usuarioService";
import {mensagemErro} from '../componentes/toastr'
import { AuthContext } from "../main/provedorAutenticacao";


class Login extends React.Component {

    state = {
        email: '',
        senha: '',
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    entrar = async () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then(response => {
            this.context.iniciarSessao(response.data)
            //Se der certo o login, mando o user para tela home
            this.props.history.push('/home')
            //console.log(response)
        }).catch(erro => {
            mensagemErro(erro.response.data)
            //console.log(erro.response)
        })
        //console.log('Email: ', this.state.email)
        //console.log('Senha: ', this.state.senha)
    }

    prepareCadastrar = () => {
        this.props.history.push('/cadastro-usuario')
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6" style={{ position: 'relative', left: '300px' }}>
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                                <input type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="form-control" id="inputEmail"
                                                    aria-describedby="emailHelp" placeholder="Digite o Email" />
                                            </FormGroup>
                                            <FormGroup label="Senha: *" htmlFor="inputPassword">
                                                <input type="password" value={this.state.senha} onChange={e => this.setState({ senha: e.target.value })} className="form-control" id="inputPassword"
                                                    placeholder="Password" />
                                            </FormGroup>
                                            <button onClick={this.entrar} className="btn btn-success"><i className="pi pi-sign-in"></i> Entrar</button>
                                            <button onClick={this.prepareCadastrar} className="btn btn-danger"><i className="pi pi-plus"></i> Cadastrar</button>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextType = AuthContext

export default  withRouter (Login)