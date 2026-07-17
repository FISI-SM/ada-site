(function () {
  var mathReady = false;

  document.addEventListener('mathjax-ready', function () {
    mathReady = true;
  });

  function typeset(elements) {
    function run() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise(elements).catch(function (error) {
          if (window.console) console.error('MathJax typeset failed', error);
        });
      }
    }

    if (mathReady || (window.MathJax && window.MathJax.typesetPromise)) {
      run();
    } else {
      document.addEventListener('mathjax-ready', run, { once: true });
    }
  }

  function resetQuestion(question) {
    question.classList.remove('is-correct', 'is-wrong');
    question.querySelectorAll('.ada-exam-option-row').forEach(function (row) {
      row.classList.remove('is-correct', 'is-wrong', 'is-chosen');
      var feedback = row.querySelector('.ada-exam-feedback');
      if (feedback) feedback.hidden = true;
    });
  }

  function validateQuestion(question) {
    resetQuestion(question);

    var correct = question.dataset.correctOption;
    var selected = question.querySelector('input[type="radio"]:checked');
    var feedbackToTypeset = [];

    if (!selected) return null;

    question.querySelectorAll('.ada-exam-option-row').forEach(function (row) {
      var feedback = row.querySelector('.ada-exam-feedback');

      if (row.dataset.option === correct) {
        row.classList.add('is-correct');
        if (feedback && feedback.textContent.trim()) {
          feedback.hidden = false;
          feedbackToTypeset.push(feedback);
        }
      }

      if (row.dataset.option === selected.value) {
        row.classList.add('is-chosen');
        if (selected.value !== correct) row.classList.add('is-wrong');
      }
    });

    if (selected.value === correct) {
      question.classList.add('is-correct');
      if (feedbackToTypeset.length) typeset(feedbackToTypeset);
      return true;
    }

    question.classList.add('is-wrong');
    if (feedbackToTypeset.length) typeset(feedbackToTypeset);
    return false;
  }

  function init() {
    document.querySelectorAll('.ada-exam-topic').forEach(function (topic) {
      var questions = Array.prototype.slice.call(topic.querySelectorAll('.ada-exam-question'));
      var validate = topic.querySelector('.ada-exam-validate');
      var clear = topic.querySelector('.ada-exam-clear');
      var score = topic.querySelector('.ada-exam-score');

      questions.forEach(function (question) {
        question.querySelectorAll('input[type="radio"]').forEach(function (input) {
          input.addEventListener('change', function () {
            resetQuestion(question);
            if (score) score.hidden = true;
          });
        });
      });

      if (validate) {
        validate.addEventListener('click', function () {
          var correct = 0;
          var answered = 0;

          questions.forEach(function (question) {
            var result = validateQuestion(question);
            if (result !== null) {
              answered++;
              if (result) correct++;
            }
          });

          if (score) {
            score.hidden = false;
            score.textContent = correct + ' / ' + questions.length + ' correct'
              + (answered < questions.length ? ' (' + (questions.length - answered) + ' unanswered)' : '');
          }
        });
      }

      if (clear) {
        clear.addEventListener('click', function () {
          questions.forEach(function (question) {
            question.querySelectorAll('input[type="radio"]').forEach(function (input) {
              input.checked = false;
            });
            resetQuestion(question);
          });

          if (score) score.hidden = true;
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
