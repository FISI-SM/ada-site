---
layout: page
title: Announcements
nav_exclude: false
description: A feed containing all of the class announcements.
---

# Announcements

All announcements since the beginning of the course.
{: .lead }

{% assign announcements = site.announcements | reverse %}
{% if announcements == empty %}
{: .info }
> No announcements yet. Check back soon.
{% else %}
{% for announcement in announcements %}
{{ announcement }}
{% endfor %}
{% endif %}
