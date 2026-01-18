/**
 * ===================================
 * FEATURE: Importador
 * ===================================
 * Import/Export de questões: JSON, backup
 * 
 * Dependências: DataModule, Utils
 */

const Importador = (() => {
    return {
        /**
         * Importa questões de arquivo JSON
         */
        importFile: () => {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (!file) {
                alert('❌ Selecione um arquivo JSON!');
                return;
            }

            if (!file.name.endsWith('.json')) {
                alert('❌ Por favor, selecione um arquivo JSON válido!');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);

                    if (!Array.isArray(imported)) {
                        throw new Error('O arquivo deve conter um array de questões');
                    }

                    if (imported.length === 0) {
                        throw new Error('O arquivo está vazio');
                    }

                    // Validar estrutura básica
                    imported.forEach((q, idx) => {
                        if (!q.topic || !q.bank || !q.difficulty || !q.text) {
                            throw new Error(`Questão ${idx + 1} está incompleta`);
                        }
                    });

                    // Confirmar importação
                    if (!confirm(`✅ Importar ${imported.length} questões? Esta ação não pode ser desfeita.`)) {
                        return;
                    }

                    let importedCount = 0;
                    imported.forEach(q => {
                        try {
                            // Remover ID para gerar novo
                            const questionToAdd = { ...q };
                            delete questionToAdd.id;
                            DataModule.add(questionToAdd);
                            importedCount++;
                        } catch (err) {
                            console.error('Erro ao importar questão:', err);
                        }
                    });

                    alert(`✅ ${importedCount}/${imported.length} questões importadas com sucesso!`);
                    fileInput.value = '';
                    UIModule.switchTab('gerenciador');

                } catch (err) {
                    alert(`❌ Erro ao importar: ${err.message}`);
                }
            };

            reader.onerror = () => {
                alert('❌ Erro ao ler o arquivo!');
            };

            reader.readAsText(file);
        },

        /**
         * Exporta questões em formato JSON
         */
        exportJSON: () => {
            const questions = DataModule.getAll();

            if (questions.length === 0) {
                alert('❌ Nenhuma questão para exportar!');
                return;
            }

            const json = JSON.stringify(questions, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `questoes_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert(`✅ Arquivo exportado com ${questions.length} questões!`);
        },

        /**
         * Exporta questões em formato CSV
         */
        exportCSV: () => {
            const questions = DataModule.getAll();

            if (questions.length === 0) {
                alert('❌ Nenhuma questão para exportar!');
                return;
            }

            // Cabeçalho
            const headers = ['ID', 'Assunto', 'Banca', 'Dificuldade', 'Questão', 'Resposta Correta', 'Explicação'];
            const rows = [];

            // Adicionar dados
            questions.forEach(q => {
                const correctLetter = q.options[q.correctAnswer].letter;
                rows.push([
                    q.id,
                    Utils.getTopicLabel(q.topic),
                    Utils.getBankLabel(q.bank),
                    Utils.getDifficultyLabel(q.difficulty),
                    `"${q.text.replace(/"/g, '""')}"`,
                    correctLetter,
                    `"${q.explanation.replace(/"/g, '""')}"`
                ].join(';'));
            });

            const csv = [headers.join(';'), ...rows].join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `questoes_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert(`✅ Arquivo CSV exportado com ${questions.length} questões!`);
        }
    };
})();
