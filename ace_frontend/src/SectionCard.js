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
        const sectionData = this.props.sectionData;
        const newStart = moment(this.props.sectionData.time_begin, 'HH:mm:ss');
        const newEnd = moment(this.props.sectionData.time_end, 'HH:mm:ss');
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

        const start = moment(sectionData['time_begin'], 'HH:mm:ss');
        const end = moment(sectionData['time_end'], 'HH:mm:ss');

        return (
            <Card className={'mt-3'}>
                <Card.Body>
                    <Card.Title>{sectionData['course']} | {sectionData.section_number}</Card.Title>
                    <Card.Subtitle>{sectionData.instructor ? sectionData.instructor : "Instructor N/A"}</Card.Subtitle>
                    <Card.Text className={"text-muted"}>
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
                    <Card.Text className={'mt-2'}>
                        <Row>
                            <Col sm={"auto"}>
                                Enrolled Students: {sectionData['enrolled_students']}
                            </Col>
                            <Col sm={"auto"}>
                                Available Seats: {sectionData['available_seats']}
                            </Col>
                        </Row>
                    </Card.Text>
                    <Card.Text className={'mt-3'}>
                        {add}
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export default SectionCard;