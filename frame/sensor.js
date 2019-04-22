'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**
 */
//@TODO Sensor 라는 단어가 들어가도록 수정필요


const SensorReportType = Struct()
    .word16Ube('triggerValue1')         //0~65535mA
    .word16Ube('triggerValue2')         //0~65535mA
    .chars('reservedField', 1) //1
    .word8Ube('calibrationPercentage'); //0~255%

const RequestSensorSetConfigurationData = Struct()
    .chars('currentReportType', 1)         //Not Used
    .word16Ube('periodTime') //2           //Not Used
    .struct('ch1Setting', SensorReportType)  //CH1
    .struct('ch2Setting', SensorReportType)  //CH2
    .chars('reservedField', 2); //1

const ResponseSensorSetConfigurationData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

const RequestSensorGetConfigurationData = Struct()
    .chars('reservedField', 10);         //Not Used

const ResponseSensorGetConfigurationData = Struct()
    .chars('currentReportType', 1)         //Not Used
    .word16Ube('periodTime') //2           //Not Used
    .struct('ch1Setting', SensorReportType)  //CH1
    .struct('ch2Setting', SensorReportType)  //CH2
    .chars('reservedField', 2); //1

const RequestSensorGetStatusData = Struct()
    .chars('reservedField', 10);         //Not Used

const ResponseSensorGetStatusData = Struct()
    .word16Ube('ch1Current')         //0~65535mA
    .word8Ube('ch1Status')         //step 1, 2, 3
    .word16Ube('ch2Current')         //0~65535mA
    .word8Ube('ch2Status');         //step 1, 2, 3


// for Current Sensor ----------------------------------------- //
const RequestSensorSetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSensorSetConfigurationData)
    .struct('tail', Common.Tail);

const ResponseSensorSetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSensorSetConfigurationData)
    .struct('tail', Common.Tail);

const RequestSensorGetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSensorGetConfigurationData)
    .struct('tail', Common.Tail);

const ResponseSensorGetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSensorGetConfigurationData)
    .struct('tail', Common.Tail);

const RequestSensorGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestSensorGetStatusData)
    .struct('tail', Common.Tail);

const ResponseSensorGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseSensorGetStatusData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestSensorSetConfigurationData,
    ResponseSensorSetConfigurationData,
    RequestSensorGetConfigurationData,
    ResponseSensorGetConfigurationData,
    RequestSensorGetStatusData,
    ResponseSensorGetStatusData,
    RequestSensorSetConfiguration,
    ResponseSensorSetConfiguration,
    RequestSensorGetConfiguration,
    ResponseSensorGetConfiguration,
    RequestSensorGetStatus,
    ResponseSensorGetStatus,
}