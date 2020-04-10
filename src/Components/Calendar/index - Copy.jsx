import React from "react";
import './../Calendar/Calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import * as ModalConstant from './../../Constants/ModalConstants';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DATE_FORMAT,TIME_FORMAT} from "./../../Constants/AppConstant";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
const bookedTime = 24

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
      // formIsValid: false
    };
    this.searchData = [...this.state.events];
  }
  

   /**
   * This method is created for drop event.
   */
  onEventDrop = ({ event, start, end, allDay }) => { 
    console.log(start);
    let events = [...this.state.events];
    let obj = events.find(elememt => (elememt.id === event.id)); // get array object
    let idx = events.indexOf(obj) // get object index
   
    let startD = start;
    let endD = end

    if (typeof start !== 'string') {
      startD = new Date(startD).toISOString()
    }

    if (typeof end !== 'string') {
      endD = new Date(endD).toISOString()
    }

    this.setState(state => {
      state.events[idx].start = new Date(startD);
      state.events[idx].end = new Date(endD);
      return { events: state.events };
    },()=>{console.log(events)});
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
    let newDate = new Date(slots.start).toISOString();
    
    let inputField = {...this.state.inputField};
    let events = [...this.state.events];

    inputField['start'] = newDate;
    inputField['end'] = new Date(slots.start).addHours(bookedTime).toISOString();

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
      slotBookingPopup: true, inputField, selectedDay : newDate, startDate: newDate
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
    this.setState({slotBookingPopup: false, eventEdit: false, inputField: ""});
 }

   /**
   * This method is created for change datepicker value for start date. 
   */
  handleChangeStartDate = date => {
    let inputField = {...this.state.inputField};
    inputField['start'] = new Date(date).toISOString();
    inputField['end'] = new Date(date).toISOString();
    this.setState({
      startDate: new Date(date).toISOString(),
      // endDate: new Date(date).addHours(bookedTime).toISOString(),
      inputField
    });
  };

  /**
   * This method is created for change datepicker value for end date. 
   */
  handleChangeEndDate = date => {
    let inputField = {...this.state.inputField};
    inputField['end'] = new Date(date).toISOString();
    this.setState({
      // endDate:  new Date(date).toISOString(),
      inputField
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
  else{
    console.log("Error")
  }
  }

   /**
   * This method is created for edit event.
   */
  editEvent = (event) =>{
    let events = [...this.state.events];
    
    this.setState({
      events, slotBookingPopup: true, eventEdit: true , eventPopup: false, inputField: event
    });
  }

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
     let formIsValid = true

    if(events.find(element => element.start === inputField.start)){
      formIsValid = false;
    }

    this.setState({
      formIsValid
    })
        
    console.log('formIsValid:' ,formIsValid, inputField.start, events.find(element => element.start === inputField.start))
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
          </div>
          <input
            type='text'
            name='desc'
            placeholder="desc"
            onChange={this.myChangeHandler}
            value={this.state.inputField.desc}
          />
          
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
    console.log('inputField: ', this.state.inputField)
    // let birthday = new Date('2020-12-06T21:54:00.000z')
    // console.log('birthday', new Date(birthday).toISOString().slice(0, 19).replace('T', ''))

  var getEventStartTime = new Date(this.state.event.start);
  var getEventEndTime = new Date(this.state.event.end);

  var startDateYear = getEventStartTime.getDate() + "/" 
  + (getEventStartTime.getMonth() + 1) + "/" 
  + getEventStartTime.getFullYear() + ", "

  var startDateTime = getEventStartTime.getHours() + ":" 
  + getEventStartTime.getMinutes() + ":" 
  + getEventStartTime.getSeconds();

  var endDateYear = getEventEndTime.getDate() + "/" 
  + (getEventEndTime.getMonth() + 1) + "/" 
  + getEventEndTime.getFullYear() + ", "

  var endDateTime = getEventEndTime.getHours() + ":" 
  + getEventEndTime.getMinutes() + ":" 
  + getEventEndTime.getSeconds();

  var startFullDateTime = startDateYear + startDateTime

  var endFullDateTime = startDateYear === endDateYear ? endDateTime : endDateYear + endDateTime

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
            onEventResize={this.onEventDrop}
            resizable
            selectable
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100vh" }}
            // scrollToTime={new Date(1970, 1, 1, 8)}
            onSelectEvent={event => this.onEventClick(event)}
            onSelectSlot={slots => this.onCalendarSelectSlot(slots)}
            className= 'react-calendar'
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
                <span>{startFullDateTime.toString()}</span> - <span>{endFullDateTime.toString()}</span>
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



// import React from "react";
// import './../Calendar/Calendar.css'
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import * as ModalConstant from './../../Constants/ModalConstants';

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {DATE_FORMAT,TIME_FORMAT} from "./../../Constants/AppConstant";

// import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const localizer = momentLocalizer(moment);
// const DnDCalendar = withDragAndDrop(Calendar);

// export default class index extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       event: [],
//       eventPopup: false,
//       slotBookingPopup: false,
//       editEvent: false,
//       inputField: ModalConstant.inputData,
//       events: ModalConstant.events,
//       startDate: new Date(),
//       endDate: new Date(),
//     };
//   }

//    /**
//    * This method is created for drop event.
//    */
//   onEventDrop = ({ event, start, end }) => {
//     let events = [...this.state.events];
//     let obj = events.find(elememt => (elememt.id === event.id)); // get array object
//     let idx = events.indexOf(obj) // get object index
//     console.log('start: ',start)
//     this.setState(state => {
//       state.events[idx].start = start;
//       state.events[idx].end = end;
//       return { events: state.events };
//     });
//   };

//    /**
//    * This method is created for click on event.
//    */
//   onEventClick = (event) =>{
//     this.setState({event: event, eventPopup: true})
//   }

//    /**
//    * This method is created for add new event.
//    */
//   onCalendarSelectSlot = (e) =>{
//     let newDate = new Date();
//     let inputField = {...this.state.inputField};
//     inputField['start'] = newDate;
//     inputField['end'] = newDate;
//     this.setState({slotBookingPopup: true, inputField}, () => {console.log('inputField:', this.state.inputField)})
//   }

//    /**
//    * This method is created for close event popup.
//    */
//   closeEventPopup = (event) =>{
//     this.setState({eventPopup: false})
//   }

//   /**
//    * This method is created for close event booking popup. 
//    */
//   closeSlotBooking = () =>{
//     this.setState({slotBookingPopup: false, editEvent: false});
//  }

//    /**
//    * This method is created for change datepicker value for start date. 
//    */
//   handleChangeStartDate = date => {
//     console.log('date:',date)
//     let inputField = {...this.state.inputField};
//     inputField['start'] = date;
//     this.setState({
//       startDate: date,
//       // selectedDay: date.getDate(),
//        endDate: date,
//       inputField
//     });
//   };

//   /**
//    * This method is created for change datepicker value for end date. 
//    */
//   handleChangeEndDate = date => {
//     console.log('date:',date)
//     let inputField = {...this.state.inputField};
//     inputField['end'] = date;
//     this.setState({
//       endDate: date,
//       inputField
//     });
//   };

//   /**
//    * This method is created for return slot booking popup. 
//    * @returns 
//    */
//   slotBooking = () =>{
//     return(
//       <div className="booking-form">
//          <span className="close-popup"
//               onClick={e => {this.closeSlotBooking()}}
              
//             >
//               </span>
//               {this.state.editEvent ? 
//                   <h3>Edit event</h3>
//                 :
//                   <h3>Add event</h3>
//               }
//           <input
//             type='text'
//             name='title'
//             placeholder="name"
//             onChange={this.myChangeHandler}
//             value={this.state.inputField.title}
//           />
//           <div className="select-date">
//             <label>Start Date</label><br />
//             {/* date picker  */}
//             <DatePicker
//               dateFormat={DATE_FORMAT.TO_DISPLAY}
//               timeFormat={TIME_FORMAT.TO_DISPLAY}
//               selected={this.state.startDate}
//               onChange={this.handleChangeStartDate}
//               value={this.state.inputField.start}
//               name="eventStartDate"
//             />
//           </div>
//           <div className="select-date">
//             <label>End Date</label><br />
//             {/* date picker  */}
//             <DatePicker
//               dateFormat={DATE_FORMAT.TO_DISPLAY}
//               timeFormat={TIME_FORMAT.TO_DISPLAY}
//               selected={this.state.endDate}
//               onChange={this.handleChangeEndDate}
//               value={this.state.inputField.end}
//               name="endDate"
//               minDate={this.state.startDate}
//             />
//           </div>
//           <input
//             type='text'
//             name='desc'
//             placeholder="desc"
//             onChange={this.myChangeHandler}
//             value={this.state.inputField.desc}
//           />
          
//           <br />
//           {this.state.editEvent ?
//             <button 
//             onClick={e => {this.handleEditEvent()}}
//             className="button"
//             >submit
//           </button>
//           :
//           <button 
//             onClick={e => {this.handleAddEvent()}}
//             className="button"
//             >submit
//           </button>
//           }

//       </div>
//     )
//   }

//   /**
//    * This method is created for update input value. 
//    */
//   myChangeHandler= (e)=>{
//     let inputField = {...this.state.inputField};
//     let events = [...this.state.events];
//     if(!this.state.editEvent){
      
//       inputField['id'] = events.length + 1;
//     }
//     inputField[e.target.name] = e.target.value;
//     this.setState({inputField});
//   }

//    /**
//    * This method is created for add new event.
//    */
//   handleAddEvent = () =>{
//     let events = [...this.state.events];
//     let inputField = {...this.state.inputField};

//     events.push(inputField)

//     this.setState({
//       selectedDay: "",events, slotBookingPopup: false, editEvent: false
//     })
//   }

//    /**
//    * This method is created for edit event.
//    */
//   editEvent = (event) =>{
//     let events = [...this.state.events];
//     this.setState({
//       events, slotBookingPopup: true, editEvent: true , eventPopup: false, inputField : event
//     })

//   }

//   handleEditEvent = () =>{
//     let events = [...this.state.events]
//     let inputField = {...this.state.inputField}
//     let obj = events.find(elememt => (elememt.id === inputField.id)); // get array object
//     console.log('obj:', inputField)
//     let idx = events.indexOf(obj) // get object index

//     events[idx] = inputField
//     this.setState({
//       selectedDay: "",events, slotBookingPopup: false, editEvent: false
//     })
//   }

//    /**
//    * This method is created for delete event.
//    */
//   deleteEvent = (event) =>{
//     let events = [...this.state.events];
//     let obj = events.find(elememt => (elememt.id === event.id));
//     let idx = events.indexOf(obj)
//     events.splice(idx, 1);
//     this.setState({
//       events, slotBookingPopup: false, eventPopup: false
//     })
//   }

//    /**
//    * This is render method.
//    */
//   render() {
//     let birthday = new Date('1995-12-06T21:54:00.000z')
//     console.log('birthday', new Date(birthday).toISOString().slice(0, 19).replace('T', ''))

//   var getEventStartTime = new Date(this.state.event.start);
//   var getEventEndTime = new Date(this.state.event.end);

//   var startDateYear = getEventStartTime.getDate() + "/" 
//   + (getEventStartTime.getMonth() + 1) + "/" 
//   + getEventStartTime.getFullYear() + ", "

//   var startDateTime = getEventStartTime.getHours() + ":" 
//   + getEventStartTime.getMinutes() + ":" 
//   + getEventStartTime.getSeconds();

//   var endDateYear = getEventEndTime.getDate() + "/" 
//   + (getEventEndTime.getMonth() + 1) + "/" 
//   + getEventEndTime.getFullYear() + ", "

//   var endDateTime = getEventEndTime.getHours() + ":" 
//   + getEventEndTime.getMinutes() + ":" 
//   + getEventEndTime.getSeconds();

//   var startFullDateTime = startDateYear + startDateTime

//   var endFullDateTime = startDateYear === endDateYear ? endDateTime : endDateYear + endDateTime

//   return (
//     <div className="App">
//       <main>
//         <div className="calendar">
//           <DnDCalendar
//             defaultDate={new Date()}
//             defaultView="month"
//             events={this.state.events}
//             localizer={localizer}
//             onEventDrop={this.onEventDrop}
//             onEventResize={this.onEventDrop}
//             resizable
//             selectable
//             style={{ height: "100vh" }}
//             onSelectEvent={event => this.onEventClick(event)}
//             onSelectSlot={e => this.onCalendarSelectSlot(e)}
//           />
//           {this.state.eventPopup ? 
//             <div className="event-popup">
//               <div className="popup-container">
//                 <span 
//                 className="close-popup"
//                   onClick={e => this.closeEventPopup()}
//                 ></span>
//                 <h3>{this.state.event.title}</h3>
//                 <span>{startFullDateTime.toString()}</span> - <span>{endFullDateTime.toString()}</span>
//                 <p>{this.state.event.name}</p>
//                 <p>{this.state.event.desc}</p>
//                 <button
//                   className="button"
//                   onClick={e => {this.editEvent(this.state.event)}}
//                 >Edit</button>
//                 <button
//                   className="button delete"
//                   onClick={e => {this.deleteEvent(this.state.event)}}
//                 >Delete</button>
//               </div>
//             </div>
//             :
//               ""
//           }
//           {this.state.slotBookingPopup ?
//           // add event popup 
//           <div className="event-popup">
//             <div className="book-popup">
//               {this.slotBooking()}
//             </div>
//             </div>
//           :
//           ""
//           }
//         </div>
//       </main>
//     </div>
//   );
//   }
// }