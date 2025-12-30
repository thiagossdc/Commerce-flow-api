"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRunnerController = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let TestRunnerController = class TestRunnerController {
    getTestRunner() {
        return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CommerceFlow - Painel de Controle</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: auto;
                padding: 20px;
            }

            .container {
                text-align: center;
                background: rgba(255, 255, 255, 0.95);
                padding: 3rem;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 600px;
                width: 100%;
                animation: fadeInUp 0.8s ease-out;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .logo {
                font-size: 2.5rem;
                font-weight: 700;
                background: linear-gradient(45deg, #667eea, #764ba2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 1rem;
                animation: glow 2s ease-in-out infinite alternate;
            }

            @keyframes glow {
                from {
                    text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
                }
                to {
                    text-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
                }
            }

            .subtitle {
                color: #666;
                font-size: 1.1rem;
                margin-bottom: 2rem;
                font-weight: 300;
            }

            .button {
                display: inline-block;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                border: none;
                cursor: pointer;
                margin: 10px;
                animation: pulse 2s infinite;
            }

            .button:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
                background: linear-gradient(45deg, #5a6fd8, #6a4190);
            }

            @keyframes pulse {
                0% {
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }
                50% {
                    box-shadow: 0 8px 35px rgba(102, 126, 234, 0.5);
                }
                100% {
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }
            }

            .results {
                background: rgba(102, 126, 234, 0.05);
                border: 1px solid rgba(102, 126, 234, 0.1);
                border-radius: 10px;
                padding: 1rem;
                margin-top: 2rem;
                text-align: left;
                max-height: 400px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                white-space: pre-wrap;
                display: none;
            }

            .loading {
                display: none;
                color: #667eea;
                font-weight: 600;
                margin-top: 1rem;
            }

            .footer {
                margin-top: 2rem;
                font-size: 0.8rem;
                color: #999;
                line-height: 1.4;
            }

            @media (max-width: 600px) {
                .container {
                    padding: 2rem;
                    margin: 1rem;
                }

                .logo {
                    font-size: 2rem;
                }

                .button {
                    display: block;
                    width: 100%;
                    margin: 10px 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="logo">CommerceFlow</h1>
            <p class="subtitle">Painel de Controle da API</p>

            <div>
                <a href="/api" class="button">📚 Documentação Swagger</a>
                <button class="button" onclick="runTests()">🧪 Executar Testes Unitários</button>
            </div>

            <div class="loading" id="loading">Executando testes... Por favor, aguarde.</div>

            <div class="results" id="results"></div>

            <div class="footer">
                <p>🚀 Desenvolvido por Thiago Carvalho utilizando NestJS</p>
            </div>
        </div>

        <script>
            async function runTests() {
                const loading = document.getElementById('loading');
                const results = document.getElementById('results');

                loading.style.display = 'block';
                results.style.display = 'none';
                results.textContent = '';

                try {
                    const response = await fetch('/test-runner/run', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();

                    results.textContent = data.output + '\\n' + data.error;
                    results.style.display = 'block';
                } catch (error) {
                    results.textContent = 'Erro ao executar testes: ' + error.message;
                    results.style.display = 'block';
                } finally {
                    loading.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>
    `;
    }
    async runTests() {
        try {
            const { stdout, stderr } = await execAsync('npm run test');
            return { output: stdout, error: stderr };
        }
        catch (error) {
            return { output: error.stdout || '', error: error.stderr || error.message };
        }
    }
};
exports.TestRunnerController = TestRunnerController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Content-Type', 'text/html'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], TestRunnerController.prototype, "getTestRunner", null);
__decorate([
    (0, common_1.Post)('run'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestRunnerController.prototype, "runTests", null);
exports.TestRunnerController = TestRunnerController = __decorate([
    (0, common_1.Controller)('test-runner')
], TestRunnerController);
//# sourceMappingURL=test-runner.controller.js.map