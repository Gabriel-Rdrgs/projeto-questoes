/**
 * ===================================
 * FEATURE: Gerenciador
 * ===================================
 * CRUD de questões: criar, editar, deletar questões
 * 
 * Dependências: UIModule, DataModule, Utils
 */

const Gerenciador = (() => {
    /**
     * Gera o formulário de questão (novo ou edição)
     */
    const generateForm = (questionId = null) => {
        const question = questionId ? DataModule.getById(questionId) : null;
        
        const topicsHtml = Utils.getTopics().map(t => 
            `<option value="${t}" ${question?.topic === t ? 'selected' : ''}>${Utils.getTopicLabel(t)}</option>`
        ).join('');
        
        const banksHtml = Utils.getBanks().map(b => 
            `<option value="${b}" ${question?.bank === b ? 'selected' : ''}>${Utils.getBankLabel(b)}</option>`
        ).join('');
        
        const difficultiesHtml = Utils.getDifficulties().map(d => 
            `<option value="${d}" ${question?.difficulty === d ? 'selected' : ''}>${Utils.getDifficultyLabel(d)}</option>`
        ).join('');

        const optionsHtml = question ? 
            question.options.map((opt, idx) => `
                <div class="option-input">
                    <span class="option-letter">${opt.letter}</span>
                    <input type="text" value="${opt.text}" id="option_${idx}" placeholder="Opção ${opt.letter}" required>
                </div>
            `).join('') 
            : Array(5).fill().map((_, idx) => `
                <div class="option-input">
                    <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                    <input type="text" id="option_${idx}" placeholder="Opção ${String.fromCharCode(65 + idx)}" required>
                </div>
            `).join('');

        return `
            <div class="form-group">
                <label for="formTopic">Assunto *</label>
                <select id="formTopic" required>
                    <option value="">Selecione um assunto</option>
                    ${topicsHtml}
                </select>
            </div>

            <div class="form-group">
                <label for="formBank">Banca/Ano *</label>
                <select id="formBank" required>
                    <option value="">Selecione a banca</option>
                    ${banksHtml}
                </select>
            </div>

            <div class="form-group">
                <label for="formDifficulty">Dificuldade *</label>
                <select id="formDifficulty" required>
                    <option value="">Selecione a dificuldade</option>
                    ${difficultiesHtml}
                </select>
            </div>

            <div class="form-group">
                <label for="formText">Enunciado da Questão *</label>
                <textarea id="formText" placeholder="Digite o enunciado..." required>${question?.text || ''}</textarea>
            </div>

            <div class="form-group">
                <label for="formContext">Contexto (opcional)</label>
                <textarea id="formContext" placeholder="Informações adicionais sobre o contexto...">${question?.context || ''}</textarea>
            </div>

            <div class="form-group">
                <label>Alternativas de Resposta *</label>
                <div class="option-group">${optionsHtml}</div>
            </div>

            <div class="form-group">
                <label for="formCorrectAnswer">Alternativa Correta (A=0, B=1, C=2, D=3, E=4) *</label>
                <select id="formCorrectAnswer" required>
                    <option value="">Selecione</option>
                    <option value="0" ${question?.correctAnswer === 0 ? 'selected' : ''}>A</option>
                    <option value="1" ${question?.correctAnswer === 1 ? 'selected' : ''}>B</option>
                    <option value="2" ${question?.correctAnswer === 2 ? 'selected' : ''}>C</option>
                    <option value="3" ${question?.correctAnswer === 3 ? 'selected' : ''}>D</option>
                    <option value="4" ${question?.correctAnswer === 4 ? 'selected' : ''}>E</option>
                </select>
            </div>

            <div class="form-group">
                <label for="formExplanation">Explicação (Gabarito Comentado) *</label>
                <textarea id="formExplanation" placeholder="Explique por que essa é a resposta correta..." required>${question?.explanation || ''}</textarea>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
                <button type="button" class="btn btn-primary" onclick="Gerenciador.save(${questionId || 'null'})">💾 Salvar Questão</button>
                <button type="button" class="btn btn-secondary" onclick="Gerenciador.closeModal()">❌ Cancelar</button>
            </div>
        `;
    };

    return {
        /**
         * Abre modal para adicionar questão
         */
        openModal: () => {
            document.getElementById('modalTitle').textContent = '➕ Adicionar Questão';
            document.getElementById('questionForm').innerHTML = generateForm();
            document.getElementById('questionModal').classList.add('active');
        },

        /**
         * Abre modal para editar questão
         */
        edit: (id) => {
            document.getElementById('modalTitle').textContent = '✏️ Editar Questão';
            document.getElementById('questionForm').innerHTML = generateForm(id);
            document.getElementById('questionModal').classList.add('active');
        },

        /**
         * Fecha modal
         */
        closeModal: () => {
            document.getElementById('questionModal').classList.remove('active');
            document.getElementById('successMessage').classList.remove('show');
        },

        /**
         * Salva questão (novo ou edição)
         */
        save: (id) => {
            // Validar campos obrigatórios
            const formFields = {
                topic: document.getElementById('formTopic').value,
                bank: document.getElementById('formBank').value,
                difficulty: document.getElementById('formDifficulty').value,
                text: document.getElementById('formText').value.trim(),
                context: document.getElementById('formContext').value.trim(),
                correctAnswer: parseInt(document.getElementById('formCorrectAnswer').value),
                explanation: document.getElementById('formExplanation').value.trim()
            };

            // Validações
            if (!formFields.topic || !formFields.bank || !formFields.difficulty) {
                alert('❌ Preencha assunto, banca e dificuldade!');
                return;
            }

            if (!formFields.text) {
                alert('❌ Digite o enunciado da questão!');
                return;
            }

            if (isNaN(formFields.correctAnswer)) {
                alert('❌ Selecione a resposta correta!');
                return;
            }

            if (!formFields.explanation) {
                alert('❌ Adicione uma explicação!');
                return;
            }

            // Coletar opções
            const options = [];
            for (let i = 0; i < 5; i++) {
                const optionText = document.getElementById(`option_${i}`).value.trim();
                if (!optionText) {
                    alert(`❌ Preencha a alternativa ${String.fromCharCode(65 + i)}!`);
                    return;
                }
                options.push({
                    letter: String.fromCharCode(65 + i),
                    text: optionText
                });
            }

            // Criar objeto questão
            const question = {
                ...formFields,
                options
            };

            // Salvar ou atualizar
            if (id) {
                DataModule.update(id, question);
            } else {
                DataModule.add(question);
            }

            // Mostrar mensagem de sucesso
            document.getElementById('successMessage').classList.add('show');
            
            // Fechar após 1.5s
            setTimeout(() => {
                Gerenciador.closeModal();
                // Recarregar lista
                const gerenciadorTab = document.getElementById('gerenciador');
                if (gerenciadorTab.classList.contains('active')) {
                    UIModule.switchTab('gerenciador');
                }
            }, 1500);
        },

        /**
         * Deleta questão com confirmação
         */
        delete: (id) => {
            if (confirm('⚠️ Tem certeza que deseja deletar essa questão? Esta ação não pode ser desfeita.')) {
                if (DataModule.delete(id)) {
                    UIModule.switchTab('gerenciador');
                } else {
                    alert('❌ Erro ao deletar questão!');
                }
            }
        }
    };
})();
