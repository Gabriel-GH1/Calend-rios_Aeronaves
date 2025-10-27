// data.js - Dados das aeronaves ATUALIZADO com plannedExit
//plannedExit é somente quando ocorrer atraso em alguma aeronave
const AIRCRAFT_DATA = {
    "pp-fcf": {
        prefix: "PP-FCF",
        name: "Embraer Citation CJ3+",
        description: "Aeronave comercial de corredor único",
        year: 2025,
        plannedExit: "2025-09-12",
        maintenances: [
            {
                entrada: "2025-07-21",
                saida: "2025-09-16",
                descricao: "CVA + DOC44"
            }
        ]
    },
    "pr-msz": {
        prefix: "PR-MSZ",
        name: "Embraer Citation CJ2",
        description: "Jato regional",
        year: 2025,
        plannedExit: "2025-08-29", 
        maintenances: [
            {
                entrada: "2025-08-08",
                saida: "2025-08-29",
                descricao: "Pane Precooler + CVA"
            }
        ]
    },
    "pp-emo": {
        prefix: "PP-EMO",
        name: "EMB-505 - Phenom 300",
        description: "Jato regional menor",
        year: 2025,
        plannedExit: "2025-08-29",
        maintenances: [
            {
                entrada: "2025-08-15",
                saida: "2025-08-29",
                descricao: "Manutenção CVA"
            }
        ]
    },
    "ps-ece": {
        prefix: "PS-ECE",
        name: "EMB-505 - Phenom 300",
        description: "Aeronave narrow-body",
        year: 2025,
        plannedExit: "2025-08-27",
        maintenances: [
            {
                entrada: "2025-08-15",
                saida: "2025-08-27",
                descricao: "Manutenção CVA"
            }
        ]
    },
    "pr-rex": {
        prefix: "PR-REX",
        name: "EMB-500 - Phenom 100",
        description: "Aeronave comercial",
        year: 2025,
        plannedExit: "2025-08-14", // ← MUDE ESTA DATA para MAIS CEDO da saída pra pintar de vermelho no script.js
        maintenances: [
            {
                entrada: "2025-04-09",
                saida: "2025-08-14",
                descricao: "Manutenção CVA"
            }
        ]
    },
    "pr-arb": {
        prefix: "PR-ARB",
        name: "525 - Citation CJ1",
        description: "Jato regional",
        year: 2025,
        plannedExit: "2025-09-30", // ← MUDE ESTA DATA para MAIS CEDO da saída pra pintar de vermelho NO SCRIPT.JS
        maintenances: [
            {
                entrada: "2025-02-10",
                saida: "2025-10-21", // Data REAL (vai criar atraso)
                descricao: "Manutenção CVA"
            }
        ]
    },
    "pr-day": {
        prefix: "PR-DAY",
        name: "EMB-500 - Phenom 100",
        description: "Aeronave comercial",
        year: 2025,
        plannedExit: "2025-09-30",
        maintenances: [
            {
                entrada: "2025-09-18",
                saida: "2025-09-30",
                descricao: "Manutenção CVA"
            }
        ]
    },
    "pr-fil": {
        prefix: "PR-FIL",
        name: "EMB-500 - Phenom 100",
        description: "Revisão 15 anos + CVA",
        year: 2025,
        plannedExit: "2025-12-01",
        maintenances: [
            {
                entrada: "2025-10-01",
                saida: "2025-12-01",
                descricao: "Manutenção 15 Anos + CVA"
            }
        ]
    },
    "pr-eft": {
        prefix: "PR-EFT",
        name: "EMB-505 - Phenom 300",
        description: "Manutenção intervalos e CVA",
        year: 2025,
        plannedExit: "2025-10-31",
        maintenances: [
            {
                entrada: "2025-10-10",
                saida: "2025-10-31",
                descricao: "CVA + Intervalos"
            }
        ]
    },
    "ps-cmc": {
        prefix: "PS-CMC",
        name: "EMB-505 - Phenom 300",
        description: "Manutenção intervalos e CVA",
        year: 2025,
        plannedExit: "2025-11-14",
        maintenances: [
            {
                entrada: "2025-10-24",
                saida: "2025-11-14",
                descricao: "CVA + Intervalos"
            }
        ]
    },
    "pp-nld": {
        prefix: "PP-NLD",
        name: "Phenom 300",
        description: "Manutenção intervalos e CVA",
        year: 2025,
        plannedExit: "2025-12-12",
        maintenances: [
            {
                entrada: "2025-10-24",
                saida: "2025-12-12",
                descricao: "CVA + Intervalos"
            }
        ]
    },
    "pp-lja": {
        prefix: "PP-LJA",
        name: "Phenom 300",
        description: "CVA",
        year: 2025,
        plannedExit: "2025-12-20",
        maintenances: [
            {
                entrada: "2025-12-05",
                saida: "2025-12-20",
                descricao: "CVA"
            }
        ]
    },
    // Placeholders adicionadas para edição futura
    "pr-cmq": {
        prefix: "PR-CMQ",
        name: "EMB-500 - Phenom 100",
        description: "CVA + 48 MO",
        year: 2025,
        // plannedExit opcional
        maintenances: [
            {

                entrada: "2025-10-27",
                saida: "2025-11-14",
                descricao: "CVA + 48 MO"
            }
        ]
    },
    "zz-placeholder2": {
        prefix: "ZZ-PL2",
        name: "Placeholder 2 (editar)",
        description: "Preencha nome, datas e manutenções posteriormente",
        year: 2025,
        maintenances: []
    },
};
