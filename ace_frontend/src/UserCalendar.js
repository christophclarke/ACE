import React, {Component} from 'react';
import {Button, Card, OverlayTrigger, Popover} from 'react-bootstrap';
import moment from "moment";

const style = {
    gridColumn: '2 / 2',
    gridRow: '3 / 7',
    color: 'black',
    backgroundColor: 'rgba(117, 190, 218, 0.5)',
};

const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

const times = [
    '7:30 am',
    '8 am',
    '8:30 am',
    '9 am',
    '9:30 am',
    '10 am',
    '10:30 am',
    '11 am',
    '11:30 am',
    '12 pm',
    '12:30 pm',
    '1 pm',
    '1:30 pm',
    '2 pm',
    '2:30 pm',
    '3 pm',
    '3:30 pm',
    '4 pm',
    '4:30 pm',
    '5 pm',
    '5:30 pm',
    '6 pm',
    '6:30 pm',
    '7 pm',
    '7:30 pm',
    '8 pm',
    '8:30 pm',
    '9 pm',
];

function getSingleBlockStyle(rowNum, colNum) {
    return {
        gridColumn: `${colNum} / ${colNum}`,
        gridRow: `${rowNum} / ${rowNum}`,
        color: '#808080',
        alignSelf: 'center',
        textAlign: 'center'
    }
}

function getSpanBlockStyle(rowStart, rowEnd, colStart, colEnd) {
    return {
        gridColumn: `${colStart} / ${colEnd}`,
        gridRow: `${rowStart} / ${rowEnd}`,
        color: '#808080',
        fontSize: '.75em',
        alignSelf: 'start',
        borderTop: '1px dashed lightgrey',
    }
}

function getRandomColor(num) {
    num >>>= 0;
    let b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;

    if (b < 128) b = 255 - b;
    if (g < 128) g = 255 - g;
    if (r < 128) r = 255 - r;

    return `rgba(${(r * r) % 128 + 128}, ${(g* g) % 128 + 128}, ${(b * b) % 128 + 128}, 0.75)`;
}

function getClassBlockStyle(col, start, end, rgba) {
    return {
        textAlign: "center",
        padding: "5px",
        gridColumn: `${col} / ${col}`,
        gridRow: `${start} / ${end}`,
        backgroundColor: rgba,
        borderTop: '1px solid gray',
    }
}

function CalendarItem(props) {
    const {sectionData} = props;

    const popover = (
        <Popover id="popover-basic" title={`${sectionData["course"]['department']} ${sectionData['course']['course_number']} | ${sectionData["section_number"]}`}>
            <p>Course Title: <b>{sectionData['course']['course_title']}</b></p>
            <p>Credit Hours: <b>{sectionData['course']['credit_hours']}</b></p>
            <p>Professor: {sectionData["instructor"] ? sectionData["instructor"] : "N/A"}</p>
            <p>Enrolled Students: {sectionData["enrolled_students"]}</p>
            <p>Available Seats: {sectionData["available_seats"]}</p>
            <p>Room: {sectionData["room"]}</p>
            <p>Special Enrollment Info: {sectionData["special_enrollment"] ? sectionData["special_enrollment"] : "N/A"}</p>
            <p>Additional Info: {sectionData["additional_info"] ? sectionData["additional_info"] : "N/A"}</p>
            <Button variant='danger' onClick={() => props.handleDelete(sectionData["id"])}>
                Remove This Section
            </Button>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="focus" placement="right" overlay={popover}>
            <div style={props.style} tabIndex={-1}>{sectionData["course"]['department']} {sectionData['course']['course_number']} ({sectionData['section_number']})</div>
        </OverlayTrigger>
    )
}


class UserCalendar extends Component {
    render() {
        const timeDivs = times.map((value, index) => {
            return <div key={index} style={getSpanBlockStyle(index + 2, index + 2, 1, 8)}>{value}</div>
        });

        const dayDivs = days.map((value, index) => {
            return <div key={index} style={getSingleBlockStyle(1, index + 2)}>{value}</div>
        });

        let allSectionDivs;
        if (this.props.sections) {
            allSectionDivs = this.props.sections.map((sectionData, index) => {
                const {monday, friday, thursday, wednesday, tuesday, saturday, time_begin, time_end} = sectionData;
                const days = [monday, tuesday, wednesday, thursday, friday, saturday];
                if (sectionData.id == null) window.location.reload();
                const start = moment(time_begin, 'HH:mm:ss');
                const startNorm = start.clone().subtract(7, 'hours');
                console.log(start.hour());
                console.log(startNorm.hour());
                let startRow = startNorm.hour() * 2;
                if (startNorm.minute() !== 0) {
                    startRow += 1;
                }

                // if (sectionData.time_end == null) return null;
                const end = moment(time_end, 'HH:mm:ss');
                const endNorm = end.clone().subtract(7, 'hours');
                let endRow = endNorm.hour() * 2;
                if (startNorm.minute() !== 50) {
                    endRow += 1;
                }

                const color = getRandomColor(sectionData.course.course_number);

                let lectureDivs;
                lectureDivs =  days.map((onDay, index) => {
                    if (!onDay) return null;
                    return <CalendarItem key={index}
                                         style={getClassBlockStyle(index + 2, startRow + 1, endRow + 1, color)}
                                         sectionData={sectionData}
                                         handleDelete={(sectionId) => this.props.handleDelete(sectionId)}
                    />
                });

                let labDivs;
                if (sectionData['lab_section']) {
                    console.log("Lab Section Exists");
                    const labDays = [sectionData['lab_section']['monday'],
                        sectionData['lab_section']['tuesday'],
                        sectionData['lab_section']['wednesday'],
                        sectionData['lab_section']['thursday'],
                        sectionData['lab_section']['friday'],
                        sectionData['lab_section']['saturday']
                    ];
                    const labStart = moment(sectionData['lab_section']['time_begin'], 'HH:mm:ss');
                    const startNorm = labStart.clone().subtract(7, 'hours');
                    console.log(labStart.hour());
                    console.log(startNorm.hour());
                    let startRow = startNorm.hour() * 2;
                    if (startNorm.minute() !== 0) {
                        startRow += 1;
                    }

                    // if (sectionData.time_end == null) return null;
                    const labEnd = moment(sectionData['lab_section']['time_end'], 'HH:mm:ss');
                    const endNorm = labEnd.clone().subtract(7, 'hours');
                    let endRow = endNorm.hour() * 2;
                    if (startNorm.minute() !== 50) {
                        endRow += 1;
                    }

                    labDivs = labDays.map((onDay, index) => {
                        if (!onDay) return null;
                        return <CalendarItem key={index + "l"}
                                                    style={getClassBlockStyle(index + 2, startRow + 1, endRow + 1, color)}
                                                    sectionData={sectionData}
                                                    handleDelete={(sectionId) => this.props.handleDelete(sectionId)}
                        />
                    });

                    console.log("labDivs:");
                    console.log(labDivs)

                }
                // console.log("lectureDivs before:");
                // console.log(lectureDivs);
                let sectionDivs = lectureDivs.concat(labDivs);
                // console.log("lectureDivs after:");
                console.log(sectionDivs);

                return sectionDivs;
            });
        }

        const calendarStyle = {
            display: 'grid',
            /*margin: 20px;*/
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: `repeat(${times.length}, 35px)`,
            gridColumnGap: '10px',
        };

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Your Calendar</Card.Title>
                    <div style={calendarStyle}>
                        {timeDivs}
                        {dayDivs}
                        {allSectionDivs}
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export default UserCalendar;