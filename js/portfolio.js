(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Name font preview toggle (iteration 1; remove after client picks) --- */
  var nameEl = document.querySelector('.name');
  var typeBtns = document.querySelectorAll('.type-btn');

  if (nameEl && typeBtns.length) {
    var saved = localStorage.getItem('portfolio-name-font');
    if (saved === 'sans') {
      nameEl.classList.remove('name-serif');
      nameEl.classList.add('name-sans');
      typeBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.font === 'sans');
      });
    }

    typeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isSans = btn.dataset.font === 'sans';
        nameEl.classList.toggle('name-serif', !isSans);
        nameEl.classList.toggle('name-sans', isSans);
        typeBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        localStorage.setItem('portfolio-name-font', isSans ? 'sans' : 'serif');
      });
    });
  }

  /* --- Section scroll reveal --- */
  var reveals = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  reveals.forEach(function (el) { observer.observe(el); });

  /* --- Contact form → Web3Forms --- */
  var contactForm = document.getElementById('contact-form');
  var sendBtn     = document.getElementById('send-btn');
  var formResult  = document.getElementById('form-result');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (contactForm.elements['name'].value    || '').trim();
      var email   = (contactForm.elements['email'].value   || '').trim();
      var message = (contactForm.elements['message'].value || '').trim();
      if (!name || !email || !message) return;

      sendBtn.disabled    = true;
      sendBtn.textContent = 'Sending…';
      formResult.textContent = '';
      formResult.className   = 'form-result';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            formResult.textContent = 'Sent — thanks for reaching out!';
            formResult.classList.add('is-success');
            contactForm.reset();
          } else {
            throw new Error(data.message || 'Something went wrong.');
          }
        })
        .catch(function (err) {
          formResult.textContent = err.message || 'Could not send. Try emailing directly.';
          formResult.classList.add('is-error');
        })
        .finally(function () {
          sendBtn.disabled    = false;
          sendBtn.textContent = 'Send message';
        });
    });
  }
})();
