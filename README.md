##App Movimentação

Protótipo de integração com sistema legado de controle patrimonial, desenvolvido com foco em organização arquitetural e automação de processos.

---

##Objetivo

Este projeto tem como finalidade simular e implementar a comunicação com um sistema legado de gestão patrimonial, permitindo:

* Autenticação automatizada no sistema externo
* Consulta de bens patrimoniais
* Listagem de locais e usuários
* Registro de movimentações
* Integração entre backend e aplicação mobile

---

##Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** no backend, com separação clara de responsabilidades:

* **Controllers** → Controle das requisições
* **Services** → Regras de negócio
* **Repositories** → Acesso a dados
* **Routes** → Definição das rotas da API

---

##Tecnologias utilizadas

## Backend

* Node.js
* Express
* JWT (autenticação)
* Playwright (automação de login no sistema legado)

## Mobile

* React Native
* Expo

---

## Autenticação

A autenticação é realizada em duas etapas:

1. Login no sistema legado via automação (Playwright)
2. Geração de token JWT para controle de acesso interno

---

## Rotas principais

| Método | Rota           | Descrição            |
| ------ | -------------- | -------------------- |
| POST   | /login         | Autenticação         |
| GET    | /bens          | Listar bens          |
| GET    | /locais        | Listar locais        |
| GET    | /usuarios      | Listar usuários      |
| GET    | /movimentacoes | Listar movimentações |
| POST   | /movimentacoes | Criar movimentação   |

---

## Como executar o projeto

### Backend

```bash
cd server
npm install
node src/server.js
```

---

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `server/` com as seguintes variáveis:

```env
CPF=
PASSWORD=
JWT_SECRET=
```

---

## Observações

* O projeto utiliza automação para interação com sistema legado
* Estrutura pensada para fácil escalabilidade
* Separação entre frontend mobile e backend API

---

## Possíveis melhorias

* Implementação de banco de dados próprio
* Cache de sessões
* Logs estruturados
* Deploy em ambiente cloud
* Integração com leitura de código de barras/QR Code

---

## Autor

Bruno Capuco

