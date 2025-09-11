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
}

// Definir data atual no footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');

// Dados dos períodos de manutenção de cada aeronave (do arquivo Excel, com um dia a mais para garantir a cobertura completa no calendário)
const aircraftData = {
    'pp-fcf': {
        prefix: 'PP-FCF',
        entrada: new Date('2025-07-21'),
        saida: new Date('2025-09-13')
    },
    'pr-msz': {
        prefix: 'PR-MSZ',
        entrada: new Date('2025-08-08'),
        saida: new Date('2025-08-30')
    },
    'pp-emo': {
        prefix: 'PP-EMO',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-30')
    },
    'ps-ece': {
        prefix: 'PS-ECE',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-28')
    }
};

//Gerar calendário para cada aeronave
Object.keys(aircraftData).forEach(aircraft => {
    generateCalendar(aircraft, aircraftData[aircraft]);
});

function generateCalendar(aircraftId, data) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    const year = data.entrada.getFullYear();
    
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
            
            // Verifique se este dia está dentro do período de manutenção E é um dia útil (não sábado ou domingo)
            if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
                dayElement.classList.add('maintenance');
            }
            
            daysContainer.appendChild(dayElement);
        }
        
        monthElement.appendChild(daysContainer);
        calendarContainer.appendChild(monthElement);
    }
}