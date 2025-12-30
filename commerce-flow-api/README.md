# Backend Test - NestJS API

Este projeto é uma API REST completa construída com NestJS para gerenciamento de clientes e pedidos, implementando todas as funcionalidades solicitadas no teste de desenvolvedor backend júnior.

## Funcionalidades Implementadas ✅

- **CRUD completo** para clientes e pedidos com validações
- **Cálculo automático** de totais em USD e conversão para BRL via API externa
- **Upload de comprovantes** para S3 (simulado localmente para desenvolvimento)
- **Processamento assíncrono** de notificações via Bull/Redis
- **Relatórios** de top clientes por valor gasto
- **Documentação Swagger** completa
- **Tratamento de erros global**
- **Validações robustas** com class-validator
- **Paginação** nos endpoints de listagem
- **Arquitetura modular** com injeção de dependências

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **MongoDB + Mongoose** - Banco de dados e ODM
- **Redis + Bull** - Fila de mensagens assíncronas
- **AWS S3 SDK** - Upload de arquivos (simulado)
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP para APIs externas
- **Class-validator/Transformer** - Validações e transformação de dados
- **Swagger** - Documentação automática da API

## Configuração do Ambiente

### Pré-requisitos

- **Node.js** (versão 16+)
- **MongoDB** (local ou Atlas)
- **Redis** (local ou serviço)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd backend-test
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Copie `.env.example` para `.env`
   - Configure as variáveis necessárias:
   ```env
   DATABASE_URI=mongodb://localhost:27017/backend-test
   REDIS_HOST=localhost
   REDIS_PORT=6379
   # AWS S3 (opcional - simulado se não configurado)
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   S3_BUCKET=your-bucket
   ```

### Iniciando Serviços Externos

#### MongoDB Local (Docker)
```bash
# Usando Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou usando Docker Compose
docker-compose up -d mongodb
```

#### Redis Local (Docker)
```bash
# Usando Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Ou usando Docker Compose
docker-compose up -d redis
```

#### Atlas MongoDB (Nuvem)
- Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Configure o cluster e obtenha a connection string
- Atualize `DATABASE_URI` no `.env`

### Executando a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará disponível em:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api

## Uso da API

### Endpoints Principais

#### Clientes
- `POST /customers` - Criar cliente
- `GET /customers` - Listar todos os clientes
- `GET /customers/:id` - Buscar cliente por ID
- `PATCH /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Remover cliente

#### Pedidos
- `POST /orders` - Criar pedido (calcula totais automaticamente)
- `GET /orders` - Listar pedidos com paginação (?page=1&limit=10)
- `GET /orders/:id` - Buscar pedido por ID
- `PATCH /orders/:id` - Atualizar pedido
- `DELETE /orders/:id` - Remover pedido
- `POST /orders/:id/comprovante` - Upload de comprovante (multipart/form-data)

#### Relatórios
- `GET /relatorios/top-clientes` - Top clientes por valor gasto (?top=10)

### Exemplo de Uso

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

## Arquitetura do Projeto

```
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
├── s3/                        # Módulo S3
│   ├── s3.service.ts
│   └── s3.module.ts
└── reports/                   # Controlador de relatórios
    └── reports.controller.ts
```

## Funcionalidades Técnicas

### Validações Automáticas
- Todos os DTOs usam `class-validator` para validações
- Pipe global remove campos não permitidos
- Transformação automática de tipos

### Tratamento de Erros
- Filtro global padroniza respostas de erro
- Logs detalhados para debugging
- Tratamento específico de validações

### Processamento Assíncrono
- Pedidos criam jobs na fila automaticamente
- Simulação de envio de emails
- Logs de processamento e falhas

### Upload de Arquivos
- Suporte a multipart/form-data
- Simulação de S3 para desenvolvimento
- Fácil troca para AWS S3 em produção

### Paginação
- Suporte a `?page=1&limit=10`
- Padrão RESTful

## Desenvolvimento e Testes

### Scripts Disponíveis
```bash
npm run start:dev      # Desenvolvimento com hot-reload
npm run build          # Build para produção
npm run start:prod     # Executar build de produção
npm run lint           # Verificar código com ESLint
npm run format         # Formatar código com Prettier
```

### Testes
- Estrutura preparada para testes unitários e e2e
- Configuração Jest incluída
- Arquivos `.spec.ts` podem ser criados conforme necessário

## Melhorias Implementadas

- ✅ Arquitetura modular e escalável
- ✅ Separação clara de responsabilidades
- ✅ Injeção de dependências
- ✅ Validações robustas
- ✅ Tratamento de erros global
- ✅ Documentação automática
- ✅ CORS habilitado
- ✅ Logs detalhados
- ✅ Configuração flexível via ambiente

## Próximas Melhorias Possíveis

- Autenticação JWT
- Testes automatizados
- Cache com Redis
- Rate limiting
- Health checks
- Logs estruturados
- Docker Compose completo
- CI/CD pipeline
- Monitoramento e métricas

---

**Nota**: Este projeto foi desenvolvido como solução completa para o teste de desenvolvedor backend júnior, implementando todas as funcionalidades solicitadas com boas práticas de desenvolvimento.
