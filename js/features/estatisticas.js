/**
 * ===================================
 * FEATURE: Estatísticas
 * ===================================
 * Análise de desempenho: histórico, gráficos, recomendações
 * 
 * Dependências: DataModule, Utils
 * [PLACEHOLDER - Para desenvolvimento futuro]
 */

const Estatisticas = (() => {
    const STATS_KEY = 'quizHistory';

    return {
        /**
         * Salva resultado de simulado
         */
        save: (result) => {
            try {
                const history = JSON.parse(localStorage.getItem(STATS_KEY) || '[]');
                history.push({
                    date: new Date().toISOString(),
                    score: result.score,
                    percentage: result.percentage,
                    correct: result.correct,
                    total: result.total,
                    filters: result.filters
                });
                localStorage.setItem(STATS_KEY, JSON.stringify(history));
            } catch (err) {
                console.error('Erro ao salvar estatísticas:', err);
            }
        },

        /**
         * Retorna histórico de simulados
         */
        getHistory: () => {
            try {
                return JSON.parse(localStorage.getItem(STATS_KEY) || '[]');
            } catch (err) {
                console.error('Erro ao carregar histórico:', err);
                return [];
            }
        },

        /**
         * Calcula estatísticas gerais
         */
        getOverallStats: () => {
            const history = this.getHistory();
            if (history.length === 0) {
                return {
                    totalSimulados: 0,
                    mediaGeral: 0,
                    melhorResultado: 0,
                    pisorResultado: 0
                };
            }

            const scores = history.map(h => h.percentage);
            return {
                totalSimulados: history.length,
                mediaGeral: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
                melhorResultado: Math.max(...scores),
                piorResultado: Math.min(...scores)
            };
        },

        /**
         * Retorna recomendações baseadas em desempenho
         */
        getRecommendations: () => {
            const stats = this.getOverallStats();
            const recommendations = [];

            if (stats.totalSimulados === 0) {
                recommendations.push('📚 Comece com um simulado para rastrear seu desempenho!');
            } else if (stats.mediaGeral < 50) {
                recommendations.push('⚠️ Sua taxa de acerto está baixa. Revise os conceitos básicos!');
            } else if (stats.mediaGeral < 70) {
                recommendations.push('📖 Continue praticando. Foque nas questões erradas!');
            } else if (stats.mediaGeral < 85) {
                recommendations.push('✅ Bom desempenho! Aumente a dificuldade nos próximos simulados.');
            } else {
                recommendations.push('🎯 Excelente! Você está bem preparado!');
            }

            return recommendations;
        },

        /**
         * Renderiza dashboard (placeholder)
         */
        renderDashboard: () => {
            const stats = this.getOverallStats();
            const recommendations = this.getRecommendations();

            const html = `
                <div class="filter-section">
                    <h3 class="section-title">📊 Dashboard de Desempenho</h3>
                    
                    <div class="stats">
                        <div class="stat-box">
                            <div class="stat-number">${stats.totalSimulados}</div>
                            <div class="stat-label">Simulados Realizados</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${stats.mediaGeral}%</div>
                            <div class="stat-label">Média Geral</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${stats.melhorResultado}%</div>
                            <div class="stat-label">Melhor Resultado</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">${stats.piorResultado}%</div>
                            <div class="stat-label">Pior Resultado</div>
                        </div>
                    </div>

                    <h4 style="color: var(--color-primary); margin-top: 20px; margin-bottom: 10px;">💡 Recomendações</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${recommendations.map(rec => `
                            <li style="padding: 10px; background: var(--bg-dark); margin-bottom: 8px; border-radius: 6px; border-left: 3px solid var(--color-primary);">
                                ${rec}
                            </li>
                        `).join('')}
                    </ul>

                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 20px; text-align: center;">
                        🔔 Histórico e gráficos detalhados em desenvolvimento
                    </p>
                </div>
            `;

            return html;
        }
    };
})();
