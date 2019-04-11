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


def get_course_descriptions():
    root_url = "https://catalog.lsu.edu"
    # search_home = "/content.php?filter%5B27%5D=-1&filter%5B29%5D=&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=1&cur_cat_oid=19&expand=&navoid=1759&search_database=Filter#acalog_template_course_filter"
    # Final Page
    # search_home = "/content.php?catoid=19&catoid=19&navoid=1759&filter%5B27%5D=-1&filter%5B29%5D=&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=55&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1#acalog_template_course_filter"
    # Middle Page
    search_home = "/content.php?catoid=19&catoid=19&navoid=1759&filter%5B27%5D=-1&filter%5B29%5D=&filter%5Bcourse_type%5D=-1&filter%5Bkeyword%5D=&filter%5B32%5D=1&filter%5Bcpage%5D=18&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D=1&filter%5B3%5D=1#acalog_template_course_filter"

    def get_data_for_page(path):
        search_url = requests.compat.urljoin(root_url, path)
        search_home_page = requests.get(search_url, verify=False).text
        search_home_soup = BeautifulSoup(search_home_page, "html.parser")

        course_table = search_home_soup.select("table.table_default")[6]
        a_tags = course_table.select("table > tr > td:nth-of-type(2) > a")
        print(*a_tags, sep='\n')

        for tag in a_tags:
            course_url = requests.compat.urljoin(root_url, tag.get('href'))
            course_page = requests.get(course_url, verify=False).text
            course_soup = BeautifulSoup(course_page, "html.parser")
            # Find the title because it has a recognizable ID
            title = course_soup.find(id='course_preview_title')
            # Grab the containing block
            text_block = title.parent
            # Get all the string data inside the parent element
            full_course_info = " ".join(text_block.stripped_strings)

            split_info = full_course_info.split(" ")
            department_abbr = split_info[0]
            course_num = split_info[1]
            print(f"Dept: {department_abbr} | Num: {course_num}")
            print(f"Info: {full_course_info}")

            try:
                end_course_num_index = full_course_info.index(course_num) + len(course_num)
                beginning_paren_index = full_course_info.index('(')
                end_paren_index = full_course_info.index(')') + 1
                course_title = full_course_info[end_course_num_index:beginning_paren_index].strip()
                print(course_title)
                reduced_course_info = full_course_info[end_paren_index:].strip()
            except ValueError:
                course_title = title.string
                title_index = full_course_info.index(course_title) + len(course_title)
                reduced_course_info = full_course_info[title_index:]

            try:
                d = Department.objects.get(abbreviation=department_abbr)
                c = Course.objects.get(department=d, course_number=course_num)
                c.course_description = reduced_course_info
                c.course_title = course_title
                c.save()
            except Department.DoesNotExist:
                print(f"Department not found for {department_abbr}")
            except Course.DoesNotExist:
                print(f"Course not found for {department_abbr} {course_num}")

        next_page_link = course_table.select("table > tr > td[colspan] > strong")[0].find_next_sibling('a')
        if next_page_link is None:
            print("Final Page")
            return
        else:
            print("Not Last Page")
            next_page = next_page_link.get('href')
            sleep(random.randint(1, 5))
            get_data_for_page(next_page)

    get_data_for_page(search_home)


if __name__ == "__main__":
    # reload_db()
    get_course_descriptions()
