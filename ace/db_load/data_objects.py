from datetime import time
from dataclasses import dataclass


@dataclass
class SectionData:
    available: int
    enrolled: int
    department: str
    course_number: int
    section_type: str
    section_number: int
    title: str
    credit_hours: int
    begin_time: time
    end_time: time
    days: (bool, bool, bool, bool, bool, bool)
    room: str
    special: str
    instructor: str
