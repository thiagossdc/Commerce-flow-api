"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CommerceFlow API')
        .setDescription('API completa para gestão de comércio eletrônico')
        .setVersion('1.0')
        .addTag('customers', 'Operações relacionadas aos clientes')
        .addTag('orders', 'Operações relacionadas aos pedidos')
        .addTag('reports', 'Relatórios e estatísticas')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`
🚀 CommerceFlow API está rodando!

📍 URLs de Acesso:
   • Swagger:    http://localhost:${port}/api
   • interface gráfica: http://localhost:${port}/test-runner

📚 Endpoints disponíveis:
   • Clientes:        http://localhost:${port}/customers
   • Pedidos:         http://localhost:${port}/orders
   • Relatórios:      http://localhost:${port}/relatorios

🧪 Para executar testes: npm run test
  `);
}
bootstrap();
//# sourceMappingURL=main.js.map