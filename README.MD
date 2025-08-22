# MOBS2 – Painel de Acompanhamento de Veículos

## Descrição

O MOBS2 é uma aplicação completa para visualização de veículos em tempo real com dados de telemetria e histórico de posições. Ela é composta por:

- **Backend Laravel**: cadastro de veículos e autenticação via JWT.
- **Backend NestJS**: fornece telemetria simulada dos veículos a cada 5 segundos.
- **Frontend Vue 3 (Composition API + TypeScript + Sass)**: painel de acompanhamento com Google Maps.
- **Banco de dados**: PostgreSQL (ou SQL Server).
- **Docker**: todos os serviços podem ser executados via contêineres para facilitar instalação e consistência de ambiente.

## Funcionalidades

### Laravel

- CRUD de veículos (placa, modelo, fabricante, ano).
- Autenticação de usuários via JWT.
- Apenas usuários autenticados podem acessar os endpoints de cadastro.
- Implementa testes unitários básicos.

### NestJS

- Simula posições de veículos a cada 5 segundos (latitude, longitude, velocidade, combustível).
- WebSocket para atualização em tempo real (diferencial).
- Implementa testes unitários básicos.

### Vue 3 (Frontend)

- Login e registro de usuários.
- Visualização de veículos no Google Maps.

  - Placa, velocidade, combustível, hora da última atualização.
  - Popup com detalhes ao clicar em um marcador.
  - Polilinha com histórico de posições.

- Busca por placa.
- Botão para mostrar/ocultar histórico.

## Configuração de Ambiente

### Laravel (.env)

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:kvKidUEg0NknL/kiPYzOooylg4scXp0OflFtVopVTbY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=mobs
DB_USERNAME=postgres
DB_PASSWORD=secret

JWT_SECRET=bzFdVa0zz1VzkuynqX9n39sSfcCmLHxsahIZVhLXrcPWzHAorrtTg77cSNTlxh4S
```

### NestJS (.env)

```env
LARAVEL_API_URL=http://web
```

### Frontend Vue 3 (.env)

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

## Execução via Docker

1. Certifique-se de que o Docker e Docker Compose estão instalados.
2. Configure os arquivos `.env` para Laravel, NestJS e Frontend conforme acima.
3. Execute:

```bash
docker-compose up --build
```

4. O frontend estará disponível em `http://localhost:5173`.
5. Laravel em `http://localhost:8000`.
6. NestJS em `http://localhost:3000`.

## Observações

- Todos os serviços dependem de que as APIs estejam disponíveis antes de iniciar o frontend.
- O Google Maps só será carregado se a chave de API estiver configurada.
- A aplicação possui verificação de status das APIs e exibe mensagens de loading enquanto espera os serviços estarem prontos.

## Documentação das APIs

### Laravel

A documentação detalhada do Laravel está disponível via Swagger na url:

```
http://localhost:8000/api/documentation
```

### NestJS

A rota principal para obter telemetria é:

```
GET http://localhost:3000/telemetry/{placa-do-carro}
```

Essa rota espera receber o **Bearer token** do usuário autenticado via Laravel e retorna os dados de telemetria do veículo correspondente.

### Testes

Os testes foram implementados para o backend Laravel.
Para rodar os testes do Laravel, use o comando:

```
docker-compose exec app php artisan test
```

o teste deve ser rodado dentro do docker pra poder ter acesso ao banco de dados!

### Observações

Se restar alguma dúvida em relação ao código do NestJS, dê uma olhada neste outro projeto onde o foco era somente NestJS, e nele consegui implementar todas as funcionalidades necessárias:
[transactions-api](https://github.com/JoaumVictor/transactions-api)

Se restar dúvida em relação à qualidade do meu frontend, pode ver este outro projeto meu que já está em produção, uma livraria online:
[Editor Balaozinho](https://www.editorabalaozinho.com/pt-BR)

Em relação ao Laravel, foi onde mais passei meu tempo, pois nunca tinha usado essa tecnologia. Foram 4 dias alternando entre versões do Laravel, resolvendo erro de CORS, erro na geração das migrations, erro na geração do Swagger, permissões que o Laravel exigia e que eu não fazia ideia. Foi onde mais quebrei a cabeça!
