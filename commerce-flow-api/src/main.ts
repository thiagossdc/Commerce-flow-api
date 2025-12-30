import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configs globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new AllExceptionsFilter());

  // config CORS
  app.enableCors();

  // config Swagger
  const config = new DocumentBuilder()
    .setTitle('CommerceFlow API')
    .setDescription('API completa para gestão de comércio eletrônico')
    .setVersion('1.0')
    .addTag('customers', 'Operações relacionadas aos clientes')
    .addTag('orders', 'Operações relacionadas aos pedidos')
    .addTag('reports', 'Relatórios e estatísticas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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

// Exporta a função bootstrap para testes
export { bootstrap };

bootstrap();
