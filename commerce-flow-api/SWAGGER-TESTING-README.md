# 🧪 Testes para Swagger - CommerceFlow API

Este documento explica como utilizar os arquivos de teste gerados para testar a API CommerceFlow através do Swagger UI.

## 📋 Arquivos Disponíveis

### 1. `swagger-tests.json`
Coleção completa de testes no formato Postman Collection v2.1, compatível com importação no Postman ou outras ferramentas de teste de API.

### 2. `swagger-examples.json`
Arquivo JSON simplificado com exemplos organizados por endpoint, ideal para copiar e colar diretamente no Swagger UI.

## 🚀 Como Usar no Swagger UI

### Passo 1: Iniciar a Aplicação
```bash
cd backend-test
npm install
npm run start:dev
```

### Passo 2: Acessar o Swagger
- Abra seu navegador em: `http://localhost:3000/api`
- Ou acesse através da página inicial: `http://localhost:3000`

### Passo 3: Testar os Endpoints

#### 📝 Método 1: Usando os Exemplos Diretos (Recomendado)

Para cada endpoint no Swagger UI, copie os exemplos do arquivo `swagger-examples.json`:

1. **Criar Cliente:**
   - Vá para `POST /customers`
   - Clique em "Try it out"
   - Cole o conteúdo de `customers.create.payload` no campo de request

2. **Criar Pedido:**
   - Vá para `POST /orders`
   - Use o `customerId` retornado da criação do cliente
   - Cole o conteúdo de `orders.create.payload`

3. **Outros endpoints:**
   - Use os exemplos apropriados de `swagger-examples.json`

#### 📝 Método 2: Importar Coleção no Postman

1. Abra o Postman
2. Clique em "Import"
3. Selecione "File"
4. Escolha o arquivo `swagger-tests.json`
5. Configure a variável `baseUrl` para `http://localhost:3000`
6. Execute os testes na ordem sugerida

## 📊 Endpoints Disponíveis

### 👥 Clientes (`/customers`)
- `POST /customers` - Criar cliente
- `GET /customers` - Listar todos os clientes
- `GET /customers/{id}` - Buscar cliente por ID
- `PATCH /customers/{id}` - Atualizar cliente
- `DELETE /customers/{id}` - Deletar cliente

### 📦 Pedidos (`/orders`)
- `POST /orders` - Criar pedido
- `GET /orders/exchange-rate` - Obter taxa de câmbio USD/BRL
- `GET /orders` - Listar pedidos (com paginação opcional)
- `GET /orders/{id}` - Buscar pedido por ID
- `PATCH /orders/{id}` - Atualizar pedido
- `DELETE /orders/{id}` - Deletar pedido
- `POST /orders/{id}/comprovante` - Upload de comprovante

### 📊 Relatórios (`/relatorios`)
- `GET /relatorios/top-clientes` - Relatório dos top clientes

## 🔄 Fluxo de Teste Completo

Siga este fluxo para testar completamente a API:

1. **Criar Cliente** → `POST /customers`
   ```json
   {
     "name": "João Silva",
     "email": "joao.silva@email.com",
     "country": "Brasil"
   }
   ```

2. **Copiar ID do Cliente** retornado na resposta

3. **Criar Pedido** → `POST /orders`
   ```json
   {
     "customerId": "ID_DO_CLIENTE_AQUI",
     "date": "2025-12-30",
     "items": [
       {
         "product": "Notebook Dell",
         "quantity": 1,
         "precoUnitarioUSD": 1200.00
       }
     ]
   }
   ```

4. **Listar Pedidos** → `GET /orders`

5. **Buscar Pedido Específico** → `GET /orders/{id}`

6. **Verificar Taxa de Câmbio** → `GET /orders/exchange-rate`

7. **Ver Relatório** → `GET /relatorios/top-clientes`

8. **Atualizar Pedido** → `PATCH /orders/{id}`

9. **Upload de Comprovante** → `POST /orders/{id}/comprovante` (form-data)

10. **Limpeza**: Deletar pedido e cliente

## ⚠️ Casos de Erro para Testar

Use os exemplos da seção `error_examples` para testar validações:

- **Cliente com dados inválidos**: email incorreto, campos vazios
- **Pedido com customerId inexistente**: deve retornar erro
- **Pedido com dados inválidos**: data incorreta, array de itens vazio

## 📝 Parâmetros de Paginação

Para endpoints que suportam paginação:

- `page`: Número da página (inicia em 1)
- `limit`: Quantidade de itens por página

Exemplos:
- `GET /orders?page=1&limit=10`
- `GET /orders?page=2&limit=5`

## 🔧 Dicas Úteis

1. **IDs Dinâmicos**: Sempre use IDs retornados pelas operações de criação
2. **Ordem de Testes**: Siga a ordem do fluxo para evitar dependências quebradas
3. **Headers**: A maioria dos endpoints POST/PATCH requer `Content-Type: application/json`
4. **Upload de Arquivos**: Use `Content-Type: multipart/form-data` para uploads
5. **Validações**: Teste sempre casos de erro para validar as validações da API

## 🎯 Exemplos Prontos para Uso

Todos os exemplos estão organizados em `swagger-examples.json` com:
- Descrições claras
- Payloads completos
- Casos alternativos
- Exemplos de erro

Basta copiar e colar diretamente no Swagger UI!

---

**💡 Dica**: Mantenha estes arquivos junto ao código da API para facilitar os testes durante o desenvolvimento.
