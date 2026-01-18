/**
 * ===================================
 * APP.JS - INICIALIZAÇÃO E ORQUESTRAÇÃO
 * ===================================
 * Ponto de entrada da aplicação
 * Carrega e inicializa todos os módulos
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar módulos core
    console.log('🔧 Inicializando módulos...');
    DataModule.init();
    UIModule.init();
    
    // 2. Aplicar filtros iniciais
    UIModule.applyFilters();
    
    // 3. Configurar event listeners globais
    document.getElementById('questionModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('questionModal')) {
            Gerenciador.closeModal();
        }
    });

    console.log('✅ Aplicação carregada e pronta!');
    console.log('📚 Banco de Questões ENEM/Vestibulares');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Mostrar informações da versão
    const stats = DataModule.getStats();
    console.log(`📊 Questões carregadas: ${stats.total}`);
    console.log(`📂 Assuntos: ${stats.topics}`);
    console.log(`🏢 Bancas: ${stats.banks}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

/**
 * Tratamento global de erros
 */
window.addEventListener('error', (event) => {
    console.error('❌ Erro não tratado:', event.error);
    alert('❌ Ocorreu um erro inesperado. Verifique o console.');
});

/**
 * Previne fechar a aba com dados não salvos
 */
window.addEventListener('beforeunload', (e) => {
    // Opcional: alertar se há dados não salvos
    // const unsavedData = UIModule.getState().quizAnswers;
    // if (Object.keys(unsavedData).length > 0) {
    //     e.preventDefault();
    //     e.returnValue = '';
    // }
});

/**
 * Suporte a teclas de atalho
 */
document.addEventListener('keydown', (e) => {
    // ESC: fechar modal
    if (e.key === 'Escape') {
        Gerenciador.closeModal();
    }
    
    // Em um quiz: Seta direita = próxima questão
    const state = UIModule.getState();
    if (state.quizMode && e.key === 'ArrowRight') {
        Simulador.nextQuestion();
    }
    
    // Em um quiz: Seta esquerda = questão anterior
    if (state.quizMode && e.key === 'ArrowLeft') {
        Simulador.prevQuestion();
    }
});

/**
 * Variável global de versão
 */
window.APP_VERSION = '1.0.0-modular';
