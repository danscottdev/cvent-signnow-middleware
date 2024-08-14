import {Contact, Registration, Event} from '../config/cvent';

const STUDENT_NAME = 'Student Name';
const ADDRESS = 'Address';
const CITY = 'City';
const STATE = 'State';
const ZIP = 'Zip';
const PHONE_NUMBER = 'Phone Number';
const EMAIL = 'Email';
const EVENT_NAME = 'Event Name';
const EVENT_START_DATE = 'Event Start Date';
const EVENT_AMOUNT_PAID = 'Event Amount Paid'

export const formatSmartFields = (contact : Contact, registration: Registration, event: Event) => {
  return {
    data: [
      {
        [`${STUDENT_NAME}`]: `${contact.attributes.FirstName} ${contact.attributes.LastName}`
      },{
        [`${ADDRESS}`]: `${contact.attributes.HomeAddress1 || ADDRESS} ${contact.attributes.HomeAddress2} ${contact.attributes.HomeAddress3}`
      },{
        [`${CITY}`]: `${contact.attributes.HomeCity || contact.attributes.WorkCity || CITY}`
      },{
        [`${STATE}`]: `${contact.attributes.HomeState || contact.attributes.WorkState || STATE}`
      },{
        [`${ZIP}`]: `${contact.attributes.HomePostalCode || contact.attributes.WorkPostalCode || ZIP}`
      },{
        [`${PHONE_NUMBER}`]: `${contact.attributes.MobilePhone || contact.attributes.HomePhone || contact.attributes.WorkPhone || PHONE_NUMBER}`
      },{
        [`${EMAIL}`]: `${contact.attributes.EmailAddress || contact.attributes.CCEmailAddress || EMAIL}`
      },{
        [`${EVENT_NAME}`]: `${event.attributes.EventTitle || EVENT_NAME}`
      },{
        [`${EVENT_START_DATE}`]: `${event.attributes.EventStartDate || EVENT_START_DATE}`
      },{
        [`${EVENT_AMOUNT_PAID}`]: `${registration.OrderDetail[0].attributes.AmountPaid || '0.00'}`
      }
    ],
    client_timestamp: new Date().toUTCString()
  };
}