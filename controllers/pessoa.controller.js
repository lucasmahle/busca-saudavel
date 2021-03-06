const PessoaRepository = require('../repositories/pessoa.repository');
const AmizadeRepository = require('../repositories/amizade.repository');

class PessoaController {
    constructor() {
        this.pessoaRepository = new PessoaRepository();
        this.amizadeRepository = new AmizadeRepository();
    }

    async friends(req, res) {
        try {
            const friends = await this.amizadeRepository.findByPerson(req.header("id"));

            res.send({
                status: true,
                data: friends.map(friend => friend.pessoa2)
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao buscar dados'
            });
        }
    }

    async matchPerson(req, res) {
        try {
            const userId = req.header("id");
            const persons = await this.pessoaRepository.findPersonToMatch(userId);

            const availablePersons = persons.filter(person => !person.like.some(likePerson => likePerson.deu_like == userId));

            res.send({
                status: true,
                data: availablePersons.length > 0 ? availablePersons[0] : null
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao buscar dados'
            });
        }
    }

    async list(req, res) {
        try {
            const data = await this.pessoaRepository.findAll();

            res.send({
                status: true,
                data: data
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao buscar dados'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }

    async detail(req, res) {
        try {
            const data = await this.pessoaRepository.findById(req.header("id"));

            if (data == null) {
                return res.send({
                    status: false,
                    data: 'Não foi possível encontrar o registro'
                });
            }

            res.send({
                status: true,
                data: data
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao buscar dados'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }

    async create(req, res) {
        try {
            const { body } = req;
            await this.pessoaRepository.startSession();

            const pessoa = this.pessoaRepository.create();

            // Falta urls e tokens das redes sociais
            pessoa.nome = body.nome;
            pessoa.telefone = body.telefone;
            pessoa.bio = body.bio;
            pessoa.modalidade = body.modalidade;
            pessoa.ativo = true;


            await this.pessoaRepository.save(pessoa);

            await this.pessoaRepository.commitSession();
            res.send({
                status: true,
                user: pessoa
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao criar usuário'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }

    async update(req, res) {
        try {
            const { body, params } = req;
            await this.pessoaRepository.startSession();

            const pessoa = await this.pessoaRepository.findById(req.header("id"));

            if (pessoa == null) {
                return res.send({
                    status: false,
                    data: 'Não foi possível encontrar o registro'
                });
            }

            pessoa.nome = body.nome;
            pessoa.telefone = body.telefone;
            pessoa.bio = body.bio;
            pessoa.idade = body.idade;
            pessoa.modalidade = body.modalidade;
            pessoa.facebook_url = body.facebook;
            pessoa.instagram_url = body.instagram;
            
            await this.pessoaRepository.save(pessoa);

            await this.pessoaRepository.commitSession();
            res.send({
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao atualizar o dado'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }

    async delete(req, res) {
        try {
            const { body, params } = req;
            await this.pessoaRepository.startSession();

            const pessoa = await this.pessoaRepository.findById(params.id);

            if (pessoa == null) {
                return res.send({
                    status: false,
                    data: 'Não foi possível encontrar o registro'
                });
            }

            await this.pessoaRepository.destroy(pessoa);

            await this.pessoaRepository.commitSession();
            res.send({
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao deletar o dado'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }

    async deactivate(req, res) {
        try {
            const { params } = req;
            const pessoa = await this.pessoaRepository.findById(req.header("id"));

            await this.pessoaRepository.startSession();

            if (pessoa == null) {
                return res.send({
                    status: false,
                    data: 'Não foi possível encontrar o registro'
                });
            }

            pessoa.ativo = false;
            await this.pessoaRepository.save(pessoa);

            res.send({
                status: true,
            });
        } catch (error) {
            console.error(error);
            res.send({
                status: false,
                message: 'Falha ao buscar dados'
            });
        } finally {
            await this.pessoaRepository.endSession();
        }
    }
}

module.exports = PessoaController;