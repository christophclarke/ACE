import React, {Component} from 'react';
import {Button, ButtonToolbar, Card, Col, Container, Row} from 'react-bootstrap'
import moment from "moment";

function SmallSectionCard(props) {
    const {sectionData} = props;

    const start = moment(sectionData['time_begin'], 'HH:mm:ss');
    const end = moment(sectionData['time_end'], 'HH:mm:ss');

    return (
        <Card className={'mt-2'}>
            <Card.Body>
                <Card.Text>
                    <Col style={{padding:'0'}}>
                        <h6>
                            {sectionData['course']['department']} {sectionData['course']['course_number']} | {sectionData.section_number}
                        </h6>
                    </Col>
                    <Col style={{padding:'0'}}>
                        {/*<Button variant="danger" size="sm" style={{float: 'right', marginTop: '-5px', padding: '6px', backgroundColor: 'red'}}>*/}
                        {/*    Remove*/}
                        {/*</Button>*/}
                        <Button variant="danger" size="sm" style={{float: 'right', marginTop: '-8.5px'}} onClick={() => props.handleDelete(sectionData["id"])}>
                            Remove
                        </Button>
                    </Col>
                </Card.Text>
                <Card.Text className={'mb-2'}>
                    {sectionData['course']['course_title']}
                </Card.Text>
                <Card.Text className={'text-muted'}>
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
            </Card.Body>
        </Card>
    )
}

class UserInfo extends Component {
    render() {

        if (!this.props.userData.sections) {
            return null;
        }

        const sections = this.props.userData.sections.map((entry, index) => {
            return <SmallSectionCard key={index} sectionData={entry} handleDelete={(sectionId) => this.props.handleDelete(sectionId)}/>
        });

        return (
            <Card>
                <Card.Body>
                    <Container style={{padding: 0}}>
                        <Row>
                            <Col>
                                <h2>{this.props.userData.username}</h2>
                            </Col>
                            <Col>
                                <Button style={{float: "right"}} onClick={this.props.handleLogout}>Logout</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                {sections}
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }
}

export default UserInfo;