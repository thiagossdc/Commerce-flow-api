# CommerceFlow API

## 📋 Descrição

A __CommerceFlow API__ é uma aplicação backend robusta e completa, desenvolvida utilizando o framework __NestJS__, que oferece uma solução escalável e eficiente para o gerenciamento de operações comerciais. Com foco na administração de clientes e pedidos, a API integra tecnologias modernas para garantir alta performance, segurança e facilidade de manutenção. Este projeto implementa operações CRUD completas, cálculos automáticos de valores com conversão de moedas em tempo real, processamento assíncrono de notificações, upload de arquivos para armazenamento em nuvem e geração de relatórios analíticos.

## ✨ Funcionalidades Implementadas

- ✅ __CRUD completo__ para clientes e pedidos com validações rigorosas
- ✅ __Cálculo automático__ de totais em USD e conversão para BRL via API externa
- ✅ __Upload de comprovantes__ para S3 (simulado localmente para desenvolvimento)
- ✅ __Processamento assíncrono__ de notificações via Bull/Redis
- ✅ __Relatórios__ de top clientes por valor gasto
- ✅ __Documentação Swagger__ completa e interativa
- ✅ __Tratamento global de erros__ com respostas padronizadas
- ✅ __Validações robustas__ utilizando class-validator
- ✅ __Paginação__ nos endpoints de listagem
- ✅ __Arquitetura modular__ com injeção de dependências
- ✅ __Interface web__ para execução de testes e acesso à documentação

## 🛠️ Tecnologias Utilizadas

- __NestJS__ - Framework Node.js para aplicações escaláveis
- __MongoDB + Mongoose__ - Banco de dados NoSQL e ODM
- __Redis + BullMQ__ - Sistema de filas para processamento assíncrono
- __AWS S3 SDK__ - Armazenamento de arquivos em nuvem
- __TypeScript__ - Tipagem estática para maior robustez
- __Axios__ - Cliente HTTP para integrações externas
- __Class-validator/Transformer__ - Validações e transformação de dados
- __Swagger__ - Documentação automática da API
- __Jest__ - Framework de testes unitários
- __Docker__ - Conteinerização para ambientes de desenvolvimento

## 📦 Instalação e Configuração

### Pré-requisitos

- __Node.js__ (versão 20+)
- __MongoDB__ (local ou Atlas)
- __Redis__ (local ou serviço em nuvem)

### Passos de Instalação

1. __Clone o repositório__

   ```bash
   git clone https://github.com/thiagossdc/Commerce-flow-api.git
   cd commerce-flow-api
   ```

2. __Instale as dependências__

   ```bash
   npm install
   ```

3. __Configure as variáveis de ambiente__

   - Copie o arquivo `.env.example` para `.env`
   - Configure as variáveis necessárias:

   ```env
   DATABASE_URI=mongodb://localhost:27017/commerce-flow
   REDIS_HOST=localhost
   REDIS_PORT=6379
   # AWS S3 (opcional - simulado se não configurado)
   AWS_ACCESS_KEY_ID=sua-chave-aqui
   AWS_SECRET_ACCESS_KEY=seu-secreto-aqui
   AWS_REGION=us-east-1
   S3_BUCKET=seu-bucket-aqui
   PORT=3000
   ```

### Configuração de Serviços Externos

#### MongoDB Local (Docker)

```bash
# Usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou usando Docker Compose (se disponível)
docker-compose up -d mongodb
```

#### Redis Local (Docker)

```bash
# Usando Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Ou usando Docker Compose (se disponível)
docker-compose up -d redis
```

#### MongoDB Atlas (Nuvem)

- Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Configure o cluster e obtenha a connection string
- Atualize `DATABASE_URI` no arquivo `.env`

### Executando a Aplicação

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará disponível em:

- __API__: [](http://localhost:3000)<http://localhost:3000>
- __Documentação Swagger__: [](http://localhost:3000/api)<http://localhost:3000/api>
- __Interface de Testes__: [](http://localhost:3000/test-runner)<http://localhost:3000/test-runner>

## 📚 Uso da API

### Endpoints Principais

#### Clientes (`/customers`)

- `POST /customers` - Criar novo cliente
- `GET /customers` - Listar todos os clientes
- `GET /customers/:id` - Buscar cliente por ID
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Remover cliente

#### Pedidos (`/orders`)

- `POST /orders` - Criar pedido (calcula totais automaticamente)
- `GET /orders` - Listar pedidos com paginação (?page=1\&limit=10)
- `GET /orders/:id` - Buscar pedido por ID
- `GET /orders/exchange-rate` - Consultar taxa de câmbio atual
- `PATCH /orders/:id` - Atualizar pedido
- `DELETE /orders/:id` - Remover pedido
- `POST /orders/:id/comprovante` - Upload de comprovante (multipart/form-data)

#### Relatórios (`/relatorios`)

- `GET /relatorios/top-clientes` - Top clientes por valor gasto (?top=10)

### Exemplos de Uso

#### Criar Cliente

```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "country": "Brasil"
  }'
```

#### Criar Pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "64f...",
    "date": "2023-12-30",
    "items": [
      {
        "product": "Produto A",
        "quantity": 2,
        "precoUnitarioUSD": 50.00
      }
    ]
  }'
```

## 🏗️ Arquitetura do Projeto

```javascript
src/
├── app.module.ts              # Módulo principal
├── main.ts                    # Ponto de entrada da aplicação
├── common/
│   └── filters/
│       └── all-exceptions.filter.ts  # Tratamento global de erros
├── customers/                 # Módulo de clientes
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── customers.module.ts
│   ├── dto/
│   └── schemas/
├── orders/                    # Módulo de pedidos
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   ├── notificacao.processor.ts  # Processador de fila
│   ├── dto/
│   └── schemas/
├── s3/                        # Integração S3
│   ├── s3.service.ts
│   └── s3.module.ts
├── reports/                   # Relatórios
│   └── reports.controller.ts
└── test-runner/               # Interface de testes
    ├── test-runner.controller.ts
    └── test-runner.module.ts
```

### Estrutura Arquitetural

A aplicação segue os princípios de __arquitetura limpa__ e __separação de responsabilidades__:

- __Controllers__: Gerenciam requisições HTTP e respostas
- __Services__: Contêm lógica de negócio e interações com banco
- __Schemas__: Definem estruturas de dados no MongoDB
- __DTOs__: Especificam formatos de entrada/saída
- __Modules__: Organizam componentes relacionados
- __Processors__: Gerenciam tarefas assíncronas

## 🔄 Fluxo de Operação

### Criação de Pedidos

1. Cliente envia `POST /orders` com dados do pedido
2. Validação de DTO e verificação se cliente existe
3. Consulta taxa USD/BRL via API externa
4. Cálculo automático de totais
5. Salvamento no MongoDB
6. Adição de job na fila para notificação assíncrona
7. Simulação de envio de e-mail

### Upload de Comprovantes

1. Cliente faz upload via `POST /orders/:id/comprovante`
2. Arquivo enviado para AWS S3
3. URL pública gerada e salva no pedido
4. Resposta com dados atualizados

### Relatórios

1. Agregação MongoDB para calcular totais por cliente
2. Ordenação e limitação de resultados
3. Retorno de dados formatados

## 🧪 Desenvolvimento e Testes

### Scripts Disponíveis

```bash
npm run start:dev      # Desenvolvimento com hot-reload
npm run build          # Build para produção
npm run start:prod     # Executar build de produção
npm run lint           # Verificar código com ESLint
npm run format         # Formatar código com Prettier
npm run test           # Executar testes unitários
npm run test:watch     # Testes em modo watch
npm run test:cov       # Testes com relatório de cobertura
```

### Estratégia de Testes

- __Testes Unitários__: Cobrem controladores, serviços e utilitários
- __Mocks__: Simulam dependências externas (banco, APIs)
- __Cobertura__: Relatórios detalhados de cobertura de código
- __Jest__: Framework configurado com TypeScript

## 🔧 Configurações Técnicas

### Validações Globais

- Pipe `ValidationPipe` remove campos não permitidos
- Transformação automática de tipos
- Rejeição de dados inválidos

### Tratamento de Erros

- Filtro global padroniza respostas de erro
- Logs detalhados para debugging
- Tratamento específico de validações

### Segurança

- CORS habilitado
- Validações rigorosas de entrada
- Sanitização de dados

## 🌐 Integrações Externas

- __economia.awesomeapi.com.br__: API de câmbio USD/BRL com fallback
- __AWS S3__: Armazenamento de arquivos com URLs públicas
- __Redis + BullMQ__: Processamento assíncrono de notificações
- __MongoDB__: Persistência de dados principal


## 👨‍💻 Sobre o Desenvolvimento

Este projeto foi desenvolvido utilizando boas práticas de engenharia de software, com ênfase em código limpo, testabilidade e manutenibilidade. A ferramenta __Grok Code Fast__ foi utilizada exclusivamente para a criação de testes automatizados,documentação e para a revisão de código, assegurando qualidade e eficiência no processo de desenvolvimento, sem interferir na lógica principal da aplicação.

__Desenvolvido por Thiago Carvalho utilizando NestJS__ 🚀
