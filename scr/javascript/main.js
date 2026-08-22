/* =========================================
   INICIALIZAÇÃO GLOBAL
   Garante que o JavaScript só comece a agir 
   DEPOIS que todo o HTML da página carregar.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. INJEÇÃO DO RODAPÉ (COMPONENTIZAÇÃO)
       Procura pela tag específica <footer id="meu-rodape-global">.
       Se achar na página, escreve o código HTML dentro dela.
       ========================================= */
    const caixaRodape = document.getElementById('meu-rodape-global');

    if (caixaRodape) {
        caixaRodape.innerHTML = `
            <section class="rodape">
                <p>© 2026 Imobiliária Sincera. Todos os direitos reservados (e responsabilidades isentas).</p>
                <p class="texto__conteudo">Reclamações, processos ou parcerias duvidosas:</p>
                <p>Telefone: (00) 0000-0000 (Não atendemos)</p>
                <a class="link" href="mailto:advogado@imobiliariasincera.com">Email</a>
                <a class="link" href="https://www.instagram.com/seuusuario" target="_blank">Instagram</a>
                <a class="link" href="">WhatsApp</a>
            </section>
        `;
    }

    /* =========================================
       2. SISTEMA DE LIGHTBOX (GALERIA DE IMAGENS)
       Lógica para abrir imagens do carrossel em tela cheia.
       ========================================= */

    /* Captura os elementos únicos do HTML pelo ID (#) */
    const lightbox = document.getElementById('lightbox');             // A div da tela preta
    const imagemLightbox = document.getElementById('imagem_lightbox'); // A tag <img> que ficará gigante
    const fecharLightbox = document.getElementById('fechar_lightbox'); // O botão de "X"
    const btnPrev = document.getElementById('btn_prev');               // Seta de navegação (<)
    const btnNext = document.getElementById('btn_next');               // Seta de navegação (>)

    /* Captura uma lista de elementos (.Classe e Tag) 
       Pega TODAS as tags <img> que estão dentro de .slides */
    const imagensCarrossel = Array.from(document.querySelectorAll('.slides img'));

    /* Validação: Só roda a mecânica se a página atual 
       tiver o Lightbox e pelo menos 1 imagem de carrossel. */
    if (lightbox && imagensCarrossel.length > 0) {

        /* Variável de Memória: Lembra qual foto está aberta (0, 1, 2...) */
        let indiceAtual = 0;

        /* Função Matemática: Cuida do Carrossel Infinito e troca a foto */
        function mostrarImagem(indice) {
            if (indice < 0) {
                // Se tentou voltar antes da 1ª foto, pula para a última
                indiceAtual = imagensCarrossel.length - 1;
            } else if (indice >= imagensCarrossel.length) {
                // Se tentou avançar depois da última foto, volta para a 1ª
                indiceAtual = 0;
            } else {
                // Segue a navegação normal
                indiceAtual = indice;
            }
            // Injeta o link da foto correta na tag <img> gigante
            imagemLightbox.src = imagensCarrossel[indiceAtual].src;
        }

        /* --- EVENTOS DE ABERTURA --- */
        // Escuta o clique em cada miniatura do HTML
        imagensCarrossel.forEach((imagem, index) => {
            imagem.addEventListener('click', () => {
                indiceAtual = index; // Salva o número da foto clicada
                mostrarImagem(indiceAtual);
                lightbox.classList.add('ativo'); // Liga a tela preta no CSS
            });
        });

        /* --- EVENTOS DE FECHAMENTO --- */
        // Fecha se clicar no botão "X"
        fecharLightbox.addEventListener('click', () => lightbox.classList.remove('ativo'));

        // Fecha se clicar no fundo preto (Ignora cliques na foto ou nas setas)
        lightbox.addEventListener('click', (e) => {
            if (e.target !== imagemLightbox && e.target !== btnPrev && e.target !== btnNext) {
                lightbox.classList.remove('ativo');
            }
        });

        /* --- CONTROLES DE NAVEGAÇÃO: MOUSE (CLIQUES) --- */
        btnPrev.addEventListener('click', () => mostrarImagem(indiceAtual - 1));
        btnNext.addEventListener('click', () => mostrarImagem(indiceAtual + 1));

        /* --- CONTROLES DE NAVEGAÇÃO: TECLADO (PC) --- */
        document.addEventListener('keydown', (e) => {
            // Se o Lightbox estiver fechado, ignora as teclas
            if (!lightbox.classList.contains('ativo')) return;

            if (e.key === 'ArrowLeft') mostrarImagem(indiceAtual - 1);
            if (e.key === 'ArrowRight') mostrarImagem(indiceAtual + 1);
            if (e.key === 'Escape') lightbox.classList.remove('ativo');
        });

        /* --- CONTROLES DE NAVEGAÇÃO: TOQUE (CELULAR/SWIPE) --- */
        let touchstartX = 0; // Posição (X) onde o dedo tocou a tela
        let touchendX = 0;   // Posição (X) onde o dedo soltou a tela

        lightbox.addEventListener('touchstart', (e) => {
            touchstartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchendX = e.changedTouches[0].screenX;
            const threshold = 50; // Quantidade de pixels que o dedo precisa arrastar para validar o comando
            
            if (touchendX < touchstartX - threshold) {
                mostrarImagem(indiceAtual + 1); // Dedo arrastou para a esquerda (Próxima Foto)
            }
            if (touchendX > touchstartX + threshold) {
                mostrarImagem(indiceAtual - 1); // Dedo arrastou para a direita (Foto Anterior)
            }
        }, { passive: true });
    }
});