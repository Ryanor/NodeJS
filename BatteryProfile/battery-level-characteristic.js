/**
* Class BatteryLevelCharacteristic extends bleno.Characteristic class
* BatteryLevelCharacteristic include operating system calls to get actual battery level
* Uses SIG defined UUID for the characteristic
*
* @author gwu
* @version 1.0
*/

// import utility library to build classes
var util = require('util');

// import os library to test operating system
var os = require('os');

// uses child process library to open a command shell and execute system commands
var exec = require('child_process').exec;

// import bleno module for bluettoth low energy communication
var bleno = require('bleno');

// predefine the included descriptors of the service
var Descriptor = bleno.Descriptor;

// create the Characteristic class which the battery level characteristic inherits from
var Characteristic = bleno.Characteristic;

/**
* Constructor for BatteryLevelCharacteristic calls constructor from the parent class Characteristic
* Defines the UUID for the characteristic
* Includes descriptors used
*/ 
var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    value: null,
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: '2901',
        value: 'Battery level between 0 and 100 percent'
      })
    ]
  });
};

// define inhertance
util.inherits(BatteryLevelCharacteristic, Characteristic);

/**
* Override prototype method onReadRequest from class bleno.Characteristic 
* This method is called if the master initiates an onReadRequest on the battery level characteristic.
* We check the os if the application runs on linux, and if so, return the actual battery level
*/
BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // check operating system to be linux
  if (os.platform() === 'linux') {
    // execute child process and get battery level from stdout
    //exec("acpi battery | head -n 1 | cut -d ',' -f2", function (error, stdout, stderr) {
    exec("acpi battery | head -n 1", function (error, stdout, stderr) {
      // read data from console
      // expected output ===>>  98%
      console.log("Get battery level");
      var data = stdout.toString().trim();
      // parse data to Integer
      var percent = data.split(',')[1];
      console.log("Actual battery level: " + percent);
      var level = parseInt(percent);
      console.log(level);
      // send data to master
      callback(this.RESULT_SUCCESS, new Buffer([level]));
    });
  } else {
    // create random value
    var rand = parseInt(Math.floor(Math.random() * 100) + 1);
    console.log("Randomized battery level: " + rand);
    callback(this.RESULT_SUCCESS, new Buffer([rand]));
  }
};

// export class as BatteryLevelCharacteristic
module.exports = BatteryLevelCharacteristic;