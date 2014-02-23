##Mgrid

Mobile Testing grid (mgrid) helps to execute mobile automation tests in actual devices simultaneously. This tool currently helps to execute tests written in tools like frank, calabash, appium ( cucumber format tests) and aggregate the test results in the web application. Also support execution of tests in different network which helps to run the test in different mobile networks ( in different countries ) by controlling and monitor the tests from one location.

### Features

* Execution of mobile tests in simulator and actual devices
* Test reporting.
* Realtime communication to different devices

### Install
 
###### Requirements:
 
1. Node.js and NPM
1. Sqlite3


 ###### Steps
 
 1. Clone this repo: `git clone https://github.com/jijeshmohan/mgrid.git`
 2. Go to the directory : `cd mgrid`
 3. Run npm install `npm install`
 4. Run db migartion `grunt migrate`
 5. Run server `npm start` 
 6. Open `localhost:3000` in browser
 
 
 To run tests you need to run [mgrid-client](https://github.com/jijeshmohan/mgrid-client).

 [Demo](http://mgrid-mgrid.rhcloud.com/)