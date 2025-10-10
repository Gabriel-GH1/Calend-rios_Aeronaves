# Calendário de Manutenção de Aeronaves v2.0

Sistema completo para controle e visualização do calendário de manutenção de aeronaves.

## 🚀 Funcionalidades

- **Backend API REST** com Node.js + Express
- **Frontend dinâmico** conectado à API
- **Calendários interativos** para cada aeronave
- **Dados em JSON** para fácil edição e manutenção
- **Sistema de abas** para navegação entre aeronaves

## 🛠️ Tecnologias

- **Backend:** Node.js, Express, CORS
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **API:** RESTful JSON
- **Desenvolvimento:** Live Server

## 📁 Estrutura do Projeto
Calendario_Aeronaves/
├── backend/
│ ├── src/data/
│ │ └── aircrafts.json # Dados das aeronaves
│ ├── server.js # Servidor da API
│ ├── package.json
│ └── package-lock.json
└── frontend/
├── js/
│ ├── api.js # Conexão com a API
│ └── script.js # Lógica do calendário
├── index.html # Página principal
├── style.css # Estilos
└── README.md

## 🚀 Como Executar

### 1. Backend (API)
```bash
cd backend
npm install
npm start
API rodará em: http://localhost:3002

2. Frontend
bash
cd frontend
# Use Live Server ou abra index.html diretamente
Frontend rodará em: http://localhost:5502 (ou porta similar)

📡 Endpoints da API
GET / - Informações da API

GET /api/aeronaves - Todas as aeronaves

GET /api/aeronaves/:id - Aeronave específica

GET /health - Status do servidor

✈️ Aeronaves Disponíveis
PP-FCF, PR-MSZ, PP-EMO, PS-ECE

PR-REX, PR-ARB, PR-DAY, PR-FIL, PR-EFT

🎨 Características do Calendário
Dias úteis destacados em verde

Dias de atraso destacados em vermelho

Tooltips informativas ao passar o mouse

Legenda explicativa para cores

Navegação por abas entre aeronaves

📊 Dados das Aeronaves
Cada aeronave possui:

Prefixo de identificação

Data de entrada em manutenção

Data de saída prevista

Informações específicas da manutenção

Cálculo de dias úteis

🔧 Desenvolvimento
Para modificar os dados, edite o arquivo:
backend/src/data/aircrafts.json

📄 Licença
Desenvolvido para controle interno de manutenção de aeronaves.

Desenvolvido por Gabriel GH | Atualizado em: 2025