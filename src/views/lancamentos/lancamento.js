import React from "react";
import {withRouter} from 'react-router-dom'
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";

import Card from "../../componentes/card";
import FormGroup from "../../componentes/form-group";
import SelectMenu from "../../componentes/selectMenu";
import { mensagemAlerta, mensagemErro, mensagemSucesso } from "../../componentes/toastr";
import LancamentosTable from "./lancamentosTable";

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class Lancamento extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService()
    }

    buscar = () => {
        if (!this.state.ano) {
            mensagemErro('Para realizar a busca e preciso digitar um ano')
            return false
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario:usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data
                if (lista.length < 1) {
                    mensagemAlerta("Nenhum resultado encontrado")
                }
                this.setState({lancamentos: resposta.data})
            }).catch(error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento})
    }

    cancelarDelacao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {}})

    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1)
                this.setState({lancamentos: lancamentos, showConfirmDialog: false})
                mensagemSucesso('laçamento deletado com sucesso')
            }).catch(error => {
                mensagemErro('Ocorreu um erro ao tentar deletar o Lançamento')
            })
    }
    
    irCadastrarLancamento = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const  lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento)
                if (index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento
                    this.setState({lancamentos})
                }
                mensagemSucesso('Status atualizado com sucesso!')
            }).catch(error => {
                mensagemErro(error.response.data)
            })
    }

    render() {

        const meses = this.service.obterListMeses()
        const tipos = this.service.obterListTipos()

        const confirmeDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={this.cancelarDelacao} />
            </div>
        );

        return (
            <Card title="Busca Lançamento">
                 <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputDescricao" label="Descricao: ">
                                <input  type="text" className="form-control" id="inputDescricao" value={this.state.descricao}
                                        onChange={e => this.setState({descricao: e.target.value})} placeholder="Digite a Descrição"/>
                            </FormGroup>

                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input  type="text" className="form-control" id="inputAno" value={this.state.ano}
                                        onChange={e => this.setState({ano: e.target.value})} placeholder="Digite o Ano"/>
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes" value={this.state.mes} onChange={e => this.setState({mes: e.target.value})}
                                            className="form-control" lista={meses}/>
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: ">
                                <SelectMenu id="inputTipo" value={this.state.tipo} onChange={e => this.setState({tipo: e.target.value})}
                                            className="form-control" lista={tipos}/>
                            </FormGroup>

                            <button onClick={this.buscar} type="button" className="btn btn-success"><i className="pi pi-search"></i> Buscar</button>
                            <button onClick={this.irCadastrarLancamento} type="button" className="btn btn-danger"><i className="pi pi-plus"></i> Cadastrar</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="page-header">
                            <h1 id="tables"></h1>
                        </div>

                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} deleteAction={this.abrirConfirmacao} 
                                                editarAction={this.editar} alterarStatus={this.alterarStatus}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Delatar" visible={this.state.showConfirmDialog} 
                            style={{ width: '50vw' }} modal={true}
                            footer={confirmeDialogFooter}
                            onHide={() => this.setState({showConfirmDialog: false})}>
                       Confirmar a exclusão deste Lançamento?
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(Lancamento)