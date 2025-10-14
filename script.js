// script.js - gera abas e calendários dinamicamente (suporta múltiplas manutenções)
// VERSÃO 2.0 - Dinâmica e compatível com data.js atual

let aircraftData = {};

// CONFIGURAÇÕES DINÂMICAS - AGORA FLEXÍVEIS
const appConfig = {
    defaultYear: new Date().getFullYear(),
    dateFormat: 'pt-BR',
    businessDays: [1, 2, 3, 4, 5], // Segunda a Sexta
    // CONFIGURAÇÕES POR AERONAVE - AGORA DINÂMICAS
    aircraftSettings: {
        "pp-fcf": { 
            plannedExit: "2025-09-12",
            critical: true,
            
        },
        "pr-msz": {
            plannedExit: "2025-08-29", 
            critical: false,
            
        },
        "pp-emo": {
            plannedExit: "2025-08-29",
            critical: false,
           
        },
        "ps-ece": {
            plannedExit: "2025-08-27",
            critical: false, 
            
        },
        "pr-rex": {
            plannedExit: "2025-08-14",
            critical: false,
            
        },
        "pr-arb": {
            plannedExit: "2025-10-21",
            critical: true,
            
        },
        "pr-day": {
            plannedExit: "2025-09-30",
            critical: false,
           
        },
        "pr-fil": {
            plannedExit: "2025-12-01",
            critical: true,
            
        },
        "pr-eft": {
            plannedExit: "2025-10-31",
            critical: false,
            
        },
        "ps-cmc": {
            plannedExit: "2025-11-14",
            critical: false,
            
        }
    }
};

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
function parseDateISO(dateString) {
    if (!dateString) return null;
    return new Date(dateString + "T00:00:00");
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total  
function calculateDaysDifference(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
function sumBusinessDays(maintenances) {
    if (!Array.isArray(maintenances)) return 0;
    return maintenances.reduce((acc, m) => {
        const e = parseDateISO(m.entrada);
        const s = parseDateISO(m.saida);
        if (!e || !s) return acc;
        return acc + calculateDaysDifference(e, s);
    }, 0);
}

// INICIALIZAÇÃO ORIGINAL MANTIDA - compatibilidade total
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AIRCRAFT_DATA !== 'undefined') {
        initializeWithData(AIRCRAFT_DATA);
    } else {
        console.error('AIRCRAFT_DATA não foi carregado. Certifique-se de que data.js está incluído no HTML.');
    }
});

// FUNÇÃO ATUALIZADA MAS COMPATÍVEL
function initializeWithData(data) {
    aircraftData = data;
    buildUIFromData(aircraftData);
    
    // Gera calendários para cada aeronave
    Object.keys(aircraftData).forEach((id) => {
        generateCalendar(id, aircraftData[id]);
    });
    
    // Abre primeira aba
    openFirstTab();
    updateCurrentDate();
}

// FUNÇÃO NOVA - Abre primeira aba dinamicamente
function openFirstTab() {
    const firstId = Object.keys(aircraftData)[0];
    if (firstId) {
        const firstButton = document.querySelector(
            `.tab-button[data-aircraft="${firstId}"]`
        );
        if (firstButton) {
            openTab(firstId, firstButton);
        }
    }
}

// FUNÇÃO NOVA - Atualiza data atual
function updateCurrentDate() {
    const el = document.getElementById("current-date");
    if (el) el.textContent = new Date().toLocaleDateString("pt-BR");
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
function buildUIFromData(data) {
    const tabsContainer = document.getElementById("tabs");
    const contents = document.getElementById("contents");

    Object.keys(data).forEach((id) => {
        const item = data[id];

        // botão da aba
        const button = document.createElement("button");
        button.className = "tab-button";
        button.setAttribute("data-aircraft", id);
        button.type = "button";
        button.appendChild(document.createTextNode(item.prefix || id));

        const tooltip = document.createElement("div");
        tooltip.className = "tab-tooltip";
        tooltip.textContent = "";
        button.appendChild(tooltip);

        button.addEventListener("click", () => openTab(id, button));
        
        // show basic tooltip info on hover - MELHORADO
        button.addEventListener("mouseenter", () => {
            updateTabTooltip(button, item, id);
        });
        
        button.addEventListener("mouseleave", () => {
            tooltip.textContent = "";
        });

        tabsContainer.appendChild(button);

        // conteúdo da aba
        const tabContent = document.createElement("div");
        tabContent.className = "tab-content";
        tabContent.id = id;

        const h2 = document.createElement("h2");
        h2.className = "year-title";
        h2.textContent = `${item.prefix || id} - Calendário ${
            item.year || new Date().getFullYear()
        }`;
        tabContent.appendChild(h2);

        const pInfo = document.createElement("p");
        pInfo.className = "aircraft-info";
        pInfo.id = `${id}-info`;
        pInfo.textContent = "Passe o mouse sobre os dias para mais informações";
        tabContent.appendChild(pInfo);

        // area com lista de manutenções
        const maintList = document.createElement("div");
        maintList.className = "maintenance-list";
        maintList.id = `${id}-maint-list`;
        tabContent.appendChild(maintList);

        // legend - ATUALIZADA DINAMICAMENTE
        const legend = document.createElement("div");
        legend.className = "legend";
        legend.innerHTML = createLegendHTML(id);
        tabContent.appendChild(legend);

        const calendarContainer = document.createElement("div");
        calendarContainer.className = "calendar-container";

        const monthsGrid = document.createElement("div");
        monthsGrid.className = "months-grid";
        monthsGrid.id = `${id}-calendar`;

        calendarContainer.appendChild(monthsGrid);
        tabContent.appendChild(calendarContainer);

        contents.appendChild(tabContent);
    });
}

// FUNÇÃO NOVA - Tooltip dinâmico para abas
function updateTabTooltip(button, item, aircraftId) {
    const tooltip = button.querySelector('.tab-tooltip');
    const firstMaint = item.maintenances && item.maintenances[0];
    const settings = appConfig.aircraftSettings[aircraftId];
    
    if (firstMaint) {
        const e = parseDateISO(firstMaint.entrada);
        const s = parseDateISO(firstMaint.saida);
        if (e && s) {
            let tooltipText = `Entrada: ${e.toLocaleDateString("pt-BR")} | Saída: ${s.toLocaleDateString("pt-BR")}`;
            
            // ADICIONA INFO DINÂMICA - equipe se disponível
            if (settings && settings.maintenanceTeam) {
                tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
            }
            
            // ADICIONA INFO DINÂMICA - crítica se for
            if (settings && settings.critical) {
                tooltipText += ` | ⚠ CRÍTICA`;
            }
            
            tooltip.textContent = tooltipText;
        }
    } else {
        tooltip.textContent = "Sem manutenção registrada";
    }
}

// FUNÇÃO NOVA - Legenda dinâmica
function createLegendHTML(aircraftId) {
    const settings = appConfig.aircraftSettings[aircraftId];
    let legendHTML = '<div class="legend-item"><div class="color-box maintenance-color"></div><span>Período de Manutenção</span></div>';
    
    // SÓ mostra legenda de atraso se a aeronave tiver data planejada
    if (settings && settings.plannedExit) {
        legendHTML += '<div class="legend-item"><div class="color-box delay-color"></div><span>Dias de Atraso</span></div>';
    }
    
    // ADICIONA indicador de equipe se disponível
    if (settings && settings.maintenanceTeam) {
        legendHTML += `<div class="legend-item" style="margin-left: auto; font-style: italic; color: #666;">Equipe: ${settings.maintenanceTeam}</div>`;
    }
    
    return legendHTML;
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
function openTab(tabId, button) {
    document
        .querySelectorAll(".tab-content")
        .forEach((el) => el.classList.remove("active"));
    document
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));

    const content = document.getElementById(tabId);
    if (content) content.classList.add("active");
    if (button) button.classList.add("active");

    updateAircraftInfo(tabId);
}

// FUNÇÃO ATUALIZADA - Mais informações dinâmicas
function updateAircraftInfo(aircraftId) {
    const item = aircraftData[aircraftId];
    const infoElement = document.getElementById(`${aircraftId}-info`);
    const listElement = document.getElementById(`${aircraftId}-maint-list`);
    if (!item || !infoElement || !listElement) return;

    const totalDays = sumBusinessDays(item.maintenances || []);
    const settings = appConfig.aircraftSettings[aircraftId];
    
    // INFO DINÂMICA - adiciona status crítico se existir
    let criticalInfo = "";
    if (settings && settings.critical) {
        criticalInfo = ` | <strong style="color: #d32f2f;">⚡ CRÍTICA</strong>`;
    }
    
    infoElement.innerHTML = `<strong>Nome:</strong> ${
        item.name || "-"
    } | <strong>Ano:</strong> ${
        item.year || "-"
    } | <strong>Total (dias úteis):</strong> ${totalDays}${criticalInfo}`;

    // Preenche lista de manutenções - MANTIDO ORIGINAL
    listElement.innerHTML = "";
    if (Array.isArray(item.maintenances) && item.maintenances.length) {
        item.maintenances.forEach((m, idx) => {
            const e = parseDateISO(m.entrada);
            const s = parseDateISO(m.saida);
            const li = document.createElement("div");
            li.className = "maintenance-item";
            li.innerHTML = `<strong>Manutenção ${idx + 1}:</strong> ${
                m.descricao || ""
            } <br> <strong>Entrada:</strong> ${
                e ? e.toLocaleDateString("pt-BR") : "-"
            } | <strong>Saída:</strong> ${
                s ? s.toLocaleDateString("pt-BR") : "-"
            } | <strong>Duração:</strong> ${calculateDaysDifference(
                e,
                s
            )} dias úteis`;
            listElement.appendChild(li);
        });
    } else {
        listElement.textContent = "Nenhuma manutenção registrada.";
    }
}

// FUNÇÃO PRINCIPAL ATUALIZADA - Agora totalmente dinâmica
function generateCalendar(aircraftId, item) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    if (!calendarContainer) return;

    calendarContainer.innerHTML = "";

    // Prepara períodos - COMPATÍVEL com data.js atual
    const periods = (item.maintenances || [])
        .map((m) => ({
            entrada: parseDateISO(m.entrada),
            saida: parseDateISO(m.saida),
            descricao: m.descricao || "",
        }))
        .filter((p) => p.entrada && p.saida);

    const year = determineCalendarYear(item, periods);
    const settings = appConfig.aircraftSettings[aircraftId] || {};

    // Gera cada mês dinamicamente
    for (let month = 0; month < 12; month++) {
        const monthElement = createMonthElement(year, month);
        addMonthDays(monthElement, year, month, periods, aircraftId, settings);
        calendarContainer.appendChild(monthElement);
    }

    updateTabIfActive(aircraftId);
}

// FUNÇÃO NOVA - Determina ano do calendário dinamicamente
function determineCalendarYear(item, periods) {
    return item.year ||
           (periods[0] && periods[0].entrada && periods[0].entrada.getFullYear()) ||
           appConfig.defaultYear;
}

// FUNÇÃO NOVA - Cria elemento do mês
function createMonthElement(year, month) {
    const monthElement = document.createElement("div");
    monthElement.className = "month";

    const monthName = document.createElement("div");
    monthName.className = "month-name";
    monthName.textContent = new Date(year, month, 1).toLocaleDateString(
        appConfig.dateFormat,
        { month: "long" }
    );
    monthElement.appendChild(monthName);

    const weekdays = document.createElement("div");
    weekdays.className = "weekdays";
    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;
        weekdays.appendChild(dayElement);
    });
    monthElement.appendChild(weekdays);

    const daysContainer = document.createElement("div");
    daysContainer.className = "days";
    monthElement.appendChild(daysContainer);

    return monthElement;
}

// FUNÇÃO NOVA - Adiciona dias ao mês com marcações dinâmicas
function addMonthDays(monthElement, year, month, periods, aircraftId, settings) {
    const daysContainer = monthElement.querySelector('.days');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Dias vazios para alinhamento
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
    }

    // Dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const dayElement = createDayElement(day, currentDate);
        
        // Aplica estilos DINÂMICOS
        applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings);
        
        daysContainer.appendChild(dayElement);
    }
}

// FUNÇÃO NOVA - Cria elemento do dia
function createDayElement(dayNumber, currentDate) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = dayNumber;
    dayElement.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
    return dayElement;
}

// FUNÇÃO CORRIGIDA - Aplica estilos dinamicamente
function applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings) {
    const dayOfWeek = currentDate.getDay();
    const isBusinessDay = appConfig.businessDays.includes(dayOfWeek);

    // Encontra períodos de manutenção para esta data
    const matchingPeriods = periods.filter(p => 
        currentDate >= p.entrada && 
        currentDate <= p.saida && 
        isBusinessDay
    );

    if (matchingPeriods.length > 0) {
        const period = matchingPeriods[0];
        dayElement.classList.add("maintenance");
        
        // VERIFICA ATRASO PRIMEIRO - CORREÇÃO IMPORTANTE
        const hasDelay = checkForDelay(aircraftId, currentDate, settings);
        
        // SE HOUVER ATRASO, ADICIONA CLASSE DELAY
        if (hasDelay) {
            dayElement.classList.add("delay");
        }
        
        // TOOLTIP DINÂMICO
        const tooltip = createDynamicTooltip(period, aircraftId, settings, currentDate);
        dayElement.appendChild(tooltip);
    }
}

// FUNÇÃO CORRIGIDA - Verifica atraso dinamicamente
function checkForDelay(aircraftId, currentDate, settings) {
    if (!settings || !settings.plannedExit) return false;
    
    const plannedExit = parseDateISO(settings.plannedExit);
    if (!plannedExit) return false;
    
    // CORREÇÃO: Verifica se a data atual é APÓS a data planejada
    const hasDelay = currentDate > plannedExit;
    
    return hasDelay;
}

// FUNÇÃO NOVA - Cria tooltip dinâmico
function createDynamicTooltip(period, aircraftId, settings, currentDate) {
    const tooltip = document.createElement("div");
    tooltip.className = "day-tooltip";
    
    const isLastDay = currentDate.getTime() === period.saida.getTime();
    const hasDelay = checkForDelay(aircraftId, currentDate, settings);
    
    let tooltipText = `${aircraftData[aircraftId].prefix} - `;
    
    if (hasDelay) {
        tooltipText += `ATRASO: ${period.descricao}`;
        tooltip.classList.add('delay-tooltip');
    } else if (isLastDay) {
        tooltipText += `Concluído: ${period.descricao}`;
    } else {
        tooltipText += `Em andamento: ${period.descricao}`;
    }
    
    // INFO DINÂMICA - adiciona equipe se disponível
    if (settings && settings.maintenanceTeam) {
        tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
    }
    
    tooltip.textContent = tooltipText;
    return tooltip;
}

// FUNÇÃO NOVA - Atualiza aba se estiver ativa
function updateTabIfActive(aircraftId) {
    if (document.getElementById(aircraftId).classList.contains("active")) {
        updateAircraftInfo(aircraftId);
    }
}

// ============================================================================
// FUNÇÕES DE API PARA DEIXAR AINDA MAIS DINÂMICO - Opcionais
// ============================================================================

// FUNÇÃO NOVA - Adiciona manutenção dinamicamente (para uso futuro)
function addMaintenance(aircraftId, maintenanceData) {
    if (!aircraftData[aircraftId].maintenances) {
        aircraftData[aircraftId].maintenances = [];
    }
    
    aircraftData[aircraftId].maintenances.push({
        entrada: maintenanceData.entrada,
        saida: maintenanceData.saida,
        descricao: maintenanceData.descricao || '',
        ...maintenanceData
    });
    
    // Atualiza a visualização
    generateCalendar(aircraftId, aircraftData[aircraftId]);
    updateAircraftInfo(aircraftId);
}

// FUNÇÃO NOVA - Atualiza configurações em tempo real
function updateAircraftConfig(aircraftId, newConfig) {
    appConfig.aircraftSettings[aircraftId] = { 
        ...appConfig.aircraftSettings[aircraftId], 
        ...newConfig 
    };
    generateCalendar(aircraftId, aircraftData[aircraftId]);
}

// FUNÇÃO NOVA - Recarrega dados externos (para uso futuro)
function reloadAircraftData(newData) {
    aircraftData = newData;
    document.getElementById("tabs").innerHTML = "";
    document.getElementById("contents").innerHTML = "";
    initializeWithData(aircraftData);
}