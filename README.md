# Entitlements

Insights Entitlements is a service that determines which applications or groups of applications that a user is entitled to based on the user's account's subscriptions.

Given the rh-identity

## Getting Started

### Prerequisites

* node.js 10
* an Enterprise Services cert with access to the dev subscription endpoint /search/criteria (See Getting a Cert)

### Running the application locally

1. ```npm install```
2. ```SERVICE_SSL_CERT='path/to/cert' SERVICE_SSL_KEY='path/to/key' npm run start```
3. open http://localhost:8080/entitlements/v1/services/

## Getting an Enterprise Cert

To run the Entitlements API locally you will need an Enterprise Services cert with access to the dev subscription endpoint /search/criteria.

* You can request a personal cert by following this mojo doc https://mojo.redhat.com/docs/DOC-1144091. 
* You should be emailed a link that will allow you to import your pk12 cert into Firefox.

After importing the pk12 cert into Firefox, you can export it into a separate .crt and .key file that can be used to
query subscription services. To export your .crt and .key file:

* Export your pk12 cert to your local box:
    * Go to Firefox preferences
    * Select Privacy & Security
    * Select View Certificates
    * Select your pk12 cert
    * Select Backup...
    * Save as a pk12 file  
* From here you can export your crt and key like so:
    openssl pkcs12 -in your-p12-cert.p12 -out your-key.key -nocerts -nodes
    openssl pkcs12 -in your-p12-cert.p12 -out your-cert-sans-key.crt -clcerts -nokeys

