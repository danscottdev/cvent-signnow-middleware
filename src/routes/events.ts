import express from 'express';
import path from 'path';
import axios from 'axios';
import { SearchFilter } from '../config/cvent';
import { cventLogin, cventRetrieve, cventSearch } from '../services/cvent';
import { Contact, Event, Registration } from '../config/cvent';
import { generateAccessToken, createDocument, populateFields, inviteSign } from '../services/signnow';
import { logger } from '../utils/logger';

const events: express.Router = express.Router();

events.get('/sign', async (req: express.Request, res: express.Response) => {
  const errorPage = path.join(__dirname, '../views/error.html');
  const successPage = path.join(__dirname, '../views/success.html');

  let accessToken = process.env.ACCESS_TOKEN ?? '';
  const clientId = process.env.CVENT_WEB_SERVICE_CLIENT_ID;
  const clientSecret = process.env.CVENT_WEB_SERVICE_CLIENT_SECRET;

  try {

    const clientIdEncoded = Buffer.from(clientId + ':' + clientSecret).toString('base64');

    // logger('info', req.query.u as string, 'Retrieving Cvent access token...', clientIdEncoded);

    const { data } = await axios({
      method: 'post',
      url: 'https://api-platform.cvent.com/ea/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${clientIdEncoded}`,
      },
      data: `grant_type=client_credentials&client_id=${clientId}`

    });

    // logger('info', req.query.u as string, 'Access data:', data );
    accessToken = data.access_token;
    process.env.ACCESS_TOKEN = accessToken;


  } catch (err : any) {
    logger('error', req.query.u as string, 'There was a problem trying to authenticate with Cvent', err.stack);
    return res.status(500).sendFile(errorPage);
  }



  try {

    // logger('info', req.query.u as string, 'Retrieving Cvent data...', '');

    if (!req.query.u || !req.query.t || !req.query.e) {
      return res.status(400).sendFile(errorPage);
    }

    // const u = req.query.u as string;
    // const t = req.query.t as string;
    // const e = req.query.e as string;

    const contactAPI = `https://api-platform.cvent.com/ea/contacts?filter=email eq '${req.query.u}'`;
    const eventAPI = `https://api-platform.cvent.com/ea/events?filter=code eq '${req.query.e}'`;

    const contactDataAll = await axios.get(contactAPI, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    // logger('info', req.query.u as string, 'Contact API:', contactAPI );

    // logger('info', req.query.u as string, 'Contact Data:', JSON.stringify( contactDataAll.data ) );

    const contactInfo = {
      attributes: {
        'Id': contactDataAll.data.data[0].id,
        'FirstName': contactDataAll.data.data[0].firstName,
        'LastName': contactDataAll.data.data[0].lastName,
        'EmailAddress': contactDataAll.data.data[0].email,
        'HomeAddress1': contactDataAll.data.data[0].homeAddress?.address1 ?? '',
        'HomeAddress2': contactDataAll.data.data[0].homeAddress?.address2 ?? '',
        'HomeAddress3': contactDataAll.data.data[0].homeAddress?.address3 ?? '',
        'HomeCity': contactDataAll.data.data[0].homeAddress?.city ?? '',
        'HomeState': contactDataAll.data.data[0].homeAddress?.region ?? '',
        'HomeStateCode': contactDataAll.data.data[0].homeAddress?.regionCode ?? '',
        'HomePostalCode': contactDataAll.data.data[0].homeAddress?.postalCode ?? '',
        'MobilePhone': contactDataAll.data.data[0].mobilePhone ?? '',
        'HomePhone': contactDataAll.data.data[0].mobilePhone ?? '',
        'WorkPhone': contactDataAll.data.data[0].mobilePhone ?? ''
      },

    }

    // logger('info', req.query.u as string, 'Contact Data:', JSON.stringify( contactInfo ) );

    const eventDataAll = await axios.get(eventAPI, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    const eventInfo = {
      attributes: {
        'Id': eventDataAll.data.data[0].id,
        'EventCode': eventDataAll.data.data[0].code,
        'EventTitle': eventDataAll.data.data[0].title,
        'EventStartDate': eventDataAll.data.data[0].start
      }
    }

    // logger('info', req.query.u as string, 'Event INFO:', JSON.stringify( eventInfo ) );

    if (!contactInfo || !eventInfo) {
      logger('error', req.query.u as string, 'Either the user or event were not found', {eventInfo, contactInfo}.toString());
      return res.status(404).sendFile(errorPage);
    }

    const attendeeAPI = `https://api-platform.cvent.com/ea/attendees?filter=contact.id eq '${contactInfo.attributes.Id}' and event.id eq '${eventInfo.attributes.Id}'`;

    const attendeeDataAll = await axios.get(attendeeAPI, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    const attendeeInfo = {
      attributes: {
        'Id': attendeeDataAll.data.data[0].id
      }
    };

    // logger('info', req.query.u as string, 'Attendee Data:', JSON.stringify( attendeeInfo ) );

    const orderAPI = `https://api-platform.cvent.com/ea/events/${eventInfo.attributes.Id}/orders/items?filter=attendee.id eq '${attendeeInfo.attributes.Id}'`;
    const orderDataAll = await axios.get(orderAPI, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    // logger('info', req.query.u as string, 'Order Data:', JSON.stringify( orderDataAll.data.data[0] ) );

    const registrationInfo = {
      OrderDetail: [
        {
          attributes: {
            'AmountPaid': orderDataAll.data.data[0].amountPaid
          }
        }
      ]
    };

    // Standard SignNow API calls
    const SignNowAccessTokenResponse = await generateAccessToken(req.query.u as string);

    const document = await createDocument(req.query.t as string, SignNowAccessTokenResponse.data.access_token as string, req.query.u as string);

    if (document.errorCode) {
      return res.status(500).sendFile(errorPage);
    }

    const populateFieldsResponse = await populateFields(document.data.id as string, SignNowAccessTokenResponse.data.access_token as string, {contactInfo: contactInfo as Contact, registrationInfo: registrationInfo as Registration, eventInfo: eventInfo as Event});

    if (!populateFieldsResponse) {
      return res.status(500).sendFile(errorPage);
    }

    const inviteSignResponse = await inviteSign(document.data.id as string, SignNowAccessTokenResponse.data.access_token as string, req.query.u as string);

    if (!inviteSignResponse) {
      return res.status(500).sendFile(errorPage);
    }

    res.status(200).sendFile(successPage);


  } catch (err : any) {
    logger('error', req.query.u as string, 'something went wrong HERE', err );
    res.status(500).sendFile(errorPage);

  }

});

events.get('/sign-old', async (req: express.Request, res: express.Response) => {

  const errorPage = path.join(__dirname, '../views/error.html');
  const successPage = path.join(__dirname, '../views/success.html');

  try {

    if (!req.query.u || !req.query.t || !req.query.e) {
      return res.status(400).sendFile(errorPage);
    }

    const LoginResult = await cventLogin(); // start here
    // Log output? What's Cvent login?

    // Convert LoginResult to ssomething that can be outputted via logger():
    // const output = JSON.stringify(LoginResult);
    // logger('info', req.query.u as string, 'The user has signed in', output );

    // logger('info', req.query.u as string, 'The user has signed in', LoginResult );

    const ContactsFilters : SearchFilter = {
      filter: req.query.u as string,
      field: 'EmailAddress',
      operator: 'Equals'
    }

    const EventsFilter : SearchFilter = {
      filter: req.query.e as string,
      field: 'EventCode',
      operator: 'Equals'
    }

    const ContactsPromise = cventSearch('Contact', LoginResult.attributes.CventSessionHeader, [ContactsFilters]);
    const EventsPromise = cventSearch('Event', LoginResult.attributes.CventSessionHeader, [EventsFilter]);

    const [Contacts, Events] = await Promise.all([ContactsPromise, EventsPromise]);

    if (!Contacts || !Events) {
      logger('error', req.query.u as string, 'Either the user or event were not found', {Events, Contacts}.toString());
      return res.status(404).sendFile(errorPage);
    }

    const RegistrationFilters = new Array<SearchFilter>({
      filter: Contacts.Id[0],
      field: 'ContactId',
      operator: 'Equals'
    },{
      filter: Events.Id[0],
      field: 'EventId',
      operator: 'Equals'
    });

    const Registrations = await cventSearch('Registration', LoginResult.attributes.CventSessionHeader, RegistrationFilters);

    const RegistrationPromise = cventRetrieve('Registration', LoginResult.attributes.CventSessionHeader, Registrations.Id[0]);
    const ContactPromise = cventRetrieve('Contact', LoginResult.attributes.CventSessionHeader, Contacts.Id[0]);
    const EventPromise = cventRetrieve('Event', LoginResult.attributes.CventSessionHeader, Events.Id[0]);

    const [registrationInfo, contactInfo, eventInfo] = await Promise.all([RegistrationPromise, ContactPromise, EventPromise]);

    const SignNowAccessTokenResponse = await generateAccessToken(req.query.u as string);

    const document = await createDocument(req.query.t as string, SignNowAccessTokenResponse.data.access_token as string, req.query.u as string);

    if (document.errorCode) {
      return res.status(500).sendFile(errorPage);
    }

    const populateFieldsResponse = await populateFields(document.data.id as string, SignNowAccessTokenResponse.data.access_token as string, {contactInfo: contactInfo as Contact, registrationInfo: registrationInfo as Registration, eventInfo: eventInfo as Event});

    if (!populateFieldsResponse) {
      return res.status(500).sendFile(errorPage);
    }

    const inviteSignResponse = await inviteSign(document.data.id as string, SignNowAccessTokenResponse.data.access_token as string, req.query.u as string);

    if (!inviteSignResponse) {
      return res.status(500).sendFile(errorPage);
    }

    res.status(200).sendFile(successPage);
  } catch( err : any) {
    logger('error', req.query.u as string, 'something went wrong', err );
    res.status(500).sendFile(errorPage);
  }
});

export default events;