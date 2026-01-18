/**
 * ===================================
 * MÓDULO: UI
 * ===================================
 * Renderização de componentes e interface
 */

const UIModule = (() => {
    // Estado centralizado
    const state = {
        currentTab: 'simulador',
        filteredQuestions: [],
        quizMode: false,
        quizIndex: 0,
        quizAnswers: {},
        editingId: null,
        timerInterval: null,
        searchText: ''
    };

    /**
     * Funções de renderização
     */
    const render = {
        /**
         * Renderiza abas principais
         */
        tabs: () => {
            const container = document.getElementById('tabContainer');
            container.innerHTML = Utils.getTabs().map(tab => 
                `<button class="tab-btn ${tab.name === state.currentTab ? 'active' : ''}" 
                 onclick="UIModule.switchTab('${tab.name}')">${tab.label}</button>`
            ).join('');
        },

        /**
         * Renderiza aba Simulador
         */
        simulador: () => {
            const html = `
                <div class="filter-section">
                    <h3 style="margin-bottom: 15px; color: var(--color-primary);">🔍 Filtros Avançados</h3>
                    <div class="filter-row">
                        <div class="filter-group">
                            <label for="filterTopic">Assunto</label>
                            <select id="filterTopic" onchange="UIModule.applyFilters()">
                                <option value="">Todos os assuntos</option>
                                ${Utils.getTopics().map(t => 
                                    `<option value="${t}">${Utils.getTopicLabel(t)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="filterBank">Banca/Ano</label>
                            <select id="filterBank" onchange="UIModule.applyFilters()">
                                <option value="">Todas as bancas</option>
                                ${Utils.getBanks().map(b => 
                                    `<option value="${b}">${Utils.getBankLabel(b)}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="filterDifficulty">Dificuldade</label>
                            <select id="filterDifficulty" onchange="UIModule.applyFilters()">
                                <option value="">Todas as dificuldades</option>
                                ${Utils.getDifficulties().map(d => 
                                    `<option value="${d}">${Utils.getDifficultyLabel(d)}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="filter-buttons">
                        <button class="btn btn-primary" onclick="Simulador.start()">🎮 Iniciar Simulado</button>
                        <button class="btn btn-secondary btn-sm" onclick="UIModule.resetFilters()">🔄 Limpar Filtros</button>
                    </div>
                </div>
                <div class="stats" id="statsContainer" style="display: none;">
                    <div class="stat-box">
                        <div class="stat-number" id="questionsCount">0</div>
                        <div class="stat-label">Questões Encontradas</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number" id="topicsCount">0</div>
                        <div class="stat-label">Assuntos</div>
                    </div>
                </div>
                <div id="quizContainer" style="display: none;"></div>
            `;
            document.getElementById('simulador').innerHTML = html;
        },

        /**
         * Renderiza aba Gerenciador
         */
        gerenciador: () => {
            const all = DataModule.getAll();
            const stats = DataModule.getStats();
            
            const html = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="Gerenciador.openModal()">➕ Adicionar Nova Questão</button>
                </div>
                <div class="stats">
                    <div class="stat-box">
                        <div class="stat-number">${stats.total}</div>
                        <div class="stat-label">Total de Questões</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${stats.topics}</div>
                        <div class="stat-label">Assuntos</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-number">${stats.banks}</div>
                        <div class="stat-label">Bancas/Anos</div>
                    </div>
                </div>
                <div class="filter-section" style="margin-bottom: 20px;">
                    <input type="text" id="searchQuestions" placeholder="🔍 Pesquisar..." 
                     onkeyup="UIModule.searchQuestions()" 
                     style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--bg-muted); 
                     background-color: var(--bg-dark); color: var(--text-primary);">
                </div>
                <div class="question-list" id="questionsList"></div>
            `;
            document.getElementById('gerenciador').innerHTML = html;
            render.questionsList();
        },

        /**
         * Renderiza lista de questões
         */
        questionsList: () => {
            const all = DataModule.getAll();
            const container = document.getElementById('questionsList');
            
            if (all.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>📚 Nenhuma questão encontrada</h3>
                        <p>Comece adicionando uma nova questão ao banco.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = all.map(q => `
                <div class="question-card" data-id="${q.id}">
                    <div class="question-header">
                        <div style="flex: 1;">
                            <p class="question-text">${q.text}</p>
                            <div class="question-meta">
                                <span class="badge badge-topic">${Utils.getTopicLabel(q.topic)}</span>
                                <span class="badge badge-bank">${Utils.getBankLabel(q.bank)}</span>
                                <span class="difficulty ${q.difficulty}">${Utils.getDifficultyLabel(q.difficulty)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="question-actions">
                        <button class="btn btn-secondary btn-sm" onclick="Gerenciador.edit(${q.id})">✏️ Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="Gerenciador.delete(${q.id})">🗑️ Deletar</button>
                    </div>
                </div>
            `).join('');
        },

        /**
         * Renderiza aba Importador
         */
        importador: () => {
            const html = `
                <div class="form-section">
                    <h3 class="section-title">📥 Importar Questões (JSON)</h3>
                    <p style="margin-bottom: 15px; color: var(--text-secondary);">Selecione um arquivo JSON com questões:</p>
                    <div class="form-group">
                        <input type="file" id="fileInput" accept=".json" style="padding: 10px; cursor: pointer;">
                    </div>
                    <button class="btn btn-primary" onclick="Importador.importFile()">📤 Importar</button>
                </div>
                <div class="form-section">
                    <h3 class="section-title">📤 Exportar Questões</h3>
                    <p style="margin-bottom: 15px; color: var(--text-secondary);">Faça backup de suas questões:</p>
                    <button class="btn btn-success" onclick="Importador.exportJSON()">💾 Exportar JSON</button>
                </div>
            `;
            document.getElementById('importar').innerHTML = html;
        }
    };

    return {
        /**
         * Inicializa o módulo
         */
        init: () => {
            render.tabs();
            render.simulador();
        },

        /**
         * Troca de aba
         */
        switchTab: (tabName) => {
            state.currentTab = tabName;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            render.tabs();

            if (tabName === 'simulador') render.simulador();
            if (tabName === 'gerenciador') render.gerenciador();
            if (tabName === 'importar') render.importador();
        },

        /**
         * Aplica filtros
         */
        applyFilters: () => {
            const topic = document.getElementById('filterTopic')?.value || '';
            const bank = document.getElementById('filterBank')?.value || '';
            const difficulty = document.getElementById('filterDifficulty')?.value || '';

            state.filteredQuestions = DataModule.filter({ topic, bank, difficulty });
            
            const statsContainer = document.getElementById('statsContainer');
            if (state.filteredQuestions.length > 0) {
                statsContainer.style.display = 'grid';
                document.getElementById('questionsCount').textContent = state.filteredQuestions.length;
                const uniqueTopics = new Set(state.filteredQuestions.map(q => q.topic)).size;
                document.getElementById('topicsCount').textContent = uniqueTopics;
            }
        },

        /**
         * Reseta filtros
         */
        resetFilters: () => {
            document.getElementById('filterTopic').value = '';
            document.getElementById('filterBank').value = '';
            document.getElementById('filterDifficulty').value = '';
            document.getElementById('statsContainer').style.display = 'none';
            state.filteredQuestions = [];
        },

        /**
         * Pesquisa questões
         */
        searchQuestions: () => {
            const search = document.getElementById('searchQuestions')?.value.toLowerCase() || '';
            const cards = document.querySelectorAll('.question-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(search) ? 'block' : 'none';
            });
        },

        /**
         * Retorna estado
         */
        getState: () => state,

        /**
         * Atualiza estado
         */
        setState: (updates) => {
            Object.assign(state, updates);
        }
    };
})();
