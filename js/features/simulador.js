/**
 * ===================================
 * FEATURE: Simulador
 * ===================================
 * Lógica do quiz: iniciar, responder, cronômetro, resultado
 * 
 * Dependências: UIModule, DataModule, Utils
 */

const Simulador = (() => {
    let timerInterval = null;
    let totalTime = 0;

    /**
     * Renderiza a questão atual
     */
    const renderQuestion = () => {
        const state = UIModule.getState();
        const questions = state.filteredQuestions;
        const currentQ = questions[state.quizIndex];
        
        if (!currentQ) return;

        const userAnswer = state.quizAnswers[currentQ.id];
        const isAnswered = userAnswer !== undefined;
        const isCorrect = userAnswer === currentQ.correctAnswer;

        const container = document.getElementById('quizContainer');
        
        let feedbackHtml = '';
        if (isAnswered) {
            feedbackHtml = `
                <div class="${isCorrect ? 'correct-feedback' : 'incorrect-feedback'} show">
                    <div class="feedback-label">${isCorrect ? '✅ Correto!' : '❌ Incorreto'}</div>
                    <p><strong>Explicação:</strong> ${currentQ.explanation}</p>
                    ${!isCorrect ? `<p style="margin-top: 8px;"><strong>Resposta correta:</strong> ${currentQ.options[currentQ.correctAnswer].letter}</p>` : ''}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="quiz-header">
                <div>
                    <h3 style="color: var(--color-primary); margin: 0;">Questão ${state.quizIndex + 1} de ${questions.length}</h3>
                    <div style="margin-top: 8px; color: var(--text-secondary); font-size: 0.9rem;">
                        ${Utils.getTopicLabel(currentQ.topic)} • ${Utils.getBankLabel(currentQ.bank)}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div id="timer" style="font-size: 2rem; color: var(--color-primary); font-weight: bold;">--:--</div>
                    <div style="color: var(--text-secondary); font-size: 0.85rem;">Tempo restante</div>
                </div>
            </div>

            <div class="question-card" style="border-left: none; cursor: default; margin-bottom: 20px;">
                <h3 style="color: var(--text-primary); margin-bottom: 15px;">${currentQ.text}</h3>
                ${currentQ.context ? `<div class="context-box">📌 ${currentQ.context}</div>` : ''}
                
                <div class="options">
                    ${currentQ.options.map((opt, idx) => `
                        <label class="option ${userAnswer === idx ? 'selected' : ''}" 
                         onclick="Simulador.selectAnswer(${currentQ.id}, ${idx})" 
                         style="cursor: pointer;">
                            <input type="radio" name="option" value="${idx}" 
                             ${userAnswer === idx ? 'checked' : ''}>
                            <span class="option-letter-circle">${opt.letter}</span>
                            <span>${opt.text}</span>
                        </label>
                    `).join('')}
                </div>

                ${feedbackHtml}
            </div>

            <div style="display: flex; gap: 10px; justify-content: space-between; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="Simulador.prevQuestion()" 
                 ${state.quizIndex === 0 ? 'disabled style="opacity: 0.5;"' : ''}>⬅️ Anterior</button>
                <div style="flex: 1; text-align: center;">
                    <span style="color: var(--text-secondary);">Progresso: <strong style="color: var(--color-primary);">${state.quizIndex + 1}/${questions.length}</strong></span>
                </div>
                ${state.quizIndex === questions.length - 1 ? 
                    `<button class="btn btn-success" onclick="Simulador.finish()" style="background: var(--color-success);">✅ Finalizar</button>` :
                    `<button class="btn btn-primary" onclick="Simulador.nextQuestion()">Próxima ➡️</button>`
                }
            </div>
        `;
    };

    /**
     * Renderiza resultado final
     */
    const renderResults = () => {
        const state = UIModule.getState();
        const questions = state.filteredQuestions;
        const answers = state.quizAnswers;
        
        let correct = 0;
        let results = [];

        questions.forEach(q => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            if (isCorrect) correct++;
            results.push({ 
                question: q, 
                isCorrect, 
                userAnswer: answers[q.id],
                letter: q.options[answers[q.id]]?.letter || 'N/R'
            });
        });

        const percentage = Utils.calcPercentage(correct, questions.length);
        const score = Utils.calcScore(correct, questions.length);

        // Determinar cor baseada na performance
        let scoreColor = 'var(--color-danger)';
        let scoreBg = '#7f1d1d';
        if (percentage >= 70) {
            scoreColor = 'var(--color-success)';
            scoreBg = '#064e3b';
        } else if (percentage >= 50) {
            scoreColor = 'var(--color-warning)';
            scoreBg = '#92400e';
        }

        const container = document.getElementById('quizContainer');

        container.innerHTML = `
            <div class="stats" style="margin-bottom: 25px;">
                <div class="stat-box" style="background: ${scoreBg}; border-left-color: ${scoreColor};">
                    <div class="stat-number" style="color: ${scoreColor};">${score}</div>
                    <div class="stat-label">Pontuação (0-1000)</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" style="color: var(--color-success);">${correct}</div>
                    <div class="stat-label">Corretas</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" style="color: var(--color-danger);">${questions.length - correct}</div>
                    <div class="stat-label">Erradas</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number" style="color: ${scoreColor};">${percentage}%</div>
                    <div class="stat-label">Taxa de Acerto</div>
                </div>
            </div>

            <h3 style="color: var(--color-primary); margin-bottom: 15px;">📋 Revisão Detalhada</h3>
            <div class="question-list">
                ${results.map((r, idx) => `
                    <div class="question-card" style="border-left-color: ${r.isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
                        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: start;">
                            <h4 style="color: var(--text-primary); margin: 0; flex: 1;">${idx + 1}. ${r.question.text}</h4>
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; 
                             ${r.isCorrect ? 'background: #064e3b; color: var(--color-success);' : 'background: #7f1d1d; color: var(--color-danger);'};">
                                ${r.isCorrect ? '✅ Correto' : '❌ Errado'}
                            </span>
                        </div>
                        <p style="margin: 8px 0; color: var(--text-secondary);"><strong>Sua resposta:</strong> ${r.letter}</p>
                        <p style="margin: 8px 0; color: var(--color-success);"><strong>Gabarito:</strong> ${r.question.options[r.question.correctAnswer].letter}</p>
                        <div class="context-box" style="margin-top: 12px;">
                            <strong>💡 Explicação:</strong> ${r.question.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="Simulador.restart()">🔄 Novo Simulado</button>
                <button class="btn btn-secondary" onclick="UIModule.switchTab('gerenciador')">📚 Voltar</button>
            </div>
        `;
    };

    /**
     * Inicia o cronômetro
     */
    const startTimer = () => {
        clearInterval(timerInterval);
        totalTime = UIModule.getState().filteredQuestions.length * 180; // 3 min por questão

        timerInterval = setInterval(() => {
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.textContent = Utils.formatTime(totalTime);
                
                // Mudar cor se tempo está acabando
                if (totalTime <= 60) {
                    timerEl.style.color = 'var(--color-danger)';
                } else if (totalTime <= 300) {
                    timerEl.style.color = 'var(--color-warning)';
                }
            }

            if (totalTime <= 0) {
                clearInterval(timerInterval);
                Simulador.finish();
            }
            totalTime--;
        }, 1000);
    };

    return {
        /**
         * Inicia um novo simulado
         */
        start: () => {
            const state = UIModule.getState();
            
            if (state.filteredQuestions.length === 0) {
                alert('❌ Nenhuma questão encontrada. Ajuste seus filtros!');
                return;
            }

            UIModule.setState({
                quizMode: true,
                quizIndex: 0,
                quizAnswers: {}
            });

            document.getElementById('quizContainer').style.display = 'block';
            renderQuestion();
            startTimer();
        },

        /**
         * Registra resposta e renderiza questão
         */
        selectAnswer: (questionId, optionIndex) => {
            const state = UIModule.getState();
            state.quizAnswers[questionId] = optionIndex;
            renderQuestion();
        },

        /**
         * Vai para próxima questão
         */
        nextQuestion: () => {
            const state = UIModule.getState();
            if (state.quizIndex < state.filteredQuestions.length - 1) {
                state.quizIndex++;
                renderQuestion();
            }
        },

        /**
         * Volta para questão anterior
         */
        prevQuestion: () => {
            const state = UIModule.getState();
            if (state.quizIndex > 0) {
                state.quizIndex--;
                renderQuestion();
            }
        },

        /**
         * Finaliza o simulado
         */
        finish: () => {
            clearInterval(timerInterval);
            renderResults();
        },

        /**
         * Reinicia um novo simulado
         */
        restart: () => {
            UIModule.setState({
                quizMode: false,
                quizIndex: 0,
                quizAnswers: {}
            });
            document.getElementById('quizContainer').style.display = 'none';
            UIModule.switchTab('simulador');
        }
    };
})();
