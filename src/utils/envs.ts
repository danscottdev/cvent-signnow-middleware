import { resolve } from "path"

import { config } from "dotenv"

config({ path: resolve(__dirname, "../../.env") });

export const port: number = parseInt(process.env.PORT as string, 10) || 3000;
export const cventWebServiceAccountNumber: string = process.env.CVENT_WEB_SERVICE_ACCOUNT_NUMBER as string;
export const cventWebServiceUserName: string = process.env.CVENT_WEB_SERVICE_USER_NAME as string;
export const cventWebServicePassword: string = process.env.CVENT_WEB_SERVICE_PASSWORD as string;
export const cventWebServiceUrl: string = process.env.CVENT_WEB_SERVICE_URL as string;
export const signnowRestApiUrl: string = process.env.SIGNNOW_REST_API_URL as string;
export const signnowBasicAuthorizationToken: string = process.env.SIGNNOW_BASIC_AUTHORIZATION_TOKEN as string;
export const signnowUsername: string = process.env.SIGNNOW_USERNAME as string;
export const signnowPassword: string = process.env.SIGNNOW_PASSWORD as string;
export const signnowInviteEmailSubject: string = process.env.SIGNNOW_INVITE_EMAIL_SUBJECT as string;
export const signnowInviteEmailBody: string = process.env.SIGNNOW_INVITE_EMAIL_BODY as string;