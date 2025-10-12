// script.js - gera abas e calendários dinamicamente (suporta múltiplas manutenções)
// Os dados são importados do arquivo data.js

let aircraftData = {};

function parseDateISO(dateString) {
  // cria uma data no horário local sem problemas de timezone
  if (!dateString) return null;
  return new Date(dateString + "T00:00:00");
}

// soma dias úteis para um período
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

function sumBusinessDays(maintenances) {
  if (!Array.isArray(maintenances)) return 0;
  return maintenances.reduce((acc, m) => {
    const e = parseDateISO(m.entrada);
    const s = parseDateISO(m.saida);
    if (!e || !s) return acc;
    return acc + calculateDaysDifference(e, s);
  }, 0);
}

// Inicializa o app com os dados do data.js
// Aguarda o DOM estar pronto antes de inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AIRCRAFT_DATA !== 'undefined') {
    initializeWithData(AIRCRAFT_DATA);
  } else {
    console.error('AIRCRAFT_DATA não foi carregado. Certifique-se de que data.js está incluído no HTML.');
  }
});

function initializeWithData(data) {
  aircraftData = data;
  buildUIFromData(aircraftData);
  // gerar calendários
  Object.keys(aircraftData).forEach((id) => {
    generateCalendar(id, aircraftData[id]);
  });
  // abrir a primeira aba por padrão
  const firstId = Object.keys(aircraftData)[0];
  if (firstId) {
    const firstButton = document.querySelector(
      `.tab-button[data-aircraft="${firstId}"]`
    );
    if (firstButton) {
      openTab(firstId, firstButton);
    }
  }
  const el = document.getElementById("current-date");
  if (el) el.textContent = new Date().toLocaleDateString("pt-BR");
}

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
    // show basic tooltip info on hover
    button.addEventListener("mouseenter", () => {
      const firstMaint = item.maintenances && item.maintenances[0];
      const e = parseDateISO(firstMaint?.entrada);
      const s = parseDateISO(firstMaint?.saida);
      if (e && s)
        tooltip.textContent = `Entrada: ${e.toLocaleDateString(
          "pt-BR"
        )} | Saída: ${s.toLocaleDateString("pt-BR")}`;
      else
        tooltip.textContent = "Sem manutenção registrada";
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

    // legend
    const legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML =
      '<div class="legend-item"><div class="color-box maintenance-color"></div><span>Período de Manutenção</span></div><div class="legend-item"><div class="color-box delay-color"></div><span>Dias de Atraso</span></div>';
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

function openTab(tabId, button) {
  // esconder todos os conteúdos
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

function updateAircraftInfo(aircraftId) {
  const item = aircraftData[aircraftId];
  const infoElement = document.getElementById(`${aircraftId}-info`);
  const listElement = document.getElementById(`${aircraftId}-maint-list`);
  if (!item || !infoElement || !listElement) return;

  const totalDays = sumBusinessDays(item.maintenances || []);
  infoElement.innerHTML = `<strong>Nome:</strong> ${
    item.name || "-"
  } | <strong>Ano:</strong> ${
    item.year || "-"
  } | <strong>Total (dias úteis):</strong> ${totalDays}`;

  // preencher lista de manutenções
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

function generateCalendar(aircraftId, item) {
  const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
  if (!calendarContainer) return;

  // limpar caso já exista
  calendarContainer.innerHTML = "";

  // compõe um array de períodos válidos
  const periods = (item.maintenances || [])
    .map((m) => ({
      entrada: parseDateISO(m.entrada),
      saida: parseDateISO(m.saida),
      descricao: m.descricao || "",
    }))
    .filter((p) => p.entrada && p.saida);

  const year =
    item.year ||
    (periods[0] && periods[0].entrada && periods[0].entrada.getFullYear()) ||
    new Date().getFullYear();

  const saidaPlanejada =
    aircraftId === "pp-fcf" ? parseDateISO("2025-09-12") : null;

  const saidaDates = {
    "pp-fcf": "16/09",
    "pr-msz": "29/08",
    "pp-emo": "29/08",
    "ps-ece": "27/07",
    "pr-rex": "14/08",
    "pr-arb": "07/10",
    "pr-day": "30/09",
    "pr-fil": "01/12",
    "pr-eft": "31/10",
  };

  for (let month = 0; month < 12; month++) {
    const monthElement = document.createElement("div");
    monthElement.className = "month";

    const monthName = document.createElement("div");
    monthName.className = "month-name";
    monthName.textContent = new Date(year, month, 1).toLocaleDateString(
      "pt-BR",
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

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "day empty";
      daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = day;

      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();

      // verificar se pertence a algum período de manutenção (e é dia útil)
      const matching = periods.find(
        (p) =>
          currentDate >= p.entrada &&
          currentDate <= p.saida &&
          dayOfWeek !== 0 &&
          dayOfWeek !== 6
      );
      if (matching) {
        dayElement.classList.add("maintenance");
        const tooltip = document.createElement("div");
        tooltip.className = "day-tooltip";

        const currentDay = String(day).padStart(2, "0");
        const currentMonth = String(month + 1).padStart(2, "0");
        const currentDateFormatted = `${currentDay}/${currentMonth}`;

        // Verificar se é o último dia útil do período de manutenção
        const isLastDay = currentDate.getTime() === matching.saida.getTime();
        
        // Verificar se há atraso (específico para PP-FCF)
        const hasDelay = aircraftId === "pp-fcf" && saidaPlanejada && currentDate > saidaPlanejada;

        if (isLastDay) {
          if (hasDelay) {
            dayElement.classList.add("delay");
            tooltip.textContent = `${item.prefix} - Manutenção concluída com atraso`;
          } else {
            tooltip.textContent = `${item.prefix} - Manutenção concluída`;
          }
        } else {
          if (hasDelay) {
            dayElement.classList.add("delay");
            tooltip.textContent = `${item.prefix} - Em atraso`;
          } else {
            tooltip.textContent = `${item.prefix} - Em manutenção`;
          }
        }
        
        dayElement.appendChild(tooltip);
      }

      daysContainer.appendChild(dayElement);
    }

    monthElement.appendChild(daysContainer);
    calendarContainer.appendChild(monthElement);
  }

  // se a aba já for ativa, atualiza informações
  if (document.getElementById(aircraftId).classList.contains("active")) {
    updateAircraftInfo(aircraftId);
  }
}
