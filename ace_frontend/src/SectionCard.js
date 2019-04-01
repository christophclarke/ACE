import React, {Component} from 'react';
import {Card, Button} from 'react-bootstrap'

class SectionCard extends Component {
    render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Title>{this.props.sectionData.section_number}</Card.Title>
                    <p>{this.props.sectionData.instructor}</p>
                    <Button onClick={() => this.props.handleSectionAdd(this.props.sectionData.id)}>Add Section</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default SectionCard;