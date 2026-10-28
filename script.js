/* Cozinha Lucrativa — Bastidor do Empreendedor */

/* ===================================================================
   META PIXEL
   Cole o seu ID entre as aspas. Enquanto estiver vazio, nada é carregado.
   =================================================================== */
var META_PIXEL_ID = '2344558726356067';

(function () {
  if (!META_PIXEL_ID) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
})();

/* InitiateCheckout apenas no clique dos botões de compra.
   Purchase não é disparado nesta página — ele deve ser verificado
   na integração com a Hotmart, após uma compra real ou de teste. */
document.querySelectorAll('.js-checkout').forEach(function (el) {
  el.addEventListener('click', function () {
    if (window.fbq) fbq('track', 'InitiateCheckout');
  });
});

/* Carrossel dos prints das planilhas (seção 8) + lightbox de ampliação */
(function () {
  var carrossel = document.querySelector('[data-carrossel]');
  if (!carrossel) return;

  var miniaturas = Array.prototype.slice.call(carrossel.querySelectorAll('.miniatura'));
  if (!miniaturas.length) return;

  var imgPrincipal = carrossel.querySelector('#carrossel-img');
  var legenda = carrossel.querySelector('#carrossel-legenda');
  var posicaoEl = carrossel.querySelector('#carrossel-posicao');
  var totalEl = carrossel.querySelector('#carrossel-total');
  var btnAnterior = carrossel.querySelector('.carrossel-anterior');
  var btnProxima = carrossel.querySelector('.carrossel-proxima');
  var btnAmpliar = carrossel.querySelector('.carrossel-ampliar');
  var principal = carrossel.querySelector('.carrossel-principal');

  // Monta a lista de slides a partir das próprias miniaturas já presentes no
  // HTML — assim, para adicionar uma nova captura basta criar um novo botão
  // ".miniatura" na seção 8, sem precisar tocar neste arquivo.
  var slides = miniaturas.map(function (botao) {
    var img = botao.querySelector('img');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      legenda: botao.getAttribute('data-legenda') || ''
    };
  });

  if (totalEl) totalEl.textContent = String(slides.length);

  var indice = 0;

  function mostrar(novoIndice) {
    indice = (novoIndice + slides.length) % slides.length;
    var slide = slides[indice];

    imgPrincipal.src = slide.src;
    imgPrincipal.alt = slide.alt;
    if (legenda) legenda.textContent = slide.legenda;
    if (posicaoEl) posicaoEl.textContent = String(indice + 1);

    miniaturas.forEach(function (botao, i) {
      var ativa = i === indice;
      botao.classList.toggle('ativa', ativa);
      if (ativa) {
        botao.setAttribute('aria-current', 'true');
      } else {
        botao.removeAttribute('aria-current');
      }
    });
  }

  function proxima() { mostrar(indice + 1); }
  function anterior() { mostrar(indice - 1); }

  if (btnProxima) btnProxima.addEventListener('click', proxima);
  if (btnAnterior) btnAnterior.addEventListener('click', anterior);

  miniaturas.forEach(function (botao, i) {
    botao.addEventListener('click', function () { mostrar(i); });
  });

  // Navegação por teclado (setas esquerda/direita) quando o foco está
  // dentro do carrossel.
  carrossel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); proxima(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); anterior(); }
  });

  // Toque/deslize em telas sensíveis ao toque.
  if (principal) {
    var toqueX = null;
    principal.addEventListener('touchstart', function (e) {
      toqueX = e.changedTouches[0].clientX;
    }, { passive: true });
    principal.addEventListener('touchend', function (e) {
      if (toqueX === null) return;
      var deltaX = e.changedTouches[0].clientX - toqueX;
      var LIMIAR = 40; // px mínimos para considerar um deslize intencional
      if (deltaX > LIMIAR) anterior();
      else if (deltaX < -LIMIAR) proxima();
      toqueX = null;
    }, { passive: true });
  }

  mostrar(0);

  /* Lightbox — clique na imagem principal para ampliar */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var alvo = lightbox.querySelector('img');

  function abrirLightbox() {
    alvo.src = imgPrincipal.currentSrc || imgPrincipal.src;
    alvo.alt = imgPrincipal.alt || '';
    lightbox.classList.add('aberto');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  if (btnAmpliar) btnAmpliar.addEventListener('click', abrirLightbox);

  function fecharLightbox() {
    lightbox.classList.remove('aberto');
    lightbox.setAttribute('aria-hidden', 'true');
    alvo.removeAttribute('src');
    if (btnAmpliar) btnAmpliar.focus();
  }
  lightbox.addEventListener('click', fecharLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('aberto')) fecharLightbox();
  });
})();
