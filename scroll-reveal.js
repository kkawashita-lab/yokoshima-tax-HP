(() => {
  const motion = window.matchMedia('(min-width: 951px) and (prefers-reduced-motion: no-preference)');
  if (!motion.matches || !('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll([
    '[data-scroll-reveal]',
    '#about .intro-grid',
    '#services .service-heading',
    '#services .service-story',
    '#services .fees',
    '#flow > .wrap',
    '#faq > .wrap',
    '#office > .wrap',
    '#contact > .wrap',
  ].join(','));

  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting, boundingClientRect, target } of entries) {
      if (!isIntersecting && boundingClientRect.bottom > 0) continue;
      target.classList.remove('scroll-reveal-pending');
      if (isIntersecting && motion.matches) target.classList.add('scroll-reveal');
      observer.unobserve(target);
    }
  }, { rootMargin: '0px 0px -72px 0px' });

  for (const target of targets) {
    const { top } = target.getBoundingClientRect();
    if (top < window.innerHeight) continue;
    target.classList.add('scroll-reveal-pending');
    observer.observe(target);
  }
})();
