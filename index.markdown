---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

![image](/images/edward_wawrzynek.jpg){: style="width: 12rem; float: right; margin: 0 0 1rem 1rem;"}

My name is Edward Wawrzynek. I'm an undergraduate studying electrical engineering and applied mathematics at CU Boulder. I'm interested in applied electromagnetics, RF systems, and analog electronics in general. 

I'm currently with the [Antenna Research Group](https://www.colorado.edu/lab/antenna/) at CU, where I'm working on developing electrically small antennas (ESAs) for HF communication applications.

I previously worked in the High Speed Digital Engineering Group at CU, where I performed work on high bandwidth conductive ink structures and developed custom instrumentation for isothermal I-V characterization.

A copy of my resume is <a href="/assets/resume.pdf">available here</a>. I can be reached at <a href="mailto: edward@wawrzynek.com">edward@wawrzynek.com</a>.

#### Projects

<div style="display: flex; flex-wrap: wrap; row-gap: 1rem; column-gap: 1rem;">
{% for post in site.posts %}
{% assign url = post.url %}
{% if post.redirect %}{% assign url = post.redirect %}{% endif %}
<div style="width: 12.5rem; border: 1px solid #424242; border-radius: 3px; padding: 1rem; position: relative;">
    {% if post.header_url %}
        <div>
            <img src="{{ post.header_url }}"/>
        </div>
    {% endif %}
    <div style="margin: 0.8rem 0 0.2rem 0; font-size: 1.1rem;">
        <a href="{{ url }}">{{ post.title }}</a>
    </div>
    <div style="font-size: 0.9rem">{{ post.summary }}</div>
    <a style='position:absolute;top:0px;left:0px;width:100%;height:100%;display:inline;' href ='{{ url }}'></a>
</div>
{% endfor %}
</div>