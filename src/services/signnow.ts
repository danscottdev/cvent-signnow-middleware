import axios from 'axios';
import FormData from 'form-data';
import { signnowRestApiUrl, signnowBasicAuthorizationToken, signnowUsername, signnowPassword, signnowInviteEmailBody, signnowInviteEmailSubject } from '../utils/envs';
import { AccessTokenResponse, CreateDocumentResponse } from '../config/signnow';
import { logger } from '../utils/logger';
import { UPSTREAM_ERROR } from '../utils/constants';
import { Contact, Registration, Event } from '../config/cvent';
import { formatSmartFields } from '../utils/supportedFields';

export const generateAccessToken = async (user: string): Promise<AccessTokenResponse> => {
  const endpoint = '/oauth2/token';
  const form = new FormData()
  form.append('username', signnowUsername);
  form.append('password', signnowPassword);
  form.append('grant_type', 'password');
  form.append('expiration_time', 300);
  const formHeaders = form.getHeaders();

  try {
    const { data } = await axios({
      method: 'post',
      url: signnowRestApiUrl + endpoint,
      data: form,
      headers: {
        'Authorization': `Basic ${signnowBasicAuthorizationToken}`,
        ...formHeaders
      }
    });
    return { data };
  } catch (err : any) {
    logger('error', user, 'It was not possible to authenticate with Signnow', err.stack);
    return {
      data: {},
      errorCode: UPSTREAM_ERROR.CODE,
      errorMessage: UPSTREAM_ERROR.MESSAGE
    };
  }
}

export const createDocument = async (templateId: string, accessToken: string, user: string): Promise<CreateDocumentResponse> => {
  const endpoint = `/template/${templateId}/copy`;

  // logger('info', user, 'Creating document...', endpoint);

  try {
    const { data } = await axios({
      method: 'post',
      url: signnowRestApiUrl + endpoint,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    // logger('info', user, 'Document created. DATA:', data);
    return { data };
  } catch (err : any) {
    logger('error', user, 'It was not able to create a document', err.stack);
    return {
      data: {},
      errorCode: UPSTREAM_ERROR.CODE,
      errorMessage: UPSTREAM_ERROR.MESSAGE
    }
  }
}

export const populateFields = async (documentId: string, accessToken: string, { contactInfo, registrationInfo, eventInfo }: { contactInfo: Contact, registrationInfo: Registration, eventInfo: Event }): Promise<boolean> => {
  const endpoint = `/document/${documentId}/integration/object/smartfields`;
  // logger('info', contactInfo.attributes.EmailAddress, 'Populating fields...', endpoint);
  const smartFields = formatSmartFields(contactInfo, registrationInfo, eventInfo);

  // logger('info', contactInfo.attributes.EmailAddress, 'SmartFields:', JSON.stringify(smartFields));

  try {
    const { data } = await axios({
      method: 'post',
      data: smartFields,
      url: signnowRestApiUrl + endpoint,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return true;
  } catch (err : any) {
    logger('error', contactInfo.attributes.EmailAddress, 'There was a problem when trying to populate fields', err.stack);
    return false;
  }
}

export const inviteSign = async (documentId: string, accessToken: string, email: string): Promise<boolean> => {
  const endpoint = `/document/${documentId}/invite`;

  try {
    const { data } = await axios({
      method: 'post',
      data: {
        to: [
          {
            email,
            role_id: '',
            role: 'Signer 1',
            order: 1
          }
        ],
        from: signnowUsername,
        cc: [],
        subject: signnowInviteEmailSubject,
        message: signnowInviteEmailBody
      },
      url: signnowRestApiUrl + endpoint,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return true;
  } catch (err : any) {
    logger('error', email, 'There was a problem trying to send the invite email', err.stack);
    return false;
  }
}