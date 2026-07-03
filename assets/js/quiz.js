/*
 * Quiz engine for the ADA course site.
 * Reads window.QUIZ_DATA (injected by /quiz.md from _data/quiz.yml) and renders
 * per-topic quizzes with per-option feedback. Math is written as LaTeX ($...$)
 * and typeset with MathJax. Answers persist in localStorage.
 */
(function () {
  'use strict';

  // ---- MathJax helpers ---------------------------------------------------
  var mathReady = false;
  document.addEventListener('mathjax-ready', function () { mathReady = true; });

  // Typeset the given elements once MathJax is available.
  function typeset(elements) {
    function run() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise(elements).catch(function (e) {
          if (window.console) console.error('MathJax typeset failed', e);
        });
      }
    }
    if (mathReady || (window.MathJax && window.MathJax.typesetPromise)) {
      run();
    } else {
      document.addEventListener('mathjax-ready', run, { once: true });
    }
  }

  // ---- Data normalization ------------------------------------------------
  // Turn every question into a common shape: { type, prompt, code, options:[{text,correct,feedback}] }
  function normalizeQuestion(q) {
    if (q.type === 'truefalse') {
      return {
        type: 'truefalse',
        prompt: q.prompt || '',
        code: q.code || null,
        options: [
          { text: 'True', correct: q.answer === true, feedback: q.explanation || '' },
          { text: 'False', correct: q.answer === false, feedback: q.explanation || '' }
        ]
      };
    }
    return {
      type: 'single',
      prompt: q.prompt || '',
      code: q.code || null,
      options: (q.options || []).map(function (o) {
        return { text: o.text || '', correct: !!o.correct, feedback: o.feedback || '' };
      })
    };
  }

  // ---- Storage -----------------------------------------------------------
  function makeStore(key) {
    var data = {};
    try {
      var raw = window.localStorage.getItem(key);
      if (raw) data = JSON.parse(raw) || {};
    } catch (e) { data = {}; }
    return {
      get: function (k) { return k in data ? data[k] : null; },
      set: function (k, v) {
        data[k] = v;
        try { window.localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
      },
      remove: function (k) {
        delete data[k];
        try { window.localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
      }
    };
  }

  // ---- Rendering ---------------------------------------------------------
  function el(tag, className, textContent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent != null) node.textContent = textContent;
    return node;
  }

  function renderQuestion(topicIndex, qIndex, question, store) {
    var key = 't' + topicIndex + 'q' + qIndex;
    var li = el('li', 'quiz-q');
    li.dataset.key = key;

    var prompt = el('div', 'quiz-prompt', question.prompt);
    li.appendChild(prompt);

    if (question.code) {
      li.appendChild(el('pre', 'quiz-code', question.code.replace(/\n+$/, '')));
    }

    var opts = el('div', 'quiz-options');
    var saved = store.get(key);

    question.options.forEach(function (opt, oi) {
      var row = el('div', 'quiz-option-row');

      var label = el('label', 'quiz-option');
      var input = el('input');
      input.type = 'radio';
      input.name = key;
      input.value = String(oi);
      if (saved === oi) input.checked = true;
      input.addEventListener('change', function () {
        store.set(key, oi);
        resetQuestionState(li); // editing after validating clears the marks
      });
      label.appendChild(input);
      label.appendChild(el('span', 'quiz-opt-text', opt.text));
      row.appendChild(label);

      var fb = el('div', 'quiz-feedback', opt.feedback);
      fb.hidden = true;
      row.appendChild(fb);

      opts.appendChild(row);
    });

    li.appendChild(opts);
    return li;
  }

  function resetQuestionState(li) {
    li.classList.remove('is-correct', 'is-wrong');
    li.querySelectorAll('.quiz-option-row').forEach(function (row) {
      row.classList.remove('is-correct', 'is-wrong', 'is-chosen');
      var fb = row.querySelector('.quiz-feedback');
      if (fb) fb.hidden = true;
    });
  }

  // Validate one question node against its data. Returns true/false/null (unanswered).
  function validateQuestion(li, question) {
    resetQuestionState(li);
    var rows = li.querySelectorAll('.quiz-option-row');
    var chosen = -1;
    rows.forEach(function (row, oi) {
      if (row.querySelector('input').checked) chosen = oi;
    });
    if (chosen === -1) return null; // unanswered

    var chosenCorrect = false;
    var feedbackNodes = [];

    rows.forEach(function (row, oi) {
      var opt = question.options[oi];
      var fb = row.querySelector('.quiz-feedback');
      if (opt.correct) {
        row.classList.add('is-correct');
        if (opt.feedback) { fb.hidden = false; feedbackNodes.push(fb); }
      }
      if (oi === chosen) {
        row.classList.add('is-chosen');
        if (opt.correct) chosenCorrect = true;
        else {
          row.classList.add('is-wrong');
          // For true/false the wrong option repeats the same explanation as the
          // correct one, so only surface distinct feedback (single-choice).
          if (question.type !== 'truefalse' && opt.feedback) {
            fb.hidden = false; feedbackNodes.push(fb);
          }
        }
      }
    });

    li.classList.add(chosenCorrect ? 'is-correct' : 'is-wrong');
    if (feedbackNodes.length) typeset(feedbackNodes);
    return chosenCorrect;
  }

  // Display label for a topic: "<number> <section name>" (e.g. "1 Asymptotic notation").
  function topicLabel(topic, topicIndex) {
    return (topicIndex + 1) + ' ' + (topic.group || topic.topic || ('Topic ' + (topicIndex + 1)));
  }

  function renderTopic(topic, topicIndex, store) {
    var label = topicLabel(topic, topicIndex);
    var section = el('section', 'quiz-topic');
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('aria-label', label);

    section.appendChild(el('h2', 'quiz-title', label));
    if (topic.intro) section.appendChild(el('p', 'quiz-intro', topic.intro));

    var questions = (topic.questions || []).map(normalizeQuestion);
    var list = el('ol', 'quiz-questions');
    var nodes = [];
    questions.forEach(function (q, qi) {
      var node = renderQuestion(topicIndex, qi, q, store);
      list.appendChild(node);
      nodes.push(node);
    });
    section.appendChild(list);

    var actions = el('div', 'quiz-actions');
    var validateBtn = el('button', 'quiz-btn quiz-validate', 'Validate');
    var clearBtn = el('button', 'quiz-btn quiz-clear', 'Clear');
    var score = el('span', 'quiz-score');
    score.hidden = true;
    actions.appendChild(validateBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(score);
    section.appendChild(actions);

    validateBtn.addEventListener('click', function () {
      var correct = 0, answered = 0;
      nodes.forEach(function (node, qi) {
        var res = validateQuestion(node, questions[qi]);
        if (res !== null) { answered++; if (res) correct++; }
      });
      score.hidden = false;
      score.textContent = correct + ' / ' + questions.length + ' correct'
        + (answered < questions.length ? ' (' + (questions.length - answered) + ' unanswered)' : '');
    });

    clearBtn.addEventListener('click', function () {
      nodes.forEach(function (node, qi) {
        node.querySelectorAll('input[type=radio]').forEach(function (i) { i.checked = false; });
        store.remove('t' + topicIndex + 'q' + qi);
        resetQuestionState(node);
      });
      score.hidden = true;
    });

    return section;
  }

  // ---- Bootstrap ---------------------------------------------------------
  function init() {
    var app = document.getElementById('quiz-app');
    if (!app) return;
    var data = window.QUIZ_DATA;
    if (!data || !data.length) {
      app.appendChild(el('p', 'quiz-empty', 'No questions available.'));
      return;
    }
    var store = makeStore(app.dataset.storageKey || 'ada-quiz');

    // One topic is shown at a time, chosen from a dropdown (scales to many topics).
    var nav = el('div', 'quiz-nav');
    var prev = el('button', 'quiz-nav-btn quiz-prev', '‹');
    var next = el('button', 'quiz-nav-btn quiz-next', '›');
    prev.type = 'button'; next.type = 'button';
    prev.setAttribute('aria-label', 'Previous topic');
    next.setAttribute('aria-label', 'Next topic');
    var select = el('select', 'quiz-select');
    select.setAttribute('aria-label', 'Choose a topic');
    var counter = el('span', 'quiz-nav-counter');

    var sections = [];
    var typeset_done = [];

    function showTopic(active) {
      sections.forEach(function (section, i) { section.hidden = i !== active; });
      select.value = String(active);
      counter.textContent = 'Topic ' + (active + 1) + ' of ' + sections.length;
      prev.disabled = active <= 0;
      next.disabled = active >= sections.length - 1;
      store.set('__topic', active);
      if (!typeset_done[active]) { typeset_done[active] = true; typeset([sections[active]]); }
    }

    // Build the option list, grouping entries by their optional `group` into <optgroup>s.
    var frag = document.createDocumentFragment();
    var optParent = {};
    data.forEach(function (topic, ti) {
      var option = el('option', null, topicLabel(topic, ti));
      option.value = String(ti);
      if (topic.group) {
        if (!optParent[topic.group]) {
          var og = document.createElement('optgroup');
          og.label = topic.group;
          select.appendChild(og);
          optParent[topic.group] = og;
        }
        optParent[topic.group].appendChild(option);
      } else {
        select.appendChild(option);
      }

      var section = renderTopic(topic, ti, store);
      sections.push(section);
      frag.appendChild(section);
    });

    select.addEventListener('change', function () { showTopic(parseInt(select.value, 10)); });
    prev.addEventListener('click', function () { showTopic(Math.max(0, parseInt(select.value, 10) - 1)); });
    next.addEventListener('click', function () { showTopic(Math.min(sections.length - 1, parseInt(select.value, 10) + 1)); });

    nav.appendChild(prev);
    nav.appendChild(select);
    nav.appendChild(next);
    nav.appendChild(counter);

    app.innerHTML = '';
    app.appendChild(nav);
    app.appendChild(frag);

    var saved = store.get('__topic');
    showTopic(typeof saved === 'number' && saved >= 0 && saved < sections.length ? saved : 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
