import ApiService from "../apiservice";
import ErroValidadcao from "../exception/ErroValidacao";

class UsuarioService extends ApiService {

    constructor() {
        super('/api/usuarios')
    }

    autenticar(credenciais) {
        return this.post('/autenticar', credenciais)
    }

    obterSaldoPorUsuario(id) {
        return this.get(`/${id}/saldo`)
    }

    salvar(usuario) {
        return this.post('/', usuario)
    }

    validar(usuario) {
        const erros = []

        if (!usuario.nome) {
            erros.push('O campo Nome é obrigatório.')
        }

        if (!usuario.email) {
            erros.push(' O campo Email é obrigatorio.')
        } else if (!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push('Informe um Email válido')
        }

        if (!usuario.senha || !usuario.senhaRepeticao) {
            erros.push('Preencha os campos de senha')
        } else if (usuario.senha !== usuario.senhaRepeticao) {
            erros.push('Senhas diferentes')
        }

        if (erros && erros.length > 0) {
            throw new ErroValidadcao(erros)
        }
    }
}

export default UsuarioService 