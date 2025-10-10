// ==================================================
// script.js CORRIGIDO - COM VARIÁVEIS GLOBAIS
// ==================================================

// Dados globais (serão preenchidos pela API) - ✅ CORRIGIDO
window.aircraftData = {};

// Função para carregar dados
async function loadAircraftData() {
    const apiData = await API.fetchAircraftData();
    window.aircraftData = API.parseAPIData(apiData); // ✅ CORRIGIDO
    console.log('📊 Dados carregados:', Object.keys(window.aircraftData).length, 'aeronaves'); // ✅ CORRIGIDO
}

// Função para alternar entre abas
function openTab(tabId) {
    // Ocultar todo o conteúdo da guia
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class de todos os botões da guia
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostrar o conteúdo da aba selecionada e definir o botão como ativo
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Atualizar informações da aeronave ao mudar de aba
    updateAircraftInfo(tabId);
    generateCalendar(tabId);
}

// Definir data atual no footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');

// Atualizar informações da aeronave
function updateAircraftInfo(aircraftId) {
    const data = window.aircraftData[aircraftId]; // ✅ CORRIGIDO
    const infoElement = document.getElementById(`${aircraftId}-info`);
    
    if (data && infoElement) {
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        infoElement.innerHTML = `
            <strong>Entrada:</strong> ${entradaFormatada} | 
            <strong>Saída:</strong> ${saidaFormatada} | 
            <strong>Duração:</strong> ${getDiasUteisFixos(aircraftId)} dias úteis
            <br><em>${data.info}</em>
        `;
    }
}

// Calcular diferença de dias úteis entre duas datas
function calculateDaysDifference(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    
    return count;
}

// Adicionar eventos de mouse para as abas
document.querySelectorAll('.tab-button').forEach(button => {
    const aircraftId = button.getAttribute('data-aircraft');
    
    // Adicionar tooltip dengan informações da aeronave
    const tooltip = button.querySelector('.tab-tooltip');
    
    button.addEventListener('mouseenter', () => {
        const data = window.aircraftData[aircraftId]; // ✅ CORRIGIDO
        if (data) {
            const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
            const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
            
            tooltip.textContent = `Entrada: ${entradaFormatada} | Saída: ${saidaFormatada}`;
            updateAircraftInfo(aircraftId);
        }
    });
});

// Gerar calendário para cada aeronave
async function generateCalendar(aircraftId) {
    if (!window.aircraftData[aircraftId]) { // ✅ CORRIGIDO
        console.log('⏳ Aguardando dados para:', aircraftId);
        return;
    }
    
    const data = window.aircraftData[aircraftId]; // ✅ CORRIGIDO
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    const year = data.entrada.getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Limpar calendário anterior
    calendarContainer.innerHTML = '';
    
    // Defina a data original de saída planejada (12/09) - APENAS PARA PP-FCF
    const saidaPlanejada = aircraftId === 'pp-fcf' ? new Date('2025-09-12') : null;
    // NOVO: Defina a data original de saída planejada (19/09) - APENAS PARA PR-ARB
    const saidaPlanejadaPRARB = aircraftId === 'pr-arb' ? new Date('2025-09-19') : null;
    
    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div');
        monthElement.className = 'month';
        
        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        monthName.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' });
        monthElement.appendChild(monthName);
        
        const weekdays = document.createElement('div');
        weekdays.className = 'weekdays';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            weekdays.appendChild(dayElement);
        });
        monthElement.appendChild(weekdays);
        
        const daysContainer = document.createElement('div');
        daysContainer.className = 'days';
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Dias vazios antes do primeiro dia do mês
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            daysContainer.appendChild(emptyDay);
        }
        
        // Dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const currentDate = new Date(year, month, day);
            const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
            
            // Verifique se este dia está dentro do período de manutenção E é um dia útil
            if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
                dayElement.classList.add('maintenance');
                
                // CRIAR TOOLTIP PARA DIAS DE MANUTENÇÃO
                const tooltip = document.createElement('div');
                tooltip.className = 'day-tooltip';
                
                // VERIFICAÇÃO ESPECÍFICA PARA O DIA DE SAÍDA DE CADA AERONAVE
                const saidaDates = {
                    'pp-fcf': '16/09',
                    'pr-msz': '29/08', 
                    'pp-emo': '29/08',
                    'ps-ece': '27/07',
                    'pr-rex': '14/08',
                    'pr-arb': '07/10',
                    'pr-day': '30/09',
                    'pr-fil': '01/12',
                    'pr-eft': '31/10'
                };
                
                // Formata a data atual para comparar (dd/mm)
                const currentDay = String(day).padStart(2, '0');
                const currentMonth = String(month + 1).padStart(2, '0');
                const currentDateFormatted = `${currentDay}/${currentMonth}`;
                
                // Verifica se é o dia de saída específico
                if (saidaDates[aircraftId] === currentDateFormatted) {
                    tooltip.textContent = `${data.prefix} - Manutenção concluída`;
                } else {
                    tooltip.textContent = `${data.prefix} - Em manutenção`;
                }
                
                dayElement.appendChild(tooltip);
                
                // VERIFICAÇÃO ESPECIAL PARA PP-FCF e Posteriormente outra: Dias de atraso
                if (aircraftId === 'pp-fcf' && saidaPlanejada && currentDate > saidaPlanejada) {
                    dayElement.classList.add('delay');
                    
                    // Atualiza o tooltip para mostrar que é atraso
                    if (saidaDates[aircraftId] === currentDateFormatted) {
                        tooltip.textContent = `${data.prefix} - Manutenção concluída com atraso`;
                    } else {
                        tooltip.textContent = `${data.prefix} - Conclusão com atraso`;
                    }
                }
            }
            
            daysContainer.appendChild(dayElement);
        }
        
        monthElement.appendChild(daysContainer);
        calendarContainer.appendChild(monthElement);
    }
    
    // Atualizar informações da aeronave ativa inicialmente
    if (document.getElementById(aircraftId).classList.contains('active')) {
        updateAircraftInfo(aircraftId);
    }
}

function getDiasUteisFixos(aircraftId) {
    if (aircraftId === 'pp-fcf') return 42;
    if (aircraftId === 'pr-msz') return 16;
    if (aircraftId === 'pp-emo') return 11;
    if (aircraftId === 'ps-ece') return 9;
    if (aircraftId === 'pr-rex') return 88;
    if (aircraftId === 'pr-arb') return 166;
    if (aircraftId === 'pr-day') return 9;
    if (aircraftId === 'pr-fil') return 44; 
    if (aircraftId === 'pr-eft') return 16;
    return 0;
}

// Inicialização da aplicação
async function initializeApp() {
    console.log('🚀 Iniciando aplicação...');
    
    // Carregar dados da API
    await loadAircraftData();
    
    // Gerar todos os calendários
    Object.keys(window.aircraftData).forEach(aircraft => { // ✅ CORRIGIDO
        generateCalendar(aircraft);
    });
    
    // Atualizar informações da aeronave ativa
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        updateAircraftInfo(activeTab.id);
    }
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', initializeApp);