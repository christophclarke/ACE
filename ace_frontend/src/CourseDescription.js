import React, {Component} from 'react';
import axios from 'axios';
import SectionCard from "./SectionCard";

class CourseDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseData: {},
            sections: []
        }
    }

    componentDidMount() {
        const courseUrl = `${this.props.url}/departments/${this.props.department}/courses/${this.props.course}`;
        axios.get(courseUrl)
            .then((response) => {
                const data = response.data;
                this.setState({
                    courseData: data
                });
                console.log(response);
                console.log(this.state.data)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });

        const sectionsUrl = `${courseUrl}/sections`;
        axios.get(sectionsUrl)
            .then((response) => {
                console.log(response.data);
                const data = response.data.sort((a, b) => {return a.section_number > b.section_number});
                this.setState({
                    sections: data
                });
                console.log(response);
                console.log(this.state.data)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    render() {
        const sections = this.state.sections.map((value, index) => {
            return (
                <SectionCard
                    key={index}
                    sectionData={value}
                    handleSectionAdd={(sectionId) => this.props.handleSectionAdd(sectionId)}
                />
            )
        });

        return (
            <div>
                <h2>{this.props.department} {this.props.course}</h2>
                {sections}
            </div>
        )
    }
}

export default CourseDescription