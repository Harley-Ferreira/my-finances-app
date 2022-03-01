import React from "react";
import { withRouter } from "react-router-dom";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";
import Card from "../../componentes/card";
import FormGroup from "../../componentes/form-group";
import SelectMenu from "../../componentes/selectMenu";
import { mensagemErro, mensagemSucesso } from "../../componentes/toastr";

class CadastroLancamentos extends React.Component {
    
    state = {
        id: null,
        descricao: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super()
        this.service = new LancamentoService()
    }

    componentDidMount() {
        const params = this.props.match.params
        if (params.id) {
            this.service.obterPorId(params.id)
                .then(response => {
                    this.setState({...response.data, atualizando: true})
                }).catch(error => {
                    mensagemErro(error.response.data)
                })
        }
    }

    submit = () => {

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const {descricao, valor, mes, ano, tipo} = this.state;
        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id };

        try {
            this.service.validar(lancamento)
        } catch(erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => mensagemErro(msg));
            return false
        }
        
        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/lancamentos')
                mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error => {
                mensagemErro(error.response.data)
            })
    }

    atualizar = () => {
        const {descricao, valor, mes, ano, tipo, status, id, usuario} = this.state
        const lancamento = { descricao, valor, mes, ano, tipo, status, id, usuario }
        
        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/lancamentos')
                mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => {
                mensagemErro(error.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name

        this.setState({[name] : value})
    }

    render() {

        const tipos = this.service.obterListTipos()
        const meses = this.service.obterListMeses()

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                    <FormGroup id="inputDescricao" label="Descrição: *">
                        <input id="inputDescricao" type="text" className="form-control" name="descricao" value={this.state.descricao} onChange={this.handleChange}/>
                    </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="text" className="form-control" name="ano" value={this.state.ano} onChange={this.handleChange}/>
                        </FormGroup>
                    </div>

                    <div className="col-md-6">
                         <FormGroup id="inputMes" label="Mes: *">
                            <SelectMenu id="inputMes" lista={meses} className="form-control" name="mes" value={this.state.mes} onChange={this.handleChange}/>
                        </FormGroup>      
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" className="form-control" name="valor" value={this.state.valor} onChange={this.handleChange}/>
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                         <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" lista={tipos} className="form-control" name="tipo" value={this.state.tipo} onChange={this.handleChange}/>
                        </FormGroup>      
                    </div>

                    <div className="col-md-4">
                         <FormGroup id="inputStatus" label="Status: ">
                            <input type="text" className="form-control" disabled name="status" value={this.state.status}/>
                        </FormGroup> 
                        <br/>     
                    </div>
                                        
                    <div className="row">
                        <div className="col-md-6">
                            {this.state.atualizando ? (
                                <button onClick={this.atualizar} className="btn btn-primary">
                                    <i className="pi pi-refresh"></i> Atualizar
                                </button>
                            ) : (
                                <button onClick={this.submit} className="btn btn-success">
                                    <i className="pi pi-save"></i> Salvar
                                </button>)
                            }
                            <button onClick={e => this.props.history.push('/lancamentos')} className="btn btn-danger">
                                <i className="pi pi-times"></i> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos)