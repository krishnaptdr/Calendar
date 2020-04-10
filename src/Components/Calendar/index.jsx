import React from "react";
import './../Calendar/Calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import * as ModalConstant from './../../Constants/ModalConstants';
import {messageConstant} from './../../Constants/MessageConstant';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DATE_FORMAT,TIME_FORMAT} from "./../../Constants/AppConstant";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

 /**
 * This method is created for set end booking time from start time.
 */
Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
const bookedTime = 1

export default class index extends React.Component {
  constructor() {
    super();
    this.state = {
      event: [],
      eventPopup: false,
      slotBookingPopup: false,
      eventEdit: false,
      inputField: ModalConstant.inputData,
      events: ModalConstant.events,
      sortedData:"asc",
       formIsValid: "",
       errors: {}
    };
    this.searchData = [...this.state.events];
  }
  

   /**
   * This method is created for drop event.
   */
  
  onEventDrop = ({ event, start, end }) => {
    let events = [...this.state.events];
    let obj = events.find(elememt => (elememt.id === event.id)); // get array object
    let idx = events.indexOf(obj) // get object index
   
    this.setState(state => {
      state.events[idx].start = start;
      state.events[idx].end = end;
      return { events: state.events };
    });
  };

  onEventresize = ({ event, start, end }) => {
  
    var startEventDate = start.getFullYear() + "-" 
    + (start.getMonth() + 1) + "-" 
    + start.getDate()

    var startEventTime = event.start.getHours() + ":" 
    + event.start.getMinutes() + ":" 
    + event.start.getSeconds();

    var endEventDate = end.getFullYear() + "-" 
    + (end.getMonth() + 1) + "-" 
    + end.getDate()
    
    var endEventTime = event.end.getHours() + ":" 
    + event.end.getMinutes() + ":" 
    + event.end.getSeconds();

    let startTime = new Date(startEventDate + "," +startEventTime);
    let endTime = new Date(endEventDate + "," +endEventTime);

    console.log('start:', startTime,"end:", end, 'endTime: ', endTime);

    let events = [...this.state.events];
    let obj = events.find(elememt => (elememt.id === event.id)); // get array object
    let idx = events.indexOf(obj) // get object index
   
    this.setState(state => {
      state.events[idx].start = startTime;
      state.events[idx].end = endTime;
      return { events: state.events };
    },()=>{console.log('events resize ',events)});
  };

   /**
   * This method is created for click on event.
   */
  onEventClick = (event) =>{
    console.log('event: ',event)
    this.setState({event: event, eventPopup: true, selectedDay: event})
  }

   /**
   * This method is created for add new event.
   */
  onCalendarSelectSlot = (slots) =>{
    
    let inputField = {...this.state.inputField};
    let events = [...this.state.events];

    inputField['start'] = slots.start;
    inputField['end'] = new Date(slots.start).addHours(bookedTime);

     // for generate unique id
     if(!this.state.eventEdit){
      let max = 0;
      events.forEach(element => {
        if (element.id > max) {
          max = element.id;
        }
      });
      inputField['id'] = (max + 1) ;
    }
   
    this.setState({
      slotBookingPopup: true, inputField, selectedDay : slots.start, startDate: slots.start
    }, ()=> {console.log(inputField)})
  }


   /**
   * This method is created for close event popup.
   */
  closeEventPopup = (event) =>{
    this.setState({eventPopup: false, inputField: ""})
  }

  /** 
   * This method is created for close event booking popup. 
   */
  closeSlotBooking = () =>{
    this.setState({slotBookingPopup: false, eventEdit: false, inputField: "", formIsValid: "", errors:''});
 }

   /**
   * This method is created for change datepicker value for start date. 
   */
  handleChangeStartDate = date => {
    let inputField = {...this.state.inputField};
    inputField['start'] = date;
    inputField['end'] = date;
    this.setState({
      startDate: date,
      errors:'',
      inputField,
      formIsValid: ""
    });
  };

  /**
   * This method is created for change datepicker value for end date. 
   */
  handleChangeEndDate = date => {
    let inputField = {...this.state.inputField};
    inputField['end'] = date;
    this.setState({
      errors:'',
      inputField,
      formIsValid: ""
    });
  };

  /**
   * This method is created for update input value. 
   */
  myChangeHandler= (e)=>{
    let inputField = {...this.state.inputField};

    inputField[e.target.name] = e.target.value;
    this.setState({inputField});
  }

   /**
   * This method is created for add new event.
   */
  handleAddEvent = () =>{
    if (this.validation()) {
      let events = [...this.state.events];
      let inputField = {...this.state.inputField};

      events.push(inputField)
      this.setState({
        selectedDay: "",events, slotBookingPopup: false, eventEdit: false, inputField: ""
      }, () => {console.log(events)})
    }
  }

   /**
   * This method is created for open edit event popup.
   */
  editEvent = (event) =>{
    let events = [...this.state.events];
    this.setState({
      events, slotBookingPopup: true, eventEdit: true , eventPopup: false, inputField: event
    });
  }

   /**
   * This method is created for edit event.
   */
  handleEditEvent = () =>{
    let events = [...this.state.events]
    let inputField = {...this.state.inputField}
    let obj = events.find(elememt => (elememt.id === inputField.id)); // get array object
    let idx = events.indexOf(obj) // get object index

    events[idx] = inputField
    this.setState({
      selectedDay: "",events, slotBookingPopup: false, eventEdit: false, inputField: ""
    })
  }

   /**
   * This method is created for delete event.
   */
  deleteEvent = (event) =>{
    let events = [...this.state.events];
    let obj = events.find(elememt => (elememt.id === event.id));
    let idx = events.indexOf(obj)
    events.splice(idx, 1);
    this.setState({
      events, slotBookingPopup: false, eventPopup: false
    })
  }

  /**
   * this method is used for input validation
   */
  validation = () => {
     let events = [...this.state.events];
     let inputField = {...this.state.inputField}
     let formIsValid = true;
     let errors = {};

    if (!inputField["title"]) {
      formIsValid = false;
      errors["title"] = (messageConstant.BLANK_title_ERROR);
    }
    events.forEach(element => {
       if(new Date(element.start).toISOString() <= new Date(inputField.start).toISOString() && new Date(element.end).toISOString() >= new Date(inputField.start).toISOString()){
        formIsValid = false;
        console.log('formIsValid:', formIsValid)
        errors["start"] = (messageConstant.BOOCK_START_ERROR);
       }
      if(new Date(element.start).toISOString() === new Date(inputField.start).toISOString() ){
        formIsValid = false;
        errors["start"] = (messageConstant.BOOCK_End_ERROR);
      }
      if (!inputField["desc"]) {
        formIsValid = false;
        errors["desc"] = (messageConstant.BLANK_DESCRIPTION_ERROR);
      }
    })
    this.setState({
      formIsValid, errors
    })
    return formIsValid;
  }

  /**
   * This method is created for return slot booking popup. 
   * @returns 
   */
  slotBooking = () =>{
    return(
      <div className="booking-form">
         <span className="close-popup"
              onClick={e => {this.closeSlotBooking()}}
              
            >
              </span>
              {this.state.eventEdit ? 
                  <h3>Edit event</h3>
                :
                  <h3>Add event</h3>
              }
          <input
            type='text'
            name='title'
            placeholder="name"
            onChange={this.myChangeHandler}
            value={this.state.inputField.title}
          />
          <div className="errorMsg">{this.state.errors.title}</div>
          <div className="select-date">
            <label>Start Date</label><br />
            {/* date picker  */}
            <DatePicker
              dateFormat={DATE_FORMAT.TO_DISPLAY}
              timeFormat={TIME_FORMAT.TO_DISPLAY}
              selected={new Date(this.state.inputField.start)}
              onChange={this.handleChangeStartDate}
              showTimeSelect
              name="eventStartDate"
            />
            <div className="errorMsg">{this.state.errors.start}</div>
          </div>
          <div className="select-date">
            <label>End Date</label><br />
            {/* date picker  */}
            <DatePicker
              dateFormat={DATE_FORMAT.TO_DISPLAY}
              timeFormat={TIME_FORMAT.TO_DISPLAY}
              selected={new Date(this.state.inputField.end)}
              onChange={this.handleChangeEndDate}
              showTimeSelect
              name="endDate"
              minDate={new Date(this.state.startDate)}
            />
            <div className="errorMsg">{this.state.errors.end}</div>
          </div>
          {/* {this.state.formIsValid === false ?
            <span className="errorMsg">This time is already booked</span>
            :
            ""
            } */}
          <input
            type='text'
            name='desc'
            className="description"
            placeholder="desc"
            onChange={this.myChangeHandler}
            value={this.state.inputField.desc}
          />
          <div className="errorMsg">{this.state.errors.desc}</div>
          
          <br />
          {this.state.eventEdit ?
            <button 
            onClick={e => {this.handleEditEvent()}}
            className="button"
            >submit
          </button>
          :
          <button 
            onClick={e => {this.handleAddEvent()}}
            className="button"
            >submit
          </button>
          }

      </div>
    )
  }

    
  /**
   * this method is used for sort event data
   */
    onSort(sortKey){
      const events = [...this.state.events];
      let sortedData = this.state.sortedData;
      
      if(sortedData === 'asc'){
        if(sortKey === "start" || sortKey === "end"){
          events.sort((a, b) => a[sortKey] - b[sortKey])
        }else{
          events.sort((a,b) => a[sortKey].localeCompare(b[sortKey]) );
        }
      }else{
        if(sortKey === "start" || sortKey === "end"){
          events.sort((a, b) => b[sortKey] - a[sortKey])
        }else{
          events.sort((a,b) => b[sortKey].localeCompare(a[sortKey]));
        }
      }
      
      this.setState({events, sortedData: this.state.sortedData === "asc" ? "desc" : "asc"})
    }

   /**
   * This method created for search user in user table.
   */  
  searchEventFun = (e) =>{
    let events = [...this.searchData];
    
    if(e.target.value.length >= '3' ){
      events =  events.filter(element => (element.title.toLowerCase().includes(e.target.value) || element.desc.toLowerCase().includes(e.target.value) ));
    }
    setTimeout(() => {
    this.setState({events})
  }, 1000);
  }

   /**
   * This is render method.
   */
  render() {
    // let birthday = new Date('2020-12-06T21:54:00.000z')
    // console.log('birthday', new Date(birthday).toISOString().slice(0, 19).replace('T', ''))



  var getEventStartTime = new Date(this.state.event.start);
  var getEventEndTime = new Date(this.state.event.end);

  var startDateYear = getEventStartTime.getDate() + "/" 
  + (getEventStartTime.getMonth() + 1) + "/" 
  + getEventStartTime.getFullYear()

  var startDateTime = getEventStartTime.getHours() + ":" 
  + getEventStartTime.getMinutes() + ":" 
  + getEventStartTime.getSeconds();

  var endDateYear = getEventEndTime.getDate() + "/" 
  + (getEventEndTime.getMonth() + 1) + "/" 
  + getEventEndTime.getFullYear()

  var endDateTime = getEventEndTime.getHours() + ":" 
  + getEventEndTime.getMinutes() + ":" 
  + getEventEndTime.getSeconds();


  return (
    <div className="App">
      <main>
        <div className="calendar">
          {/* Calendar  */}
          <DnDCalendar
            defaultDate={new Date()}
            defaultView="month"
            events={this.state.events}
            localizer={localizer}
            onEventDrop={this.onEventDrop}
            onEventResize={this.onEventresize}
            resizable
            selectable
            // startAccessor="start"
            // endAccessor="end"
            style={{ height: "100vh" }}
            // scrollToTime={new Date(1970, 1, 1, 8)}
            onSelectEvent={event => this.onEventClick(event)}
            onSelectSlot={slots => this.onCalendarSelectSlot(slots)}
            className= 'react-calendar'
            onNavigate={(date) => { this.setState({ selectedDay: date })}}
            eventPropGetter={
              (event, start, end, isSelected) => {
                // La rayure du congès
                if(event.className === "conge") {
                  let  styleC = {
                    backgroundColor: '#31ad5d',
                    borderRadius: "3px",
                    border: "none",
                    backgroundImage: 'linear-gradient(120deg, #920692 25%, #f740f7 25%, #f740f7 50%, #920692 50%, #920692 75%, #f740f7 75%, #f740f7 100%)',
                    backgroundSize: '40.00px 69.28px',
                    fontSize:'40px',
                    color:'black',
                    textAlign:'center',
                    fontFamily:'Andale Mono, monospace',
                  };
                  return {
                    className: "conge",
                    style:styleC,
                    
                  };
                }
                let newStyle = {
                  backgroundColor: event.color,
                  borderRadius: "5px",
                  border: "none"
                };  
                return {
                  className: "",
                  style: newStyle,
                };
              }
            }
          />

          {/* Event list  */}
          <div className="event-list-header">
            <div>
              <h3>Event List</h3>
            </div>
            <div>
              <input type="text" className="mt-2" name="searchUser" 
              onChange={this.searchEventFun}
              placeholder="Search" />
            </div>
          </div>
          
          {this.state.events.length > 0 ?   
          <div className="responsive-table">      
          <table className="event-table">
            <thead>
              <tr>
                <th>Id</th>
                <th
                  onClick={e => this.onSort('title')}
                >Event</th>
                <th
                  onClick={e => this.onSort('start')}
                >Start</th>
                <th
                 onClick={e => this.onSort('end')}
                >End</th>
                <th
                onClick={e => this.onSort('desc')}
                >Desc</th>
              </tr>
            </thead>
            <tbody>
              {this.state.events.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.start).toISOString().slice(0, 19).replace('T', ', ')}</td>
                  <td>{new Date(item.start).toISOString().slice(0, 19).replace('T', ', ')}</td>
                  <td>{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          :
          <div className="text-center mt-4 no-record">
            <p className="mb-0">No records found</p>
          </div>
          }

          {/* event popup  */}
          {this.state.eventPopup ? 
            <div className="event-popup">
              <div className="popup-container">
                <span 
                className="close-popup"
                  onClick={e => this.closeEventPopup()}
                ></span>
                <h3>{this.state.event.title}</h3>
                <p><b>Date: </b>{startDateYear} {startDateYear === endDateYear? "" : "to " + endDateYear}</p> 
                <p><b>Time: </b>{startDateTime} to {endDateTime}</p>
                {/* <span>{startFullDateTime.toString()}</span> - <span>{endFullDateTime.toString()}</span> */}
                <p>{this.state.event.name}</p>
                <p>{this.state.event.desc}</p>
                <button
                  className="button"
                  onClick={e => {this.editEvent(this.state.event)}}
                >Edit</button>
                <button
                  className="button delete"
                  onClick={e => {this.deleteEvent(this.state.event)}}
                >Delete</button>
              </div>
            </div>
            :
              ""
          }
          {this.state.slotBookingPopup ?
          // add event popup 
          <div className="event-popup">
            <div className="book-popup">
              {this.slotBooking()}
            </div>
            </div>
          :
          ""
          }
        </div>
      </main>
    </div>
  );
  }
}
