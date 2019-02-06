from bs4 import BeautifulSoup
import requests
from parsers import DepartmentPageParser
from collections import namedtuple
from ..courses.models import Section

DepartmentPage = namedtuple("DepartmentPage", ["name", "url"])


def get_link_table(soup):
    return soup.find_all("table")[1]


def get_department_urls(expanded_url_page):
    ret_list = []
    bs = BeautifulSoup(expanded_url_page, "html.parser")
    for row in get_link_table(bs).find_all("tr"):
        if len(row.contents) == 3:
            if row.find("a"):
                ret_list.append(DepartmentPage(row.a.string, row.a['href']))

    return ret_list


semester = "Spring 2019"
root_url = "http://appl101.lsu.edu"
booklet_lobby = "/booklet2.nsf/bed33d8925ab561b8625651700585b85?OpenView&Start=1&Count=500&CollapseView"

view_params = {
    "OpenView": "",
    "Start": 1,
    "Count": 500,
    "CollapseView": ""
}

lobby_url = requests.compat.urljoin(root_url, booklet_lobby)
booklet_lobby_page = requests.get(lobby_url, view_params).text
booklet_lobby_soup = BeautifulSoup(booklet_lobby_page, "html.parser")
link_table = get_link_table(booklet_lobby_soup)

department_tuples = []

for row in link_table.find_all("tr"):
    if row.td is not None:
        for string in row.td.strings:
            if string == semester:
                print(string)
                expanded_path = row.td.a['href']
                expanded_view_url = requests.compat.urljoin(root_url, expanded_path)
                expanded_view = requests.get(expanded_view_url).text
                department_tuples = get_department_urls(expanded_view)

for dept in department_tuples:
    print(dept.name + " " + dept.url)

parser = DepartmentPageParser()

for i in range(1):
    tup = department_tuples[i]
    dept_url = requests.compat.urljoin(root_url, tup.url)
    dept_page = requests.get(dept_url).text
    dept_soup = BeautifulSoup(dept_page, "html.parser")
    table = str(dept_soup.body.table.find_all("tr")[1].find_all("td")[1].pre.string).strip()
    sections = parser.parse_courses(table)
    for section in sections:
        section_model = Section()
        section_model.available_seats = section.available_seats
        section_model.enrolled_students = section.enrolled_students
        section_model.section_type = section.section_type
        section_model.section_number = section.section_number
        section_model.time_begin = section.time_begin
        section_model.time_end = section.time_end
        section_model.monday = section.monday
