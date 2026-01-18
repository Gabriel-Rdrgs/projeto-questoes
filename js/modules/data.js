/**
 * ===================================
 * MÓDULO: Data
 * ===================================
 * Gerenciamento de dados: CRUD + localStorage + filtros
 */

const DataModule = (() => {
    const STORAGE_KEY = 'questionsData';
    
    let questionsData = [
        {
            id: 1, topic: 'egito', bank: 'enem-2024', difficulty: 'easy',
            text: 'O historiador grego Heródoto afirmou: "O Egito é uma dádiva do rio Nilo". Essa frase expressa a importância do Nilo para:',
            context: 'Heródoto (484–420 a.C.) foi um historiador grego que viajou pelo Egito.',
            options: [
                { letter: 'A', text: 'A expansão militar do Egito sobre povos vizinhos.' },
                { letter: 'B', text: 'O desenvolvimento da agricultura e a concentração de poder faraônico.' },
                { letter: 'C', text: 'A criação do sistema de escrita hieroglífica egípcia.' },
                { letter: 'D', text: 'A construção de cidades portuárias no Mediterrâneo.' },
                { letter: 'E', text: 'O comércio marítimo com povos europeus.' }
            ],
            correctAnswer: 1,
            explanation: 'O rio Nilo foi fundamental para a agricultura egípcia, pois suas cheias periódicas fertilizavam as margens.'
        },
        {
            id: 2, topic: 'mesopotamia', bank: 'enem-2024', difficulty: 'medium',
            text: 'A escrita cuneiforme foi desenvolvida pelos sumérios principalmente para:',
            context: 'A escrita cuneiforme foi criada por volta de 3200 a.C.',
            options: [
                { letter: 'A', text: 'Registrar leis religiosas e proibições morais.' },
                { letter: 'B', text: 'Registrar informações administrativas, comerciais e religiosas.' },
                { letter: 'C', text: 'Comunicar-se exclusivamente com civilizações do Egito.' },
                { letter: 'D', text: 'Criar sistemas de criptografia militar avançados.' },
                { letter: 'E', text: 'Documentar história militar e conquistas bélicas.' }
            ],
            correctAnswer: 1,
            explanation: 'A escrita cuneiforme foi desenvolvida para registrar dados administrativos e comerciais.'
        },
        {
            id: 3, topic: 'hebreus', bank: 'enem-2023', difficulty: 'easy',
            text: 'O principal legado religioso do povo hebreu para a história foi:',
            context: 'Os hebreus se estabeleceram na Palestina e desenvolveram crenças influentes.',
            options: [
                { letter: 'A', text: 'A criação da escrita cuneiforme.' },
                { letter: 'B', text: 'O desenvolvimento do politeísmo organizado.' },
                { letter: 'C', text: 'A crença no monoteísmo (Deus único).' },
                { letter: 'D', text: 'A invenção da moeda de ouro.' },
                { letter: 'E', text: 'A construção das primeiras pirâmides.' }
            ],
            correctAnswer: 2,
            explanation: 'O monoteísmo hebraico foi revolucionário e influenciou o Cristianismo e o Islamismo.'
        }
    ];

    /**
     * Carrega dados do localStorage
     */
    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) questionsData = JSON.parse(saved);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        }
    };

    /**
     * Salva dados no localStorage
     */
    const saveToStorage = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(questionsData));
        } catch (err) {
            console.error('Erro ao salvar dados:', err);
        }
    };

    return {
        /**
         * Inicializa o módulo
         */
        init: () => {
            loadFromStorage();
        },

        /**
         * Retorna todas as questões
         */
        getAll: () => [...questionsData],

        /**
         * Busca questão por ID
         */
        getById: (id) => questionsData.find(q => q.id === id),

        /**
         * Adiciona nova questão
         */
        add: (question) => {
            const newId = Math.max(...questionsData.map(q => q.id), 0) + 1;
            question.id = newId;
            questionsData.push(question);
            saveToStorage();
            return newId;
        },

        /**
         * Atualiza questão existente
         */
        update: (id, question) => {
            const index = questionsData.findIndex(q => q.id === id);
            if (index !== -1) {
                questionsData[index] = { ...question, id };
                saveToStorage();
                return true;
            }
            return false;
        },

        /**
         * Remove questão
         */
        delete: (id) => {
            const initial = questionsData.length;
            questionsData = questionsData.filter(q => q.id !== id);
            if (questionsData.length < initial) {
                saveToStorage();
                return true;
            }
            return false;
        },

        /**
         * Filtra questões por critérios
         */
        filter: (filters) => {
            return questionsData.filter(q => {
                return (!filters.topic || q.topic === filters.topic) &&
                       (!filters.bank || q.bank === filters.bank) &&
                       (!filters.difficulty || q.difficulty === filters.difficulty);
            });
        },

        /**
         * Busca por texto
         */
        search: (text) => {
            const searchLower = text.toLowerCase();
            return questionsData.filter(q => 
                q.text.toLowerCase().includes(searchLower) ||
                q.explanation.toLowerCase().includes(searchLower)
            );
        },

        /**
         * Retorna estatísticas
         */
        getStats: () => {
            const topics = new Set(questionsData.map(q => q.topic)).size;
            const banks = new Set(questionsData.map(q => q.bank)).size;
            const difficulties = {
                easy: questionsData.filter(q => q.difficulty === 'easy').length,
                medium: questionsData.filter(q => q.difficulty === 'medium').length,
                hard: questionsData.filter(q => q.difficulty === 'hard').length
            };
            return {
                total: questionsData.length,
                topics,
                banks,
                difficulties
            };
        }
    };
})();
