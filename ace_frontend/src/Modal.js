import React, { Component } from 'react';

class Modal extends Component {

    render() {
        const showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
        return (
            <div className={showHideClassName}>
                <section className="modal-main">
                    {this.props.children}
                    <button onClick={this.props.handleClose}>close</button>
                </section>
            </div>
        );
    }
}

export default Modal;