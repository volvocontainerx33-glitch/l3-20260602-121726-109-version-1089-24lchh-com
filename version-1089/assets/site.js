(function () {
  var button = document.querySelector('[data-menu-button]');
  var nav = document.querySelector('[data-mobile-nav]');
  if (button && nav) {
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var index = 0;
    var show = function (next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var input = filterForm.querySelector('[data-filter-input]');
    var select = filterForm.querySelector('[data-filter-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var apply = function () {
      var keyword = (input && input.value || '').trim().toLowerCase();
      var kind = (select && select.value || '').trim();
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.year, card.dataset.region, card.dataset.genre].join(' ').toLowerCase();
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okKind = !kind || text.indexOf(kind.toLowerCase()) !== -1;
        card.style.display = okKeyword && okKind ? '' : 'none';
      });
    };
    if (input) input.addEventListener('input', apply);
    if (select) select.addEventListener('change', apply);
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play-cover]');
    var streamUrl = player.getAttribute('data-stream');
    var started = false;
    var loadVideo = function () {
      if (!video || !streamUrl || started) return;
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.play();
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
      } else {
        video.src = streamUrl;
        video.play();
      }
      if (cover) cover.classList.add('hidden');
      video.setAttribute('controls', 'controls');
    };
    if (cover) {
      cover.addEventListener('click', loadVideo);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) loadVideo();
      });
    }
  }
})();
