import os
from time import sleep
from bs4 import BeautifulSoup
import requests
import random
import django
from db_load.parsers import DepartmentPageParser
from collections import namedtuple
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ace.settings")
django.setup()
from courses.models import Section, Course, Department, Instructor, LabSection


def reload_db():
    DepartmentPage = namedtuple("DepartmentPage", ["name", "url"])

    def get_link_table(soup):
        return soup.find_all("table")[1]

    def get_department_urls(expanded_url_page):
        ret_list = []
        bs = BeautifulSoup(expanded_url_page, "html.parser")
        for link_row in get_link_table(bs).find_all("tr"):
            if len(link_row.contents) == 3:
                if link_row.find("a"):
                    ret_list.append(DepartmentPage(link_row.a.string, link_row.a['href']))

        return ret_list

    semester = "Fall  2019"
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
            print("row td not none")
            for string in row.td.strings:
                print(string)
                if string == semester:
                    print(string)
                    expanded_path = row.td.a['href']
                    expanded_view_url = requests.compat.urljoin(root_url, expanded_path)
                    expanded_view = requests.get(expanded_view_url).text
                    department_tuples = get_department_urls(expanded_view)

    print(f"Number of Department Tuples: {len(department_tuples)}")
    parser = DepartmentPageParser()

    for department_tup in department_tuples:
        print(department_tup.name)
        dept_url = requests.compat.urljoin(root_url, department_tup.url)
        dept_page = requests.get(dept_url).text
        dept_soup = BeautifulSoup(dept_page, "html.parser")
        table = str(dept_soup.body.table.find_all("tr")[1].find_all("td")[1].pre.string).strip()
        sections = parser.parse_courses(table)
        for section_data in sections:
            d: Department = Department.get_department(section_data.department, department_tup.name)
            c: Course = Course.get_course(d, section_data.course_number, section_data.title, section_data.credit_hours)
            i: Instructor = Instructor.get_instructor(section_data.instructor)
            lab = None
            if section_data.lab is not None:
                lab_data = section_data.lab
                inst: Instructor = Instructor.get_instructor(lab_data.instructor)
                lab: LabSection = LabSection.get_lab_section(time_begin=lab_data.begin_time,
                                                             time_end=lab_data.end_time,
                                                             days=lab_data.days,
                                                             room=lab_data.room,
                                                             special=lab_data.special,
                                                             inst=inst)

            s: Section = Section.get_section(course=c,
                                             section_number=section_data.section_number,
                                             available=section_data.available,
                                             enrolled=section_data.enrolled,
                                             sec_type=section_data.section_type,
                                             time_b=section_data.begin_time,
                                             time_e=section_data.end_time,
                                             days=section_data.days,
                                             room=section_data.room,
                                             special=section_data.special,
                                             inst=i,
                                             additional=section_data.additional,
                                             lab_section=lab)
        sleep(random.randint(1, 5))


if __name__ == "__main__":
    reload_db()
