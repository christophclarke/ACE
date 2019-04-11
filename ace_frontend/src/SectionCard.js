import React, {Component} from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap'
import moment from "moment";

class SectionCard extends Component {
    checkIfExists() {
        const userSections = this.props.userData.sections;
        for (let i = 0; i < userSections.length; i++) {
            if (userSections[i].id === this.props.sectionData.id) {
                return true;
            }
        }
        return false;
    }

    checkIfOverlap() {
        // sectionData = section to add
        const sectionData = this.props.sectionData;
        const newStart = moment(this.props.sectionData.time_begin, 'HH:mm:ss');
        const newEnd = moment(this.props.sectionData.time_end, 'HH:mm:ss');
        // userSections are the sections the user has already added
        const userSections = this.props.userData.sections;
        for (let i = 0; i < userSections.length; i++) {
            const userSection = userSections[i];
            const userStart = moment(userSection.time_begin, 'HH:mm:ss');
            const userEnd = moment(userSection.time_end, 'HH:mm:ss');
            if (newEnd.isSameOrAfter(userStart) && newStart.isSameOrBefore(userEnd)) {
                if ((sectionData.monday && userSection.monday)
                    || (sectionData.tuesday && userSection.tuesday)
                    || (sectionData.wednesday && userSection.wednesday)
                    || (sectionData.thursday && userSection.thursday)
                    || (sectionData.friday && userSection.friday)
                    || (sectionData.saturday && userSection.saturday)) {
                    return true;
                }
            }

            // Check for existing lab overlap
            if (userSection.lab_section) {
                let existingLabData = userSection.lab_section;
                const userLabStart = moment(existingLabData.time_begin, 'HH:mm:ss');
                const userLabEnd = moment(existingLabData.time_end, 'HH:mm:ss');
                if (newEnd.isSameOrAfter(userLabStart) && newStart.isSameOrBefore(userLabEnd)) {
                    if ((sectionData.monday && existingLabData.monday)
                        || (sectionData.tuesday && existingLabData.tuesday)
                        || (sectionData.wednesday && existingLabData.wednesday)
                        || (sectionData.thursday && existingLabData.thursday)
                        || (sectionData.friday && existingLabData.friday)
                        || (sectionData.saturday && existingLabData.saturday)) {
                        return true;
                    }
                }
            }
        }

        // Re-run checks against lab section if exists
        if (sectionData.lab_section) {
            // sectionData = section to add
            const sectionLabData = sectionData.lab_section;
            const newLabStart = moment(sectionLabData.time_begin, 'HH:mm:ss');
            const newLabEnd = moment(sectionLabData.time_end, 'HH:mm:ss');
            // userSections are the sections the user has already added
            const userSections = this.props.userData.sections;
            for (let i = 0; i < userSections.length; i++) {
                const userSection = userSections[i];
                const userStart = moment(userSection.time_begin, 'HH:mm:ss');
                const userEnd = moment(userSection.time_end, 'HH:mm:ss');
                if (newLabEnd.isSameOrAfter(userStart) && newLabStart.isSameOrBefore(userEnd)) {
                    if ((sectionLabData.monday && userSection.monday)
                        || (sectionLabData.tuesday && userSection.tuesday)
                        || (sectionLabData.wednesday && userSection.wednesday)
                        || (sectionLabData.thursday && userSection.thursday)
                        || (sectionLabData.friday && userSection.friday)
                        || (sectionLabData.saturday && userSection.saturday)) {
                        return true;
                    }
                }

                // Check for existing lab overlap
                if (userSection.lab_section) {
                    let existingLabData = userSection.lab_section;
                    const userLabStart = moment(existingLabData.time_begin, 'HH:mm:ss');
                    const userLabEnd = moment(existingLabData.time_end, 'HH:mm:ss');
                    if (newLabEnd.isSameOrAfter(userLabStart) && newLabStart.isSameOrBefore(userLabEnd)) {
                        if ((sectionData.monday && existingLabData.monday)
                            || (sectionData.tuesday && existingLabData.tuesday)
                            || (sectionData.wednesday && existingLabData.wednesday)
                            || (sectionData.thursday && existingLabData.thursday)
                            || (sectionData.friday && existingLabData.friday)
                            || (sectionData.saturday && existingLabData.saturday)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    render() {
        const {userData, handleSectionAdd, sectionData} = this.props;

        if (userData.sections == null) {
            return null;
        }

        let overlap = this.checkIfOverlap();
        let exists = this.checkIfExists();

        let add;
        if (exists) {
            add = "This Section Already Exists In Your Calendar"
        } else if (overlap) {
            add = "This Section Would Conflict With Your Calendar"
        } else {
            add = <Button onClick={() => handleSectionAdd(sectionData.id)}>Add Section</Button>
        }

        let labSectionOutput;
        if (sectionData['lab_section']) {
            const labSectionData = sectionData['lab_section'];
            const labStart = moment(labSectionData['time_begin'], 'HH:mm:ss');
            const labEnd = moment(labSectionData['time_end'], 'HH:mm:ss');
            labSectionOutput =
                <Card.Text> <b>LAB:&nbsp;</b>
                    {labSectionData['monday'] ? "M " : ""}
                    {labSectionData['tuesday'] ? "T " : ""}
                    {labSectionData['wednesday'] ? "W " : ""}
                    {labSectionData['thursday'] ? "Th " : ""}
                    {labSectionData['friday'] ? "F " : ""}
                    {labSectionData['saturday'] ? "S " : ""}
                    &nbsp;@&nbsp;
                    {labStart.isValid() ? labStart.format('LT') : "TBD"}
                    &nbsp;-&nbsp;
                    {labEnd.isValid() ? labEnd.format('LT') : "TBD"}
                </Card.Text>
        }

        const start = moment(sectionData['time_begin'], 'HH:mm:ss');
        const end = moment(sectionData['time_end'], 'HH:mm:ss');

        return (
            <Card className={'shadowed-hover mt-3'}>
                <Card.Body>
                    <Card.Title>{sectionData['course']['department']} {sectionData['course']['course_number']} | {sectionData.section_number}</Card.Title>
                    <Card.Subtitle
                        className={"text-muted"}>{sectionData.instructor ? sectionData.instructor : "Instructor N/A"}</Card.Subtitle>
                    <Card.Text className={"mt-2"}>
                        <b>LEC:&nbsp;</b>
                        {sectionData['monday'] ? "M " : ""}
                        {sectionData['tuesday'] ? "T " : ""}
                        {sectionData['wednesday'] ? "W " : ""}
                        {sectionData['thursday'] ? "Th " : ""}
                        {sectionData['friday'] ? "F " : ""}
                        {sectionData['saturday'] ? "S " : ""}
                        &nbsp;@&nbsp;
                        {start.isValid() ? start.format('LT') : "TBD"}
                        &nbsp;-&nbsp;
                        {end.isValid() ? end.format('LT') : "TBD"}
                    </Card.Text>
                    {labSectionOutput}
                    <div className={'mt-2'}>
                        <Row>
                            <Col sm={"auto"}>
                                Enrolled Students: {sectionData['enrolled_students']}
                            </Col>
                            <Col sm={"auto"}>
                                Available Seats: {sectionData['available_seats']}
                            </Col>
                        </Row>
                    </div>
                    <Card.Text className={'mt-3'}>
                        {add}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default SectionCard;