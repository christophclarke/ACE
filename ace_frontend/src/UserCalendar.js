import React, {Component} from 'react';
import {Card} from 'react-bootstrap';
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

function getClassBlockStyle(col, start, end) {
    return {
        gridColumn: `${col} / ${col}`,
        gridRow: `${start} / ${end}`,
        backgroundColor: 'rgba(117, 190, 218, 0.5)'
    }
}


class UserCalendar extends Component {
    render() {
        const timeDivs = times.map((value, index) => {
            return <div key={index} style={getSpanBlockStyle(index + 2, index + 2, 1, 8)}>{value}</div>
        });

        const dayDivs = days.map((value, index) => {
            return <div key={index} style={getSingleBlockStyle(1, index + 2)}>{value}</div>
        });

        let classDivs;
        if (this.props.sections) {
            classDivs = this.props.sections.map((value, index) => {
                const days = [value.monday, value.tuesday, value.wednesday, value.thursday, value.friday, value.saturday];
                // if (value.time_begin == null) return null;
                const start = moment(value.time_begin, 'HH:mm:ss');
                const startNorm = start.clone().subtract(7, 'hours');
                console.log(start.hour());
                console.log(startNorm.hour());
                let startRow = startNorm.hour() * 2;
                if (startNorm.minute() !== 0) {
                    startRow += 1;
                }

                // if (value.time_end == null) return null;
                const end = moment(value.time_end, 'HH:mm:ss');
                const endNorm = end.clone().subtract(7, 'hours');
                let endRow = endNorm.hour() * 2;
                if (startNorm.minute() !== 50) {
                    endRow += 1;
                }

                return days.map((onDay, index) => {
                    if (!onDay) return null;
                    return <div key={index} style={getClassBlockStyle(index + 2, startRow + 1, endRow + 1)}>{value.course}</div>
                });
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
                        {classDivs}
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

export default UserCalendar;