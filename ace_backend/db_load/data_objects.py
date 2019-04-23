from dataclasses import dataclass
from datetime import time


@dataclass
class LabSectionData:
    section_type: str
    begin_time: time
    end_time: time
    days: (bool, bool, bool, bool, bool, bool)
    room: str
    instructor: str
    special: str = ""


@dataclass
class SectionData:
    available: int
    enrolled: int
    department: str
    course_number: int
    section_type: str
    section_number: int
    title: str
    credit_hours: str
    begin_time: time
    end_time: time
    days: (bool, bool, bool, bool, bool, bool)
    room: str
    instructor: str
    special: str = ""
    additional: str = ""
    lab: LabSectionData = None
