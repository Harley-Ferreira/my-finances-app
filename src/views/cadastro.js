import React from "react";

import {withRouter} from 'react-router-dom'
import UsuarioService from "../app/service/usuarioService";
import Card from "../componentes/card";
import FormGroup from "../componentes/form-group";
import { mensagemErro, mensagemSucesso } from "../componentes/toastr";

class Cadastro extends React.Component {

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService
    }

    cadastrar = () => {
        
        const {nome, senha, email, senhaRepeticao} = this.state
        const usuario = {nome, email, senha, senhaRepeticao}
    
        try {
            this.service.validar(usuario);
        } catch(erro) {
            const msgs = erro.mensagens
            msgs.forEach(msg => mensagemErro(msg));
            return false
        }

        this.service.salvar(usuario)
        .then(response => {
            mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.')
            this.props.history.push('/login')
        }).catch(error => {
            mensagemErro(error.response.data)
        })
    }

    cancelar = () => {
        this.props.history.push('/login')
    }

    render() {
        return (
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <fieldset>
                                <FormGroup label="Nome: *" htmlFor="inputNome">
                                    <input type="text"
                                        id="inputNome"
                                        className="form-control"
                                        nome="nome"
                                        onChange={e => this.setState({ nome: e.target.value })} />
                                </FormGroup>
                                <FormGroup label="Email: *">
                                    <input type="email"
                                        id="inputEmail"
                                        className="form-control"
                                        nome="email"
                                        onChange={e => this.setState({ email: e.target.value })} />
                                </FormGroup>
                                <FormGroup label="Senha: *" htmlFor="inputSenha">
                                    <input type="password"
                                        className="form-control"
                                        id="inputSenha"
                                        placeholder="Password"
                                        onChange={e => this.setState({ senha: e.target.value })} />
                                </FormGroup>
                                <FormGroup label="Repita a Senha: *" htmlFor="inputSenhaRepetida">
                                    <input type="password"
                                        className="form-control"
                                        id="inputSenhaRepetida"
                                        placeholder="Password"
                                        onChange={e => this.setState({ senhaRepeticao: e.target.value })} />
                                </FormGroup>
                                <button onClick={this.cadastrar} type="button" className="btn btn-success"><i className="pi pi-save"></i> Salvar</button>
                                <button onClick={this.cancelar} type="button" className="btn btn-danger"><i className="pi pi-times"></i> Cancelar</button>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter (Cadastro)