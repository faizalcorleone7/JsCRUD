import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import axios from 'axios'


class AddorUpdateRecordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      displayForm: this.props.displayForm,
      route: this.props.route,
      id: this.props.id ? this.props.id : "",
      User: this.props.User ? this.props.User : "",
      Name: this.props.Name ? this.props.Name : "",
      date: this.props.Date ? this.props.Date : "",
      changes: this.props.changes ? this.props.changes : 0,
      method: this.props.method
    }

    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.renderForm = this.renderForm.bind(this)
    this.renderData = this.renderData.bind(this)
    this.renderAddButton = this.renderAddButton.bind(this)

  }

  showForm()
  {
    this.setState({
      displayForm: true
    })
  }

  closeForm()
  {
    this.setState({
      displayForm: false
    })
  }

  changeUserFormValue(event)
  {
    let value = event.target.value;
    this.setState({
      User: value
    })
  }

  changeNameFormValue(event)
  {
    let value = event.target.value;
    this.setState({
      Name: value
    })
  }

  changeDateFormValue(event)
  {
    let value = event.target.value;
    this.setState({
      date: value
    })
  }

  changeChangesFormValue(event)
  {
    let value = event.target.value;
    this.setState({
      changes: value
    })
  }

  performSubmitAction()
  {
    let user = this.state.User;
    let name = this.state.Name;
    let date = this.state.date;
    let changes = this.state.changes;
    let route = this.state.route;
    let id = this.state.id;
    let method = this.state.method;

    if (date === "" )
    {
      alert("Date input is required")
      return;
    }

    let valueSegments = new Date(date).toISOString().split("T");
    date = valueSegments[0] + "%20" + valueSegments[1].split("Z")[0];

    const backendEndpoint = `http://localhost:5000/${route}`
    let finalUrl = `${backendEndpoint}?User=${user}&Name=${name}&Date=${date}&changes=${changes}`

    if (id !== "")
    {
      finalUrl = `${finalUrl}&id=${id}`;
    }

    if (method === "post")
    {
      axios.post(finalUrl).then((response) => {
        this.redirectToHomePage()
      }).catch((error) => {
        this.logErrorToConsole(error)
      })
    }
    else
    {
      axios.put(finalUrl).then((response) => {
        this.redirectToHomePage()
      }).catch((error) => {
        this.logErrorToConsole(error)
      })
    }
  }

  redirectToHomePage()
  {
    let homePage = window.location.origin
    window.location.href = homePage
  }

  logErrorToConsole(error)
  {
    console.log("Error occured when trying to save record ->");
    console.log(error);
  }

  renderData()
  {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="">
        <FloatingLabel controlId="User" label="User" className="mb-3">
          <Form.Control onChange={this.changeUserFormValue.bind(this)} value={this.state.User} type="text" placeholder={"User"} />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="">
          <FloatingLabel controlId="Name" label="Name" className="mb-3">
            <Form.Control onChange={this.changeNameFormValue.bind(this)} value={this.state.Name} type="text" placeholder={"Name"} />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="">
          <FloatingLabel controlId="Date of Creation" label="Date of Creation" className="mb-3">
            <Form.Control onChange={this.changeDateFormValue.bind(this)} value={this.state.date.split(".")[0]} type="datetime-local" placeholder={"Date"} />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="mb-3" controlId="">
          <FloatingLabel controlId="Changes" label="Changes" className="mb-3">
            <Form.Control onChange={this.changeChangesFormValue.bind(this)} value={this.state.changes} type="number" placeholder={"Changes"} />
          </FloatingLabel>
        </Form.Group>
        <Button type="button" onClick={this.performSubmitAction.bind(this)}>Submit</Button>
      </Form>
    )
  }

  renderForm()
  {
    let formTitle = this.state.title === "Add" ? "Add New Record Form" : "Update Record Form"
    return (
      <div className="Popup">
        <div className="AddorUpdateHeader">
          <span>
            <h2 style={{textAlign: "center", display: "inline-block"}}>{formTitle}</h2>
          </span>
          <span style={{alignItems:"right", display: "inline-block"}}>
            <CloseButton onClick={this.closeForm}/>
          </span>
        </div>
        {
          this.renderData()
        }
      </div>
    )
  }

  renderAddButton()
  {
    return (
      <div class="AddRecordButton">
        <Button onClick={this.showForm}>Add record</Button>
      </div>
    )
  }

  render() {
    let displayForm = this.state.displayForm;
    let title = this.state.title;

    return (
      <React.Fragment>
        {
          title === "Add" ? this.renderAddButton() : ""
        }
        {
          displayForm === true ? this.renderForm() : ""
        }
      </React.Fragment>
    );
  }
}

export default AddorUpdateRecordComponent;
