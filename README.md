---
layout: home
title: ADA - Analise and Design of Algorithms
nav_exclude: true
permalink: /:path/
seo:
  type: Course
  name: ADA - Analise and Design of Algorithms
---

## ADA - Analise and Design of Algorithms

A graduate course on the design and analysis of algorithms, from classical paradigms to modern optimization techniques.
{: .lead }

<div class="cards-grid quick-links" markdown="0">
  <a class="feature-card" href="{{ '/sobre/' | relative_url }}"><span class="card-emoji">📋</span><span>About</span></a>
  <a class="feature-card" href="{{ '/calendario/' | relative_url }}"><span class="card-emoji">🗓️</span><span>Schedule</span></a>
  <a class="feature-card" href="{{ '/avaliacoes/' | relative_url }}"><span class="card-emoji">📝</span><span>Assignments</span></a>
  <a class="feature-card" href="{{ '/materiais/' | relative_url }}"><span class="card-emoji">📚</span><span>Resources</span></a>
</div>

### Course Description

The goal of this course is to provide graduate students in Computer Science with a solid theoretical and practical foundation in the design and analysis of algorithms, preparing them to solve complex computational problems and conduct research in advanced algorithmic techniques.

This course presents the fundamental principles of algorithm design, correctness, and computational complexity, covering both classical and modern paradigms. Students will develop the ability to analyze the efficiency of algorithms, prove their correctness, and design scalable solutions for challenging computational problems. Topics include asymptotic analysis, divide and conquer, dynamic programming, greedy algorithms, backtracking, graph algorithms, randomized algorithms, approximation algorithms, and advanced optimization techniques.

This course serves as an essential foundation for advanced studies and research in areas such as Artificial Intelligence, Data Science, Bioinformatics, Operations Research, High-Performance Computing, Distributed Systems, and Algorithm Engineering.

## Lectures 2026.2

{: .info }
> **Mondays** 0:00–0:00pm · LAB NP 6<br>
> **Wednesdays** 0:00–0:00pm · LAB NP 6

## Latest announcement

{% assign announcements = site.announcements %}
{{ announcements.last }}

## Instructor

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
{% for staffer in instructors %}
{{ staffer }}
{% endfor %}
