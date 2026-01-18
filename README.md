# 📚 Banco de Questões ENEM/Vestibulares - Versão Modular

Uma aplicação web profissional, modular e escalável para gerenciar, filtrar e praticar questões de ENEM e vestibulares.

## ✨ Características

- **🎮 Simulador Interativo** - Quiz com cronômetro, filtros avançados e feedback instantâneo
- **⚙️ Gerenciador Completo** - CRUD de questões com formulário intuitivo
- **💾 Import/Export** - Backup em JSON e CSV
- **📊 Estatísticas** - Histórico de desempenho (em desenvolvimento)
- **🎨 Dark Mode** - Interface moderna e responsiva
- **💪 Modular** - Código limpo e fácil de manter

## 📁 Estrutura de Arquivos

```
projeto-questoes/
├── index.html                   # Ponto de entrada
├── css/
│   ├── globals.css             # Variáveis, reset, estilos base
│   └── components.css          # Componentes reutilizáveis
├── js/
│   ├── modules/                # Módulos core
│   │   ├── utils.js            # Funções auxiliares
│   │   ├── data.js             # Gerenciamento de dados
│   │   └── ui.js               # Renderização de interface
│   ├── features/               # Funcionalidades específicas
│   │   ├── simulador.js        # Quiz com cronômetro
│   │   ├── gerenciador.js      # CRUD de questões
│   │   ├── importador.js       # Import/Export
│   │   └── estatisticas.js     # Dashboard (placeholder)
│   └── app.js                  # Inicialização e orquestração
└── README.md                   # Este arquivo
```

## 🚀 Como Usar

### 1. **Abrir a Aplicação**
Basta abrir `index.html` em qualquer navegador moderno (Chrome, Firefox, Safari, Edge).

### 2. **Simulador - Praticar Questões**
- Acesse a aba **"🎮 Simulador"**
- Selecione os filtros desejados (Assunto, Banca, Dificuldade)
- Clique em **"🎮 Iniciar Simulado"**
- Responda às questões contra o cronômetro (3 minutos por questão)
- Receba feedback instantâneo com explicações
- Veja seu resultado final com revisão detalhada

### 3. **Gerenciador - Adicionar/Editar Questões**
- Acesse a aba **"⚙️ Gerenciador"**
- Clique em **"➕ Adicionar Nova Questão"** para criar
- Preencha todos os campos:
  - Assunto, Banca, Dificuldade
  - Enunciado e contexto
  - 5 alternativas (A-E)
  - Marque a correta
  - Adicione uma explicação
- Clique em **"💾 Salvar Questão"**
- Para editar, clique em **"✏️ Editar"** no card da questão
- Para deletar, clique em **"🗑️ Deletar"**

### 4. **Importador - Backup e Compartilhamento**
- Acesse a aba **"📥 Importar/Exportar"**
- **Exportar**: Clique em **"💾 Exportar JSON"** para fazer backup
- **Importar**: Selecione um arquivo JSON e clique em **"📤 Importar"**
- **Exportar CSV**: Para compartilhar em planilhas

## 🏗️ Arquitetura

### Módulos Core

#### `utils.js` - Funções Auxiliares
```javascript
Utils.getTopicLabel(topic)        // "egito" → "Antigo Egito"
Utils.getBankLabel(bank)           // "enem-2024" → "ENEM 2024"
Utils.getDifficultyLabel(diff)     // "easy" → "⭐ Fácil"
Utils.formatTime(seconds)          // 180 → "03:00"
Utils.calcPercentage(correct, total)  // Calcula percentual
```

#### `data.js` - Gerenciamento de Dados
```javascript
DataModule.getAll()                // Retorna todas as questões
DataModule.getById(id)             // Busca por ID
DataModule.add(question)           // Adiciona nova
DataModule.update(id, question)    // Atualiza
DataModule.delete(id)              // Remove
DataModule.filter(filters)         // Filtra por critérios
DataModule.search(text)            // Busca por texto
DataModule.getStats()              // Estatísticas gerais
```

#### `ui.js` - Renderização de Interface
```javascript
UIModule.switchTab(tabName)        // Troca de aba
UIModule.applyFilters()            // Aplica filtros
UIModule.searchQuestions()         // Pesquisa questões
UIModule.getState()                // Retorna estado
UIModule.setState(updates)         // Atualiza estado
```

### Features Específicas

#### `simulador.js` - Quiz
```javascript
Simulador.start()                  // Inicia simulado
Simulador.selectAnswer(qId, idx)   // Registra resposta
Simulador.nextQuestion()           // Próxima questão
Simulador.prevQuestion()           // Questão anterior
Simulador.finish()                 // Finaliza simulado
Simulador.restart()                // Novo simulado
```

#### `gerenciador.js` - CRUD
```javascript
Gerenciador.openModal()            // Formulário novo
Gerenciador.edit(id)               // Formulário edição
Gerenciador.save(id)               // Salva/atualiza
Gerenciador.delete(id)             // Deleta questão
Gerenciador.closeModal()           // Fecha modal
```

#### `importador.js` - Import/Export
```javascript
Importador.importFile()            // Importa JSON
Importador.exportJSON()            // Exporta JSON
Importador.exportCSV()             // Exporta CSV
```

#### `estatisticas.js` - Analytics
```javascript
Estatisticas.save(result)          // Salva resultado
Estatisticas.getHistory()          // Histórico de simulados
Estatisticas.getOverallStats()     // Estatísticas gerais
Estatisticas.getRecommendations()  // Recomendações
```

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no **localStorage** do navegador:

- **Questões**: Salvas em `questionsData`
- **Histórico**: Salvo em `quizHistory` (futuro)

⚠️ **Importante**: Limpar cache/cookies pode perder dados. Use **Export JSON** para fazer backup!

## 🎨 Customização

### Adicionar Novo Tópico
Em `js/modules/utils.js`, add in `labels.topics`:
```javascript
'roma': 'Império Romano',
```

### Adicionar Nova Banca
Em `js/modules/utils.js`, add in `labels.banks`:
```javascript
'uerj-2024': 'UERJ 2024',
```

### Mudar Cores
Em `css/globals.css`, altere as CSS variables:
```css
:root {
    --color-primary: #38bdf8;        /* Azul */
    --color-primary-dark: #0284c7;
    --color-success: #10b981;        /* Verde */
    --color-danger: #ef4444;         /* Vermelho */
}
```

## 🔧 Adicionar Nova Feature

1. Crie um novo arquivo em `js/features/novafeature.js`
2. Use o padrão Module Pattern (IIFE):
```javascript
const NovaFeature = (() => {
    return {
        init: () => { /* ... */ },
        method1: () => { /* ... */ }
    };
})();
```

3. Importe no `index.html` ANTES de `app.js`
4. Chame da UI ou de outras features

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: Layout completo com 3 colunas
- **Tablet**: Grid adaptável
- **Mobile**: Stack vertical, botões full-width

## ⌨️ Atalhos de Teclado

- **ESC**: Fechar modal
- **→ (Seta direita)**: Próxima questão no quiz
- **← (Seta esquerda)**: Questão anterior no quiz

## 🐛 Troubleshooting

### "Minhas questões desapareceram!"
- Dados estão em localStorage
- Tente limpar cache (Ctrl+Shift+Del)
- Se perdeu, faça Import do backup JSON

### "Simulado trava"
- Recarregue a página (F5)
- Verifique console (F12) para erros
- Tente com questões diferentes

### "Botões não funcionam"
- Certifique que todos os arquivos JS estão carregados
- Verifique em F12 se há erros
- Tente em outro navegador

## 🚀 Próximas Features

- [ ] **Modo Estudar** - Explicações expandidas
- [ ] **Flashcards** - Revisão rápida
- [ ] **Gráficos** - Desempenho por tópico
- [ ] **Certificados** - PDF com resultado
- [ ] **Offline** - Funciona sem internet
- [ ] **Tema Claro** - Light mode
- [ ] **Dark/Light Toggle** - Alternar temas

## 📝 Licença

Projeto educacional. Use livremente para estudos!

## 👨‍💻 Desenvolvedor

Criado como plataforma de estudo para ENEM/Vestibulares.

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0-modular  
**Status**: ✅ Funcional e Modular
