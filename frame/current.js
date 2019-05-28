'use strict';

const Struct = require('struct');
const Common = require('./common.js');

/**
 */
const CurrentChSetting = Struct()
    .word16Ube('triggerValue1')         //0~65535mA
    .word16Ube('triggerValue2')         //0~65535mA
    .chars('reservedField', 1) //1
    .word8Ube('calibrationPercentage'); //0~255%

const RequestCurrentSetConfigurationData = Struct()
    .chars('currentReportType', 1)         //Not Used
    .word16Ube('periodTime') //2           //Not Used
    .struct('ch1Setting', CurrentChSetting)  //CH1
    .struct('ch2Setting', CurrentChSetting)  //CH2
    .chars('reservedField', 2); //1

const ResponseCurrentSetConfigurationData = Struct()
    .chars('result', 1, 'hex')  //1 (01h : success, etc : error)
    .chars('reservedField', 9); //10

const RequestCurrentGetConfigurationData = Struct()
    .chars('reservedField', 10);         //Not Used

const ResponseCurrentGetConfigurationData = Struct()
    .chars('currentReportType', 1)         //Not Used
    .word16Ube('periodTime') //2           //Not Used
    .struct('ch1Setting', CurrentChSetting)  //CH1
    .struct('ch2Setting', CurrentChSetting)  //CH2
    .chars('reservedField', 2); //1

const RequestCurrentGetStatusData = Struct()
    .chars('reservedField', 10);         //Not Used

const ResponseCurrentGetStatusData = Struct()
    .word16Ube('ch1Current')         //0~65535mA
    .word8Ube('ch1Status')         //step 1, 2, 3
    .word16Ube('ch2Current')         //0~65535mA
    .word8Ube('ch2Status');         //step 1, 2, 3


// for Current Current ----------------------------------------- //
const RequestCurrentSetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestCurrentSetConfigurationData)
    .struct('tail', Common.Tail);

const ResponseCurrentSetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseCurrentSetConfigurationData)
    .struct('tail', Common.Tail);

const RequestCurrentGetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestCurrentGetConfigurationData)
    .struct('tail', Common.Tail);

const ResponseCurrentGetConfiguration = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseCurrentGetConfigurationData)
    .struct('tail', Common.Tail);

const RequestCurrentGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', RequestCurrentGetStatusData)
    .struct('tail', Common.Tail);

const ResponseCurrentGetStatus = Struct()
    .struct('header', Common.Header)
    .struct('data', ResponseCurrentGetStatusData)
    .struct('tail', Common.Tail);

module.exports = {
    RequestCurrentSetConfigurationData,
    ResponseCurrentSetConfigurationData,
    RequestCurrentGetConfigurationData,
    ResponseCurrentGetConfigurationData,
    RequestCurrentGetStatusData,
    ResponseCurrentGetStatusData,
    RequestCurrentSetConfiguration,
    ResponseCurrentSetConfiguration,
    RequestCurrentGetConfiguration,
    ResponseCurrentGetConfiguration,
    RequestCurrentGetStatus,
    ResponseCurrentGetStatus,
}