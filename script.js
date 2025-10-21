// ...existing code...

// script.js - gera abas e calendários dinamicamente (suporta múltiplas manutenções)
// VERSÃO 2.0 - Dinâmica e compatível com data.js atual

// armazenamento global dos dados das aeronaves (preenchido por initializeWithData)
let aircraftData = {};

// CONFIGURAÇÕES GLOBAIS E POR AERONAVE
const appConfig = {
    defaultYear: new Date().getFullYear(), // ano padrão para calendário
    dateFormat: 'pt-BR',                    // formato de exibição de mês
    businessDays: [1, 2, 3, 4, 5],         // dias úteis (1=Seg ... 5=Sex)
    // configurações específicas por prefixo de aeronave
    aircraftSettings: {
        "pp-fcf": { 
            plannedExit: "2025-09-12", // data planejada de saída (string ISO)
            critical: false,           // flag crítica
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
            plannedExit: "2025-09-30",
            critical: true,
        },
        "pr-day": {
            plannedExit: "2025-09-30",
            critical: false,
        },
        "pr-fil": {
            plannedExit: "2025-12-01",
            critical: false,
        },
        "pr-eft": {
            plannedExit: "2025-10-31",
            critical: false,
        },
        "ps-cmc": {
            plannedExit: "2025-11-14",
            critical: false,
        },
        "pp-nld": {
            plannedExit: "2025-12-12",
            critical: false,    
        },
        "pp-lja": {
            plannedExit: "2025-12-20",
            critical: false,
        }
    },
};

// converte string "YYYY-MM-DD" para Date em meia-noite (compatível com data.js)
function parseDateISO(dateString) {
    if (!dateString) return null; // evita erro se vazio
    return new Date(dateString + "T00:00:00");
}

// conta dias úteis entre startDate e endDate inclusive (ignora Sáb/Dom)
function calculateDaysDifference(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    let count = 0;
    const curDate = new Date(startDate.getTime()); // copia para iterar
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // incrementa se for dia útil
        curDate.setDate(curDate.getDate() + 1); // próximo dia
    }
    return count;
}

// soma dias úteis de um array de manutenções [{entrada, saida}, ...]
function sumBusinessDays(maintenances) {
    if (!Array.isArray(maintenances)) return 0;
    return maintenances.reduce((acc, m) => {
        const e = parseDateISO(m.entrada);
        const s = parseDateISO(m.saida);
        if (!e || !s) return acc; // pula entradas inválidas
        return acc + calculateDaysDifference(e, s);
    }, 0);
}

// inicializa quando DOM estiver pronto - espera que AIRCRAFT_DATA exista (data.js)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AIRCRAFT_DATA !== 'undefined') {
        initializeWithData(AIRCRAFT_DATA); // carrega dados e constrói UI
    } else {
        console.error('AIRCRAFT_DATA não foi carregado. Certifique-se de que data.js está incluído no HTML.');
    }
});

// inicializa variáveis locais e gera UI + calendários
function initializeWithData(data) {
    aircraftData = data;               // salva dados globalmente
    buildUIFromData(aircraftData);     // cria abas e containers HTML
    
    // gera calendários para cada aeronave
    Object.keys(aircraftData).forEach((id) => {
        generateCalendar(id, aircraftData[id]);
    });
    
    // abre a primeira aba automaticamente
    openFirstTab();
    updateCurrentDate(); // atualiza campo que mostra a data atual (se existir)
}

// abre a primeira aba disponível (se houver)
function openFirstTab() {
    const firstId = Object.keys(aircraftData)[0];
    if (firstId) {
        const firstButton = document.querySelector(`.tab-button[data-aircraft="${firstId}"]`);
        if (firstButton) {
            openTab(firstId, firstButton);
        }
    }
}

// atualiza elemento com id "current-date" para data atual formatada
function updateCurrentDate() {
    const el = document.getElementById("current-date");
    if (el) el.textContent = new Date().toLocaleDateString("pt-BR");
}

// constrói a interface de abas e conteúdos a partir dos dados
function buildUIFromData(data) {
    const tabsContainer = document.getElementById("tabs");   // container das abas (scrollable)
    const contents = document.getElementById("contents");    // container dos conteúdos/ calendários

    // cria (ou recupera) wrapper para as abas, que conterá a seta à direita
    let tabsWrapper = document.getElementById('tabs-wrapper');
    if (!tabsWrapper) {
        tabsWrapper = document.createElement('div');
        tabsWrapper.id = 'tabs-wrapper';
        tabsWrapper.className = 'tabs-wrapper';
        // mais adições abaixo
    }

    // cria botão de navegação (seta direita) se não existir
    let arrowRight = document.getElementById('tabs-arrow-right');
    if (!arrowRight) {
        arrowRight = document.createElement('button');
        arrowRight.id = 'tabs-arrow-right';
        arrowRight.className = 'tabs-arrow right';
        arrowRight.type = 'button';
        arrowRight.setAttribute('aria-label', 'Mostrar mais aeronaves');
        arrowRight.innerHTML = '>';                       // símbolo simples para a seta
        arrowRight.addEventListener('click', () => scrollTabs(1)); // ao clicar rola para a direita
    }

    // limpa conteúdo antigo antes de reconstruir
    tabsContainer.innerHTML = '';
    contents.innerHTML = '';

    // se ainda não estiver aninhado, insere wrapper no DOM e anexa tabs + seta
    if (!tabsContainer.parentElement || tabsContainer.parentElement.id !== 'tabs-wrapper') {
        const parent = tabsContainer.parentElement || document.body;
        parent.insertBefore(tabsWrapper, tabsContainer);
        tabsWrapper.appendChild(tabsContainer); // coloca as abas dentro do wrapper
        tabsWrapper.appendChild(arrowRight);   // seta à direita do container
    }

    // para cada aeronave nos dados, cria botão de aba e painel de conteúdo
    Object.keys(data).forEach((id) => {
        const item = data[id];

        // botão da aba
        const button = document.createElement("button");
        button.className = "tab-button";
        button.setAttribute("data-aircraft", id);
        button.type = "button";
        button.appendChild(document.createTextNode(item.prefix || id)); // texto do botão = prefixo ou id

        const tooltip = document.createElement("div");
        tooltip.className = "tab-tooltip";
        tooltip.textContent = ""; // preenchido em mouseenter
        button.appendChild(tooltip);

        button.addEventListener("click", () => openTab(id, button)); // abre aba ao clicar
        
        // mostra resumo no tooltip ao passar o mouse
        button.addEventListener("mouseenter", () => {
            updateTabTooltip(button, item, id);
        });
        
        button.addEventListener("mouseleave", () => {
            tooltip.textContent = ""; // limpa tooltip ao sair
        });

        tabsContainer.appendChild(button); // adiciona o botão à linha de abas

        // CONTEÚDO da aba (painel com calendário, lista de manutenções, legenda)
        const tabContent = document.createElement("div");
        tabContent.className = "tab-content";
        tabContent.id = id;

        const h2 = document.createElement("h2");
        h2.className = "year-title";
        h2.textContent = `${item.prefix || id} - Calendário ${ item.year || new Date().getFullYear() }`;
        tabContent.appendChild(h2);

        const pInfo = document.createElement("p");
        pInfo.className = "aircraft-info";
        pInfo.id = `${id}-info`;
        pInfo.textContent = "Passe o mouse sobre os dias para mais informações";
        tabContent.appendChild(pInfo);

        // área que lista manutenções detalhadas
        const maintList = document.createElement("div");
        maintList.className = "maintenance-list";
        maintList.id = `${id}-maint-list`;
        tabContent.appendChild(maintList);

        // legenda dinâmica (criada por createLegendHTML)
        const legend = document.createElement("div");
        legend.className = "legend";
        legend.innerHTML = createLegendHTML(id);
        tabContent.appendChild(legend);

        // container do calendário (12 meses)
        const calendarContainer = document.createElement("div");
        calendarContainer.className = "calendar-container";

        const monthsGrid = document.createElement("div");
        monthsGrid.className = "months-grid";
        monthsGrid.id = `${id}-calendar`;

        calendarContainer.appendChild(monthsGrid);
        tabContent.appendChild(calendarContainer);

        // anexa painel ao container de conteúdos
        contents.appendChild(tabContent);
    });

    // atualiza visibilidade da seta quando houver scroll no container de abas
    tabsContainer.addEventListener('scroll', updateArrowVisibility);
    // pequena espera para garantir que layout esteja pronto antes de verificar
    setTimeout(updateArrowVisibility, 50);
}

// monta texto resumo para tooltip da aba (entrada/saída, equipe, crítica)
function updateTabTooltip(button, item, aircraftId) {
    const tooltip = button.querySelector('.tab-tooltip');
    const firstMaint = item.maintenances && item.maintenances[0];
    const settings = appConfig.aircraftSettings[aircraftId];
    
    if (firstMaint) {
        const e = parseDateISO(firstMaint.entrada);
        const s = parseDateISO(firstMaint.saida);
        if (e && s) {
            let tooltipText = `Entrada: ${e.toLocaleDateString("pt-BR")} | Saída: ${s.toLocaleDateString("pt-BR")}`;
            
            // adiciona equipe se configurada
            if (settings && settings.maintenanceTeam) {
                tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
            }
            
            // indica crítica se for o caso
            if (settings && settings.critical) {
                tooltipText += ` | ⚠ CRÍTICA`;
            }
            
            tooltip.textContent = tooltipText;
        }
    } else {
        tooltip.textContent = "Sem manutenção registrada";
    }
}

// cria HTML da legenda com base nas configurações da aeronave
function createLegendHTML(aircraftId) {
    const settings = appConfig.aircraftSettings[aircraftId];
    let legendHTML = '<div class="legend-item"><div class="color-box maintenance-color"></div><span>Período de Manutenção</span></div>';
    
    // só mostra item de atraso se houver plannedExit
    if (settings && settings.plannedExit) {
        legendHTML += '<div class="legend-item"><div class="color-box delay-color"></div><span>Dias de Atraso</span></div>';
    }
    
    // mostra equipe se disponível
    if (settings && settings.maintenanceTeam) {
        legendHTML += `<div class="legend-item" style="margin-left: auto; font-style: italic; color: #666;">Equipe: ${settings.maintenanceTeam}</div>`;
    }
    
    return legendHTML;
}

// abre aba: oculta todas e ativa apenas a selecionada; atualiza info
function openTab(tabId, button) {
    document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));

    const content = document.getElementById(tabId);
    if (content) content.classList.add("active");
    if (button) button.classList.add("active");

    updateAircraftInfo(tabId);
}

// atualiza painel de info da aeronave (nome, ano, total dias úteis, lista de manutenções)
function updateAircraftInfo(aircraftId) {
    const item = aircraftData[aircraftId];
    const infoElement = document.getElementById(`${aircraftId}-info`);
    const listElement = document.getElementById(`${aircraftId}-maint-list`);
    if (!item || !infoElement || !listElement) return;

    const totalDays = sumBusinessDays(item.maintenances || []);
    const settings = appConfig.aircraftSettings[aircraftId];
    
    // indica crítico se configurado
    let criticalInfo = "";
    if (settings && settings.critical) {
        criticalInfo = ` | <strong style="color: #d32f2f;">⚡ CRÍTICA</strong>`;
    }
    
    infoElement.innerHTML = `<strong>Nome:</strong> ${ item.name || "-" } | <strong>Ano:</strong> ${ item.year || "-" } | <strong>Total (dias úteis):</strong> ${totalDays}${criticalInfo}`;

    // popula lista de manutenções
    listElement.innerHTML = "";
    if (Array.isArray(item.maintenances) && item.maintenances.length) {
        item.maintenances.forEach((m, idx) => {
            const e = parseDateISO(m.entrada);
            const s = parseDateISO(m.saida);
            const li = document.createElement("div");
            li.className = "maintenance-item";
            li.innerHTML = `<strong>Manutenção ${idx + 1}:</strong> ${ m.descricao || "" } <br> <strong>Entrada:</strong> ${ e ? e.toLocaleDateString("pt-BR") : "-" } | <strong>Saída:</strong> ${ s ? s.toLocaleDateString("pt-BR") : "-" } | <strong>Duração:</strong> ${calculateDaysDifference(e, s)} dias úteis`;
            listElement.appendChild(li);
        });
    } else {
        listElement.textContent = "Nenhuma manutenção registrada.";
    }
}

// gera calendário (12 meses) para uma aeronave e marca períodos de manutenção
function generateCalendar(aircraftId, item) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    if (!calendarContainer) return;

    calendarContainer.innerHTML = "";

    // prepara períodos válidos (Date objects)
    const periods = (item.maintenances || []).map((m) => ({
            entrada: parseDateISO(m.entrada),
            saida: parseDateISO(m.saida),
            descricao: m.descricao || "",
        }))
        .filter((p) => p.entrada && p.saida); // remove períodos inválidos

    const year = determineCalendarYear(item, periods); // decide ano a usar
    const settings = appConfig.aircraftSettings[aircraftId] || {};

    // cria meses do ano
    for (let month = 0; month < 12; month++) {
        const monthElement = createMonthElement(year, month);
        addMonthDays(monthElement, year, month, periods, aircraftId, settings);
        calendarContainer.appendChild(monthElement);
    }

    updateTabIfActive(aircraftId); // se aba ativa, atualiza informações exibidas
}

// determina qual ano usar no calendário (prioriza item.year, depois primeira manutenção, senão default)
function determineCalendarYear(item, periods) {
    return item.year ||
           (periods[0] && periods[0].entrada && periods[0].entrada.getFullYear()) ||
           appConfig.defaultYear;
}

// cria DOM base do mês (nome + cabeçalho dos dias + container de dias)
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

// popula um mês com os dias e aplica marcações dinâmicas
function addMonthDays(monthElement, year, month, periods, aircraftId, settings) {
    const daysContainer = monthElement.querySelector('.days');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // adiciona dias vazios para alinhar o primeiro dia da semana
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
    }

    // cria cada dia do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const dayElement = createDayElement(day, currentDate);
        
        // aplica classes/tooltip se estiver em período de manutenção
        applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings);
        
        daysContainer.appendChild(dayElement);
    }
}

// cria elemento DOM de um dia (com data em data-date)
function createDayElement(dayNumber, currentDate) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = dayNumber;
    dayElement.setAttribute('data-date', currentDate.toISOString().split('T')[0]); // YYYY-MM-DD
    return dayElement;
}

// aplica classes CSS e tooltip para dias dentro de período de manutenção
function applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings) {
    const dayOfWeek = currentDate.getDay();
    const isBusinessDay = appConfig.businessDays.includes(dayOfWeek); // verifica se é dia útil

    // filtra períodos que cobrem a data atual e que ocorram em dia útil
    const matchingPeriods = periods.filter(p => 
        currentDate >= p.entrada && 
        currentDate <= p.saida && 
        isBusinessDay
    );

    if (matchingPeriods.length > 0) {
        const period = matchingPeriods[0];
        dayElement.classList.add("maintenance"); // marca período de manutenção
        
        // checa se existe atraso (data do dia > plannedExit)
        const hasDelay = checkForDelay(aircraftId, currentDate, settings);
        
        if (hasDelay) {
            dayElement.classList.add("delay"); // adiciona classe de atraso
        }
        
        // cria e anexa tooltip do dia com descrição/detalhes
        const tooltip = createDynamicTooltip(period, aircraftId, settings, currentDate);
        dayElement.appendChild(tooltip);
    }
}

// verifica se a data corrente está após a data planejada de saída (atraso)
function checkForDelay(aircraftId, currentDate, settings) {
    if (!settings || !settings.plannedExit) return false;
    
    const plannedExit = parseDateISO(settings.plannedExit);
    if (!plannedExit) return false;
    
    // true se a data do dia for maior que a data planejada (após)
    const hasDelay = currentDate > plannedExit;
    
    return hasDelay;
}

// constrói tooltip para um dia descrevendo estado (em andamento / concluído / atraso)
function createDynamicTooltip(period, aircraftId, settings, currentDate) {
    const tooltip = document.createElement("div");
    tooltip.className = "day-tooltip";
    
    const isLastDay = currentDate.getTime() === period.saida.getTime(); // fim do período
    const hasDelay = checkForDelay(aircraftId, currentDate, settings);
    
    let tooltipText = `${aircraftData[aircraftId].prefix} - `;
    
    if (hasDelay) {
        tooltipText += `ATRASO: ${period.descricao}`;
        tooltip.classList.add('delay-tooltip'); // estilo diferenciado
    } else if (isLastDay) {
        tooltipText += `Concluído: ${period.descricao}`;
    } else {
        tooltipText += `Em andamento: ${period.descricao}`;
    }
    
    // adiciona info de equipe se houver
    if (settings && settings.maintenanceTeam) {
        tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
    }
    
    tooltip.textContent = tooltipText;
    return tooltip;
}

// atualiza painel ativo se a aba correspondente estiver visível (ativa)
function updateTabIfActive(aircraftId) {
    if (document.getElementById(aircraftId).classList.contains("active")) {
        updateAircraftInfo(aircraftId);
    }
}

// ============================================================================
// FUNÇÕES DE API - permitem alterar dados dinamicamente em runtime
// ============================================================================

// adiciona manutenção a uma aeronave e atualiza visual
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
    
    // re-render do calendário e info
    generateCalendar(aircraftId, aircraftData[aircraftId]);
    updateAircraftInfo(aircraftId);
}

// atualiza configurações de aeronave (plannedExit, critical, maintenanceTeam, etc.)
function updateAircraftConfig(aircraftId, newConfig) {
    appConfig.aircraftSettings[aircraftId] = { 
        ...appConfig.aircraftSettings[aircraftId], 
        ...newConfig 
    };
    generateCalendar(aircraftId, aircraftData[aircraftId]); // re-render
}

// recarrega dados completos (substitui aircraftData)
function reloadAircraftData(newData) {
    aircraftData = newData;
    document.getElementById("tabs").innerHTML = "";
    document.getElementById("contents").innerHTML = "";
    initializeWithData(aircraftData);
}

// scroll das abas: direction 1 => direita, -1 => esquerda
function scrollTabs(direction) {
    const tabsContainer = document.getElementById('tabs');
    if (!tabsContainer) return;
    const scrollAmount = Math.max(tabsContainer.clientWidth * 0.6, 150); // distância de scroll
    // calcula nova posição com base na direção
    const newPos = tabsContainer.scrollLeft + (direction > 0 ? scrollAmount : -scrollAmount);
    tabsContainer.scrollTo({ left: newPos, behavior: 'smooth' }); // rolagem suave
}

// atualiza visibilidade da seta direita dependendo do overflow
function updateArrowVisibility() {
    const tabsContainer = document.getElementById('tabs');
    const right = document.getElementById('tabs-arrow-right');
    if (!tabsContainer || !right) return;

    const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
    // se não houver espaço extra à direita, oculta a seta
    if (maxScroll <= 5 || tabsContainer.scrollLeft >= maxScroll - 5) {
        right.style.visibility = 'hidden';
    } else {
        right.style.visibility = 'visible';
    }
}