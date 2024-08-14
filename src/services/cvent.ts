import * as soap from 'soap';
import {Contact, LoginResult, SearchResult, SearchFilter, Event, Registration} from '../config/cvent'

import {cventWebServiceUrl, cventWebServiceAccountNumber,  cventWebServiceUserName, cventWebServicePassword} from '../utils/envs';
import { logger } from '../utils/logger';

export const cventLogin = () : Promise<LoginResult>  => {
  return new Promise((resolve, reject) => {
    const args = {
      AccountNumber: cventWebServiceAccountNumber,
      UserName: cventWebServiceUserName,
      Password: cventWebServicePassword
    }

    logger('info', 'Cvent', 'Cvent Login', JSON.stringify(args));

    soap.createClient(cventWebServiceUrl, (err, client) => {
      client.Login(args, (e: any, result: any) => {
        if (e) {
          reject(e)
        }
        resolve(result.LoginResult);
      })
    })
  });
}

export const cventSearch = (cventObject: string, cventSessionValue: string, cventFilters: SearchFilter[]) : Promise<SearchResult> => {
  return new Promise((resolve, reject) => {
    const clientOptions = {
      envelopeKey: 'soapenv'
    }
    const credentials = {
      'tns:CventSessionHeader': { //maybe this?
        'tns:CventSessionValue': cventSessionValue
      }
    }
    const args = {
      _xml: `<tns:Search>
                <tns:ObjectType>${cventObject}</tns:ObjectType>
                <s1:CvSearchObject SearchType="AndSearch">
                ${cventFilters.map(cventFilter => `<s1:Filter><s1:Field>${cventFilter.field}</s1:Field><s1:Operator>${cventFilter.operator}</s1:Operator><s1:Value>${cventFilter.filter}</s1:Value></s1:Filter>`)}
                </s1:CvSearchObject>
            </tns:Search>`
    }
    logger('search', 'cvent', 'Cvent is performing search', args._xml);
    soap.createClient(cventWebServiceUrl, clientOptions, (err, client) => {
      client.addSoapHeader(credentials); //think this is the problem?
      client.Search(args, (e: any, result: any) => {
        if (e) {
          reject(e);
        } else {
          resolve(result.SearchResult);
        }
      })
    })
  });
}

export const cventRetrieve = (cventObject: string, cventSessionValue: string, cventFilter: string) : Promise<Contact | Registration | Event> => {
  return new Promise((resolve, reject) => {
    const clientOptions = {
      envelopeKey: 'soapenv'
    }
    const credentials = {
      'tns:CventSessionHeader': {
        'tns:CventSessionValue': cventSessionValue
      }
    }
    const args = {
      _xml: `<tns:Retrieve>
                <tns:ObjectType>${cventObject}</tns:ObjectType>
                <s1:Ids>
                  <s1:Id>${cventFilter}</s1:Id>
                </s1:Ids>
            </tns:Retrieve>`
    }
    soap.createClient(cventWebServiceUrl, clientOptions, (err, client) => {
      client.addSoapHeader(credentials);
      client.Retrieve(args, (e: any, result: any) => {
        if (e) {
          reject(e);
        } else {
          resolve(result.RetrieveResult.CvObject[0]);
        }
      })
    })
  });
}

