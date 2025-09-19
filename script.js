// Dados dos períodos de manutenção de cada aeronave
// Objeto que armazena informações sobre cada aeronave
const aircraftData = {
    // Dados da primeira aeronave
    'pp-fcf': {
        prefix: 'PP-FCF', // Prefixo da aeronave
        entrada: new Date('2025-07-21'), // Data de entrada em manutenção
        saida: new Date('2025-09-17'), // Data de saída da manutenção (ATUALIZADA)
        info: "Manutenção programada para revisão geral - Concluída com atraso" // Informações adicionais
    },
    // Estrutura similar para as demais aeronaves
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
     // Dados da aeronave PR-REX (adicionada posteriormente)
     'pr-rex': {
        prefix: 'PR-REX',
        entrada: new Date('2025-04-10'),  // Data de entrada
        saida: new Date('2025-08-15'),    // Data de saída
        info: "Manutenção programada para revisão de motores"
    },
    // Dados da aeronave PR-ARB (adicionada posteriormente)
    'pr-arb': {
        prefix: 'PR-ARB',
        entrada: new Date('2025-02-08'),  // Data de entrada
        saida: new Date('2025-09-20'),    // Data de saída
        info: "Substituição de sistema de combustível"
    }
};

// Função para alternar entre abas
function openTab(tabId) {
    // Ocultar todo o conteúdo da guia
    const tabContents = document.getElementsByClassName('tab-content');
    // Loop através de todas as abas para remover a classe 'active'
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove a classe active de todos os botões da guia
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
// Obtém o elemento pelo ID e define seu conteúdo como a data atual formatada
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');

// Atualizar informações da aeronave
function updateAircraftInfo(aircraftId) {
    // Obtém os dados da aeronave específica
    const data = aircraftData[aircraftId];
    // Obtém o elemento onde as informações serão exibidas
    const infoElement = document.getElementById(`${aircraftId}-info`);
    
    // Se existirem dados e o elemento for encontrado
    if (data && infoElement) {
        // Formata as datas para o padrão brasileiro
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        // Preenche o elemento com as informações formatadas
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
    let count = 0; // Contador de dias úteis
    // Cria uma cópia da data de início para não modificar a original
    const curDate = new Date(startDate.getTime());
    
    // Loop através de cada dia entre as datas
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay(); // 0 = Domingo, 6 = Sábado
        // Se não for fim de semana, incrementa o contador
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        // Avança para o próximo dia
        curDate.setDate(curDate.getDate() + 1);
    }
    
    return count; // Retorna o total de dias úteis
}

// Adicionar eventos de mouse para as abas
// Seleciona todos os botões de aba e aplica um loop
document.querySelectorAll('.tab-button').forEach(button => {
    // Obtém o ID da aeronave a partir do atributo data-aircraft
    const aircraftId = button.getAttribute('data-aircraft');
    // Obtém os dados dessa aeronave
    const data = aircraftData[aircraftId];
    
    // Se existirem dados
    if (data) {
        // Seleciona o tooltip dentro do botão
        const tooltip = button.querySelector('.tab-tooltip');
        // Formata as datas
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        // Define o texto do tooltip com as datas
        tooltip.textContent = `Entrada: ${entradaFormatada} | Saída: ${saidaFormatada}`;
        
        // Adiciona um evento para quando o mouse passar sobre o botão
        button.addEventListener('mouseenter', () => {
            updateAircraftInfo(aircraftId); // Atualiza as informações
        });
    }
});

// Gerar calendário para cada aeronave
// Para cada chave no objeto aircraftData (cada aeronave)
Object.keys(aircraftData).forEach(aircraft => {
    // Chama a função para gerar o calendário
    generateCalendar(aircraft, aircraftData[aircraft]);
});

// Função principal que gera o calendário
function generateCalendar(aircraftId, data) {
    // Obtém o container onde o calendário será renderizado
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    // Obtém o ano a partir da data de entrada
    const year = data.entrada.getFullYear();
    // Obtém a data atual e zera as horas para comparação
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Defina a data original de saída planejada (12/09) - APENAS PARA PP-FCF
    const saidaPlanejada = aircraftId === 'pp-fcf' ? new Date('2025-09-12') : null;
    
    // Loop através de cada mês (0 a 11 = Janeiro a Dezembro)
    for (let month = 0; month < 12; month++) {
        // Cria um elemento div para o mês
        const monthElement = document.createElement('div');
        monthElement.className = 'month';
        
        // Cria um elemento para o nome do mês
        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        // Define o texto com o nome do mês em português
        monthName.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' });
        // Adiciona o nome do mês ao elemento do mês
        monthElement.appendChild(monthName);
        
        // Cria um container para os dias da semana
        const weekdays = document.createElement('div');
        weekdays.className = 'weekdays';
        // Para cada dia da semana (abreviado)
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            weekdays.appendChild(dayElement);
        });
        monthElement.appendChild(weekdays);
        
        // Cria um container para os dias do mês
        const daysContainer = document.createElement('div');
        daysContainer.className = 'days';
        
        // Obtém o primeiro e último dia do mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Dias vazios antes do primeiro dia do mês (para alinhar corretamente)
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            daysContainer.appendChild(emptyDay);
        }
        
        // Dias do mês (de 1 até o último dia)
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            // Cria uma data para o dia atual do loop
            const currentDate = new Date(year, month, day);
            // Obtém o dia da semana (0 = Domingo, 6 = Sábado)
            const dayOfWeek = currentDate.getDay();
            
            // Verifica se este dia está dentro do período de manutenção E é um dia útil
            if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
                dayElement.classList.add('maintenance'); // Adiciona classe de manutenção
                
                // VERIFICAÇÃO ESPECIAL PARA PP-FCF: Dias de atraso
                if (aircraftId === 'pp-fcf' && saidaPlanejada && currentDate > saidaPlanejada) {
                    dayElement.classList.add('delay'); // Adiciona classe de atraso
                    
                    // Cria e adiciona um tooltip específico para dias de atraso
                    const tooltip = document.createElement('div');
                    tooltip.className = 'day-tooltip';
                    tooltip.textContent = `${data.prefix} - Conclusão com atraso`;
                    dayElement.appendChild(tooltip);
                } else {
                    // Tooltip normal para outros dias de manutenção
                    const tooltip = document.createElement('div');
                    tooltip.className = 'day-tooltip';
                    tooltip.textContent = `${data.prefix} em manutenção`;
                    dayElement.appendChild(tooltip);
                }
            }
            
            // Adiciona o dia ao container de dias
            daysContainer.appendChild(dayElement);
        }
        
        // Adiciona o container de dias ao elemento do mês
        monthElement.appendChild(daysContainer);
        // Adiciona o mês ao container do calendário
        calendarContainer.appendChild(monthElement);
    }
    
    // Atualizar informações da aeronave ativa inicialmente
    if (document.getElementById(aircraftId).classList.contains('active')) {
        updateAircraftInfo(aircraftId);
    }
}

// Função para retornar os dias úteis fixos que você quer
// (Esta função retorna valores fixos em vez de calcular)
function getDiasUteisFixos(aircraftId) {
    if (aircraftId === 'pp-fcf') return 42;  // Alterado para 42
    if (aircraftId === 'pr-msz') return 16;  // Alterado para 16
    if (aircraftId === 'pp-emo') return 11;  // Alterado para 11
    if (aircraftId === 'ps-ece') return 9;   // Alterado para 9
     if (aircraftId === 'pr-rex') return 88;  // Defina os dias úteis para PR-REX
    if (aircraftId === 'pr-arb') return 154;  // Defina os dias úteis para PR-ARB
    return 0;
}