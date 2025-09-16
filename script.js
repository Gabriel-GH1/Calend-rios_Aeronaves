// Dados dos períodos de manutenção de cada aeronave
const aircraftData = {
    'pp-fcf': {
        prefix: 'PP-FCF',
        entrada: new Date('2025-07-21'),
        saida: new Date('2025-09-17'), // ATUALIZADO: de 13/09 para 17/09
        info: "Manutenção programada para revisão geral - Concluída com atraso"
    },
    'pr-msz': {
        prefix: 'PR-MSZ',
        entrada: new Date('2025-08-08'),
        saida: new Date('2025-08-30'),
        info: "Manutenção de sistemas hidráulicos"
    },
    'pp-emo': {
        prefix: 'PP-EMO',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-30'),
        info: "Substituição de componentes da asa direita"
    },
    'ps-ece': {
        prefix: 'PS-ECE',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-28'),
        info: "Atualização de sistemas de navegação"
    },
     'pr-rex': {
        prefix: 'PR-REX',
        entrada: new Date('2025-04-10'),  // Defina a data de entrada precisa colocar 1 dia a mais também
        saida: new Date('2025-08-15'),    // Defina a data de saída, colocar 1 dia a mais no código para mostrar certo na página
        info: "Manutenção programada para revisão de motores"
    },
    'pr-arb': {
        prefix: 'PR-ARB',
        entrada: new Date('2025-02-08'),  // Defina a data de entrada
        saida: new Date('2025-09-20'),    // Defina a data de saída, colocar 1 dia a mais no código para mostrar certo na página
        info: "Substituição de sistema de combustível"
    }
};


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
}

// Definir data atual no footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');

// Atualizar informações da aeronave
function updateAircraftInfo(aircraftId) {
    const data = aircraftData[aircraftId];
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
    const data = aircraftData[aircraftId];
    
    if (data) {
        // Adicionar tooltip dengan informasi da aeronave
        const tooltip = button.querySelector('.tab-tooltip');
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        tooltip.textContent = `Entrada: ${entradaFormatada} | Saída: ${saidaFormatada}`;
        
        // Atualizar informações ao passar o mouse
        button.addEventListener('mouseenter', () => {
            updateAircraftInfo(aircraftId);
        });
    }
});

// Gerar calendário para cada aeronave
Object.keys(aircraftData).forEach(aircraft => {
    generateCalendar(aircraft, aircraftData[aircraft]);
});

function generateCalendar(aircraftId, data) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    const year = data.entrada.getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Defina a data original de saída planejada (12/09) - APENAS PARA PP-FCF
    const saidaPlanejada = aircraftId === 'pp-fcf' ? new Date('2025-09-12') : null;
    
    
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
                
                // VERIFICAÇÃO ESPECIAL PARA PP-FCF: Dias de atraso
                if (aircraftId === 'pp-fcf' && saidaPlanejada && currentDate > saidaPlanejada) {
                    dayElement.classList.add('delay');
                    
                    // Atualiza o tooltip para mostrar que é atraso
                    const tooltip = document.createElement('div');
                    tooltip.className = 'day-tooltip';
                    tooltip.textContent = `${data.prefix} - Conclusão com atraso`;
                    dayElement.appendChild(tooltip);
                } else {
                    // Tooltip normal para outros dias
                    const tooltip = document.createElement('div');
                    tooltip.className = 'day-tooltip';
                    tooltip.textContent = `${data.prefix} em manutenção`;
                    dayElement.appendChild(tooltip);
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

// Função para retornar os dias úteis fixos que você quer
function getDiasUteisFixos(aircraftId) {
    if (aircraftId === 'pp-fcf') return 42;  // Alterado para 42
    if (aircraftId === 'pr-msz') return 16;  // Alterado para 16
    if (aircraftId === 'pp-emo') return 11;  // Alterado para 11
    if (aircraftId === 'ps-ece') return 9;   // Alterado para 9
     if (aircraftId === 'pr-rex') return 88;  // Defina os dias úteis para PR-REX
    if (aircraftId === 'pr-arb') return 154;  // Defina os dias úteis para PR-ARB
    return 0;
}