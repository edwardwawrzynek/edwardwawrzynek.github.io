#! /usr/bin/env python
import yaml

def main():
    out = open("projects.md", "w")

    with open("projects.yaml", "r") as file:
        data = yaml.safe_load(file)

    prjs = data["projects"]

    out.write("<div class=\"features\">\n")
    for prj in prjs:
        out.write("<article>\n")
        out.write(f"<a class=\"feature_image\" href=\"{prj["link"]}\">\n")
        out.write(f"<img src=\"{prj["image"]}\">\n")
        out.write("</a>\n")
        out.write("<div class=\"inner\">\n")
        out.write(f"<a href=\"{prj["link"]}\"><h3>{prj["title"]}</h3></a>\n")
        out.write(f"<p>{prj["description"]}</p>\n")
        out.write(f"<a class=\"more_link\" href=\"{prj["link"]}\">[Read more]</a>\n")
        out.write("</div>\n")
        out.write("</article>\n")
    out.write("</div>\n")

main()
