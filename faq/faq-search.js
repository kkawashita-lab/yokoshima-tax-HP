(() => {
  const form = document.querySelector('.faq-search');
  const input = form.querySelector('input');
  const status = document.querySelector('.faq-search-status');
  const normalize = text => text.normalize('NFKC').toLowerCase();
  const categories = [...document.querySelectorAll('.faq-category')].map(section => ({
    section,
    questions: [...section.querySelectorAll('details')].map(question => ({
      question,
      text: normalize(question.textContent),
    })),
  }));

  function filterQuestions() {
    const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    let total = 0;

    for (const { section, questions } of categories) {
      let matches = 0;
      for (const { question, text } of questions) {
        const visible = terms.every(term => text.includes(term));
        question.hidden = !visible;
        if (visible) matches++;
      }
      section.hidden = matches === 0;
      total += matches;
    }

    status.textContent = terms.length === 0 ? '' : total
      ? `${total}件の質問が見つかりました。`
      : '該当する質問が見つかりませんでした。別のキーワードでお試しください。';
  }

  input.addEventListener('input', filterQuestions);
  form.addEventListener('submit', event => {
    event.preventDefault();
    filterQuestions();
  });
  form.hidden = false;
  filterQuestions();
})();
