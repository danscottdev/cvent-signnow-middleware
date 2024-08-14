# Cvent + SignNow API Integration Middleware
## Automated Customer Onboarding Process

Custom app developed to serve as an automated middleware integration between Cvent (https://app.cvent.com) and SignNow (https://app.signnow.com).

This app represents an automated solution that generates, pre-fills, and sends e-document contracts to students who enroll in courses/events via the Company's Cvent event registration platform. When a user successfully registers and submits payment for an event, Cvent is configured to send a webhook to this app's custom API intake endpoint. This app will then ping the Company's SignNow account instance in order to generate the required documents/contracts and then pre-fill as many fields as possible based on user info & event info gathered during the initial registration process. This app will then ping SignNow to trigger automatic sending of the documents to the student for signature.

Currently this process is initiated by Cvent generating a custom link for the user upon registration, with the link pointing to wherever this app is hosted (currently Heroku). Potential future project to integrate more seamlessly using Cvent custom components/webhooks.

Updated May 2024 to use Cvent's newer REST API rather than their legacy SOAP API, which is being deprecated.

Important External Documentation:
- https://developer-portal.cvent.com/documentation
- https://docs.signnow.com/docs/signnow/get-started

## Prerequisites
1. Copy the `env.example` file and rename to `.env`
2. Set appropriate values in `.env`. This requires various API keys for both platforms, as well as company-specific platform URLs
3. Install dependencies, `npm install`
4. Run in development mode: `npm run dev`
5. If deploying to heroku (current company implementation) use herkou CLI with company credentials
