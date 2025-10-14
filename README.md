# ✈️ Calendário de Manutenção de Aeronaves

Bem-vindo ao repositório "Calendário de Aeronaves" — uma aplicação estática simples para visualizar e gerenciar o calendário de manutenção de aeronaves.

Este projeto é composto por arquivos HTML/CSS/JS (sem backend) e foi pensado para ser fácil de abrir localmente ou hospedar em qualquer servidor estático.

## Funcionalidades

- Visualização de calendário com eventos de manutenção
- Dados dos eventos centralizados em `data.js`
- Interface responsiva e leve (HTML + CSS + JS)

## Como usar

Opções rápidas para abrir o projeto localmente:

- Abrir diretamente: clique duas vezes em `index.html` no seu gerenciador de arquivos (funciona em muitos navegadores, mas alguns recursos podem exigir servidor local).
- Via servidor HTTP simples (recomendado):

```bash
# a partir da raiz do projeto
python3 -m http.server 8000
# então abra http://localhost:8000 no navegador
```

Ou, se você usa Node.js e tem `live-server` instalado:

```bash
live-server --port=8000
```

## Estrutura de arquivos

- `index.html` — página principal do calendário
- `style.css` — estilos da aplicação
- `script.js` — lógica do calendário e manipulação DOM
- `data.js` — onde estão os eventos (insira/edite aqui as manutenções)
- `README.md` — este arquivo

> Observação: se for necessário persistir dados entre sessões, integre um backend ou use armazenamento remoto (ex.: Firebase, supabase) — atualmente os eventos vêm de `data.js`.

## Desenvolvimento

- Para adicionar ou editar eventos, abra `data.js`. O formato dos dados é comentado no próprio arquivo (procure por exemplos de eventos).
- Ao mudar `script.js` ou `style.css`, atualize o navegador (Ctrl+R) ou use `live-server` para recarregamento automático.

Edge cases a considerar durante desenvolvimento:

- Eventos com horários conflitantes
- Fuso horário do navegador
- Eventos muito longos que quebram a visualização do calendário

## Contribuição

Contribuições são bem-vindas! Siga estes passos simples:

1. Faça um fork do repositório
2. Crie uma branch com sua feature: `git checkout -b feature/minha-melhoria`
3. Faça commits claros e pequenos
4. Abra um Pull Request descrevendo a mudança

Se for algo grande (integração com backend, autenticação, etc.), abra uma issue antes para discutirmos a melhor abordagem.

## Licença

Este repositório não especifica uma licença. Se pretende compartilhar ou permitir contribuições externas, adicione um arquivo `LICENSE` (por exemplo, MIT).

## Contato

Se quiser trocar ideias ou pedir ajuda, abra uma issue no repositório.

---

Obrigado por usar o Calendário de Manutenção de Aeronaves — mantenha tudo em dia! ✈️