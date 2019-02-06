from datetime import time
from collections import namedtuple
from typing import List

SectionTuple = namedtuple("SectionTuple", ["available",
                                           "enrolled",
                                           "department",
                                           "number",
                                           "section_type",
                                           "section_number",
                                           "title",
                                           "credit_hours",
                                           "begin_time",
                                           "end_time",
                                           "days",
                                           "room",
                                           "special",
                                           "instructor"])


class DepartmentPageParser:
    begin = 0  # 0 
    available_end = begin + 4  # 4
    enrolled_end = available_end + 6  # 10
    abbr_end = enrolled_end + 6  # 16
    num_end = abbr_end + 5  # 21
    type_end = num_end + 5  # 26
    sec_num_end = type_end + 5  # 31
    title_end = sec_num_end + 23  # 54
    credit_hours_end = title_end + 5  # 59
    time_block_end = credit_hours_end + 12  # 71
    day_block_end = time_block_end + 8  # 79
    room_end = day_block_end + 4  # 83
    building_end = room_end + 17  # 100
    special_end = building_end + 16  # 116
    instructor_end = special_end + 14  # 130

    def parse_courses(self, table) -> List[SectionTuple]:
        section_list = []
        table_lines = table.splitlines()
        for line in table_lines[3:21]:
            print(line)
            days = self.get_class_days(line)
            print(f"M: {days[0]} T: {days[1]} W: {days[2]} TH: {days[3]} F: {days[4]} S: {days[5]}")
            times = self.get_times(line)
            tup = SectionTuple(available=self.get_available_sets(line),
                               enrolled=self.get_enrolled_students(line),
                               department=self.get_department(line),
                               number=self.get_course_number(line),
                               section_type=self.get_section_type(line),
                               section_number=self.get_section_number(line),
                               title=self.get_title(line),
                               credit_hours=self.get_credit_hours(line),
                               begin_time=times[0],
                               end_time=times[1],
                               days=self.get_class_days(line),
                               room=self.get_room(line),
                               special=self.get_special_enrollment(line),
                               instructor=self.get_instructor(line))
            section_list.append(tup)

        return section_list

    @staticmethod
    def get_raw_string(line: str, begin: int, end: int) -> str:
        return line[begin:end].strip()

    def get_available_sets(self, line: str) -> int:
        """Return number of available seats as int"""
        raw = self.get_raw_string(line, self.begin, self.available_end)
        if raw == "(F)":
            raw = 0
        return int(raw)

    def get_enrolled_students(self, line: str) -> int:
        """Returns number of enrolled students as int"""
        raw = self.get_raw_string(line, self.available_end, self.enrolled_end)
        return int(raw)

    def get_department(self, line: str) -> str:
        """Returns department as raw string"""
        raw = self.get_raw_string(line, self.enrolled_end, self.abbr_end)
        return raw

    def get_course_number(self, line: str) -> int:
        """Returns course number as int"""
        raw = self.get_raw_string(line, self.abbr_end, self.num_end)
        return int(raw)

    def get_section_type(self, line: str) -> str:
        """Returns section type as raw string"""
        raw = self.get_raw_string(line, self.num_end, self.type_end)
        return raw

    def get_section_number(self, line: str):
        """Returns section as int"""
        raw = self.get_raw_string(line, self.type_end, self.sec_num_end)
        return int(raw)

    def get_title(self, line: str):
        """Returns raw title string"""
        raw = self.get_raw_string(line, self.sec_num_end, self.title_end)
        return raw

    def get_credit_hours(self, line: str):
        """Returns number of credit hours as float"""
        raw = self.get_raw_string(line, self.title_end, self.credit_hours_end)
        return float(raw)

    def get_times(self, line: str) -> (time, time):
        begin_night = False
        end_night = False
        raw = self.get_raw_string(line, self.credit_hours_end, self.time_block_end)
        if raw.endswith('N'):
            raw = raw.replace('N', "")
            begin_night = True
            end_night = True
        hours = raw.split('-')
        begin = hours[0]
        end = hours[1]
        begin_hour = int(begin[:-2])
        begin_minute = int(begin[-2:])
        end_hour = int(end[:-2])
        end_minute = int(end[-2:])
        if begin_hour < 7:
            begin_night = True
        if end_hour < 7:
            end_night = True
        if begin_night:
            begin_hour = begin_hour + 12
        if end_night:
            end_hour = end_hour + 12

        return time(hour=begin_hour, minute=begin_minute), time(hour=end_hour, minute=end_minute)

    def get_class_days(self, line: str) -> (bool, bool, bool, bool, bool, bool):
        """Returns raw string from Days block"""
        m_end = 2
        t_end = 3
        w_end = 4
        th_end = 6
        f_end = 7
        s_end = 8
        day_block = line[self.time_block_end:self.day_block_end]

        def is_monday() -> bool:
            return day_block[0:m_end].strip() == 'M'

        def is_tuesday() -> bool:
            return day_block[m_end:t_end] == 'T'

        def is_wednesday() -> bool:
            return day_block[t_end:w_end] == 'W'

        def is_thursday() -> bool:
            return day_block[w_end:th_end] == 'TH'

        def is_friday() -> bool:
            return day_block[th_end:f_end] == 'F'

        def is_saturday() -> bool:
            return day_block[f_end:s_end] == 'S'

        return is_monday(), is_tuesday(), is_wednesday(), is_thursday(), is_friday(), is_saturday()

    def get_room(self, line: str):
        """Returns raw room string"""
        raw = self.get_raw_string(line, self.day_block_end, self.building_end)
        return raw

    def get_special_enrollment(self, line: str):
        """Returns raw special enrollment string"""
        raw = self.get_raw_string(line, self.building_end, self.special_end)
        return raw

    def get_instructor(self, line: str):
        """Returns raw instructor string"""
        raw = self.get_raw_string(line, self.special_end, self.instructor_end)
        return raw
