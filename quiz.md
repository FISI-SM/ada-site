---
layout: page
title: Quiz
nav_exclude: true
description: Practice quizzes with per-option feedback.
---

# Quiz

Test yourself on the course topics. Choose an answer for each question and press
**validate** to check it — you'll see which options are right or wrong and *why*.
Your answers are saved locally in your browser.
{: .lead }

<div id="quiz-app" data-storage-key="ada-quiz-v1">
  <noscript>This quiz requires JavaScript to be enabled.</noscript>
</div>

<script>
  window.QUIZ_DATA = {{ site.data.quiz | jsonify }};
  window.MathJax = {
    tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']] },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] },
    startup: {
      typeset: false,
      ready: function () {
        MathJax.startup.defaultReady();
        document.dispatchEvent(new Event('mathjax-ready'));
      }
    }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" id="MathJax-script" async></script>
<script src="{{ '/assets/js/quiz.js' | relative_url }}" defer></script>
