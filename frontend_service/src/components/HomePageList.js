import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import AddorUpdateRecordComponent from './AddorUpdateRecordComponent';

export class HomePageList extends Component {

  constructor(props)
  {
    super(props);
    const pageIndex = document.location.href.split("/")[3].split("=")[1];
    this.state = {
      data: [],
      activePage: pageIndex === undefined ? 1 : parseInt(pageIndex),
      firstPaginationItemIndex: pageIndex === undefined ? 1 : parseInt(pageIndex),
      totalRows: 0,
      updateRowData: undefined
    }

    this.renderHeader = this.renderHeader.bind(this);
    this.renderData = this.renderData.bind(this);
    this.renderPaginationItems = this.renderPaginationItems.bind(this);
    this.decFirstPaginationItemIndex = this.decFirstPaginationItemIndex.bind(this);
    this.changeActivePage = this.changeActivePage.bind(this);
    this.incFirstPaginationItemIndex = this.incFirstPaginationItemIndex.bind(this);
    this.updateStateRowData = this.updateStateRowData.bind(this);
    this.renderUpdateForm = this.renderUpdateForm.bind(this);

  }

    componentDidMount()
    {
      let activePageIndex = this.state.activePage - 1;
      const backendEndpoint = `http://localhost:5000/?offset=${activePageIndex * 25}`
      axios.get(`${backendEndpoint}`).then((res) => {
        this.setState({
          data: res.data,
          totalRows: parseInt(res.data["totalRows"])
        })
      }).catch((error) => {
        console.log("Error occured while fetching records -")
        console.log(error)
      })
    }

    updateStateRowData(data, e)
    {
      this.setState({
        updateRowData: data
      })
    }

    renderUpdateForm()
    {
      let data = this.state.updateRowData;
      return (
        <AddorUpdateRecordComponent displayForm={true} title={"Update"} {...data} route={"updateRecord"} method={"patch"} />
      )
    }

    decFirstPaginationItemIndex()
    {
      let decreasedFirstPaginationItemIndex = this.state.firstPaginationItemIndex - 1
      if (decreasedFirstPaginationItemIndex >= 1)
      {
        this.setState({
          firstPaginationItemIndex: decreasedFirstPaginationItemIndex
        })
      }
    }

    changeActivePage(index)
    {
      let homeRoute = window.location.origin
      window.location.href = `${homeRoute}/pageIndex=${index}`
    }

    incFirstPaginationItemIndex()
    {
      let increasedFirstPaginationItemIndex = this.state.firstPaginationItemIndex + 1
      this.setState({
        firstPaginationItemIndex: increasedFirstPaginationItemIndex
      })
    }

    renderPaginationItems()
    {
      let itemsList = []
      let flag = 0;
      const totalRows = parseInt(this.state.totalRows);
      const numberOfItemsPerPage = 5;
      const startIndex = this.state.firstPaginationItemIndex;
      const endIndex = (startIndex + numberOfItemsPerPage) < Math.ceil(totalRows/25) + 1 ? (startIndex + numberOfItemsPerPage) : Math.ceil(totalRows/25) + 1

      if (endIndex === Math.ceil(totalRows/25) + 1)
      {
        flag = 1
      }

      if (startIndex > 1)
      {
        itemsList.push(<Button style={{padding: "1%", margin: "1%"}} size="sm" onClick={this.decFirstPaginationItemIndex}>{"<-"}</Button> )
      }

      for (let index = startIndex; index < endIndex; index++)
      {
        itemsList.push(<Button style={{padding: "1%", margin: "1%"}} size="sm" onClick={this.changeActivePage.bind(this, index)}>{index}</Button>)
      }
      if (flag === 0)
      {
        itemsList.push(<Button style={{padding: "1%", margin: "1%"}} size="sm" onClick={this.incFirstPaginationItemIndex}>{"->"}</Button>)
      }
      return itemsList;
    }

  renderHeader()
  {
    let thArray = [];
    const headers = ["User", "Name", "Changes", "Last Updated At"]
    for (let header in headers)
    {
      thArray.push(<th>{headers[header]}</th>);
    }
    thArray.push(<th>Actions available</th>);
    return thArray;
  }

  renderData()
  {
    const rowData = this.state.data;
    const startIndex = 0;
    const endIndex = Object.keys(rowData).length - 1;
    let row = [];
    let finalDataRender = [];
    const headers = ["User", "Name", "changes", "updated_at"]
    for (let data = startIndex; data < endIndex; data++)
    {
      for (let header in headers)
      {
        row.push(<td>{rowData[data][headers[header]]}</td>)
      }
      row.push(<td><a style={{ color: "mediumblue", display: "inline" }} onClick={this.updateStateRowData.bind(this, rowData[data])}>Update</a></td>);
      finalDataRender.push(<tr>{row}</tr>);
      row = [];
    }
    return finalDataRender;
  }

  render()
  {
    let data = this.state.data;
    let updateData = this.state.updateRowData;
    return (
      <React.Fragment>
        <h1 style={{marginTop: '2%'}}>Records</h1>
        <div className="DataTable" style={{position: "relative"}}>
          <AddorUpdateRecordComponent title={"Add"} displayForm={false} route={'addRecord'} method={"post"} />
          {
            updateData ? this.renderUpdateForm() : ""
          }
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                {this.renderHeader()}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? "" : this.renderData()}
            </tbody>
          </Table>
        </div>
        <div className="Pagination">
          {data.length === 0 ? "" : this.renderPaginationItems()}
        </div>
      </React.Fragment>
    )
  }
}

export default HomePageList
