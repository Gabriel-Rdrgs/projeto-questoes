/**
 * ===================================
 * MÓDULO: Utils
 * ===================================
 * Funções auxiliares: Labels, formatação, helpers
 */

const Utils = (() => {
    const labels = {
        topics: {
            'egito': 'Antigo Egito',
            'mesopotamia': 'Mesopotâmia',
            'hebreus': 'Hebreus',
            'fenícios': 'Fenícios',
            'persas': 'Persas'
        },
        banks: {
            'enem-2024': 'ENEM 2024',
            'enem-2023': 'ENEM 2023',
            'enem-2022': 'ENEM 2022',
            'fuvest-2024': 'FUVEST 2024',
            'unicamp-2024': 'UNICAMP 2024'
        },
        difficulties: {
            'easy': '⭐ Fácil',
            'medium': '⭐⭐ Médio',
            'hard': '⭐⭐⭐ Difícil'
        }
    };

    return {
        /**
         * Retorna label legível para um tópico
         */
        getTopicLabel: (topic) => labels.topics[topic] || topic,

        /**
         * Retorna label legível para uma banca
         */
        getBankLabel: (bank) => labels.banks[bank] || bank,

        /**
         * Retorna label com estrelas para dificuldade
         */
        getDifficultyLabel: (diff) => labels.difficulties[diff] || diff,

        /**
         * Retorna configuração de abas
         */
        getTabs: () => [
            { name: 'simulador', label: '🎮 Simulador' },
            { name: 'gerenciador', label: '⚙️ Gerenciador' },
            { name: 'importar', label: '📥 Importar/Exportar' }
        ],

        /**
         * Retorna lista de tópicos disponíveis
         */
        getTopics: () => Object.keys(labels.topics),

        /**
         * Retorna lista de bancas disponíveis
         */
        getBanks: () => Object.keys(labels.banks),

        /**
         * Retorna lista de dificuldades
         */
        getDifficulties: () => Object.keys(labels.difficulties),

        /**
         * Formata data para formato brasileiro
         */
        formatDate: (date) => {
            const d = new Date(date);
            return d.toLocaleDateString('pt-BR');
        },

        /**
         * Formata tempo em minutos:segundos
         */
        formatTime: (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        },

        /**
         * Calcula percentual
         */
        calcPercentage: (correct, total) => {
            if (total === 0) return 0;
            return Math.round((correct / total) * 100);
        },

        /**
         * Calcula nota de 0-1000
         */
        calcScore: (correct, total) => {
            if (total === 0) return 0;
            return Math.round((correct / total) * 1000);
        }
    };
})();
