#! /usr/bin/env python
import yaml

def format_author(author, authors):
    combined = {}
    for a in authors:
        combined.update(a)

    assert(author in combined)
    # bold whoever is first in author list
    if author in authors[0]:
        return f"<b>{combined[author]}</b>"
    else:
        return combined[author]

# print publications in IEEE-like format
def write_section(out, authors, sec, venue_tag, print_header):
    if print_header:
        if venue_tag == "conference":
            out.write("## Conferences\n")
        elif venue_tag == "journal":
            out.write("## Journal Articles\n")

    # reverse publication order
    counter = 1
    for pub in reversed(sec):
        # write pub number
        out.write(f"{counter}. ")
        # write authors
        out.write(", ".join(map(lambda a: format_author(a, authors), pub["authors"])) + ", \"")
        if "link" in pub:
            out.write(f"<a href=\"{pub["link"]}\">")
        out.write(f"{pub["title"]}")
        if "link" in pub:
            out.write("</a>")
        out.write(",\" ")
        if "status" in pub and pub["status"] == "submitted":
            out.write("submitted to the ")
        out.write(f"<i>{pub[venue_tag]}</i>, ")
        if "location" in pub:
            out.write(f"{pub["location"]}, ")
        out.write(f"{pub["date"]}")
        if "pages" in pub:
            if len(pub["pages"]) == 1:
                out.write(f", pp. {pub["pages"][0]}")
            else:
                out.write(f", pp. {pub["pages"][0]}--{pub["pages"][1]}")
        if "doi" in pub:
            out.write(f", doi: <a href=\"https://doi.org/{pub["doi"]}\">{pub["doi"]}</a>")

        if "status" in pub and pub["status"] != "published":
            out.write(f" ({pub["status"]})")

        out.write(".\n")
        counter += 1

def main():
    out = open("publications.md", "w")

    with open("publications.yaml", "r") as file:
        data = yaml.safe_load(file)

    authors = data["authors"]

    cnfs = None
    jrns = None
    if "conferences" in data:
        cnfs = data["conferences"]
    if "jounrals" in data:
        jrns = data["jounrlas"]

    if not jrns is None:
        write_section(out, authors, jrns, "journal", not cnfs is None)
    if not cnfs is None:
        write_section(out, authors, cnfs, "conference", not jrns is None)

main()
