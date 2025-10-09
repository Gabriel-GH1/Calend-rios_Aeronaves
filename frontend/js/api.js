// frontend/js/api.js - Arquivo dedicado para API
const API_URL = 'http://localhost:3001/api/aeronaves';

// Dados locais como fallback (SEUS DADOS ATUAIS)
const localAircraftData = {
    'pp-fcf': {
        prefix: 'PP-FCF',
        entrada: new Date(2025, 6, 21),
        saida: new Date(2025, 8, 16),
        info: "CVA + DOC44- Concluída com atraso"
    },
    'pr-msz': {
        prefix: 'PR-MSZ',
        entrada: new Date(2025, 7, 8),
        saida: new Date(2025, 7, 29),
        info: "Pane Precooler + CVA"
    },
    'pp-emo': {
        prefix: 'PP-EMO',
        entrada: new Date(2025, 7, 15),
        saida: new Date(2025, 7, 29),
        info: "Manutenção CVA"
    },
    'ps-ece': {
        prefix: 'PS-ECE',
        entrada: new Date(2025, 7, 15),
        saida: new Date(2025, 7, 27),
        info: "Manutenção CVA"
    },
    'pr-rex': {
        prefix: 'PR-REX',
        entrada: new Date(2025, 3, 9),
        saida: new Date(2025, 7, 14),
        info: "Manutenção CVA"
    },
    'pr-arb': {
        prefix: 'PR-ARB',
        entrada: new Date(2025, 1, 10),
        saida: new Date(2025, 9, 7),
        info: "Manutenção CVA"
    },
    'pr-day': {
        prefix: 'PR-DAY',
        entrada: new Date(2025, 8, 18),
        saida: new Date(2025, 8, 30),
        info: "Manutenção CVA"
    },
    'pr-fil': {
        prefix: 'PR-FIL',
        entrada: new Date(2025, 9, 1),
        saida: new Date(2025, 11, 1),
        info: "Manutenção 15 Anos + CVA"
    },
    'pr-eft': {
        prefix: 'PR-EFT',
        entrada: new Date(2025, 9, 10),
        saida: new Date(2025, 9, 31),
        info: "CVA + Intervalos"
    }
};

// Buscar dados da API
async function fetchAircraftData() {
    try {
        console.log('🔄 Buscando dados da API...');
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos da API:', Object.keys(data).length, 'aeronaves');
        return data;
    } catch (error) {
        console.error('❌ Erro ao buscar dados da API:', error);
        console.log('🔄 Usando dados locais como fallback');
        return localAircraftData;
    }
}

// Converter dados da API para o formato que seu código espera
function parseAPIData(apiData) {
    const parsedData = {};
    
    for (const [key, aircraft] of Object.entries(apiData)) {
        parsedData[key] = {
            prefix: aircraft.prefix,
            entrada: new Date(aircraft.entrada + 'T00:00:00'),
            saida: new Date(aircraft.saida + 'T00:00:00'),
            info: aircraft.info
        };
    }
    
    return parsedData;
}

// Exportar funções
window.API = {
    fetchAircraftData,
    parseAPIData
};