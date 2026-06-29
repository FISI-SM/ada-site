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

### Course Description

The goal of this course is to provide graduate students in Computer Science with a solid theoretical and practical foundation in the design and analysis of algorithms, preparing them to solve complex computational problems and conduct research in advanced algorithmic techniques.

This course serves as an essential foundation for advanced studies and research in areas such as Artificial Intelligence, Data Science, Bioinformatics, Operations Research, High-Performance Computing, Distributed Systems, and Algorithm Engineering.

## Announcements

{% assign announcements = site.announcements %}
{{ announcements.last }}

## Lectures 2026.2

- Mondays 0:00-0:00pm, LAB NP 6
- Wednesdays 0:00-0:00pm, LAB NP 6

## Instructor

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
{% for staffer in instructors %}
{{ staffer }}
{% endfor %}
