'use strict';
const config = require('config');
const Msgs = config.get('Msgs');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
    postData : function(req, res){
        if (req.body && req.body.length) {
            let msg = '';
            let buf = req.body;

            let x = JSON.stringify(buf);
            console.log('debug', x + ' - ' + buf.length);
            let strBuf = '';
            let counter = 0;
            let Ver = 0;
            let OC = 0;
            let OC0 = 0;
            let OC1 = 0;
            let OC2 = 0;
            let BinBuf = 0;

            for (let i = 0; i < buf.length; ++i) {
                if (0 === i) {  // get Version
                    BinBuf = buf[i].toString(2);
                    Ver = (buf[i] & 0xf0) >>> 4;
                    OC0 = (buf[i] & 0x0f) << 1;
                }
                else if (1 === i) {  // get OC LSB
                    BinBuf = BinBuf + ' - ' + buf[i].toString(2);
                    OC1 = (buf[i] & 0xf0);
                    OC2 = (OC1 >>> 4) >>> 3;
                    OC = OC0 | OC2;
                }
            }
            console.log('debug', sprintf(Msgs.VerDsp, Ver.toString(2)));
            console.log('debug', sprintf(Msgs.OCDsp, OC.toString(2)));

            msg = sprintf(Msgs.WeGotIt, Ver, OC);
            res.json(msg);
        }
        else {
            let msg = sprintf(Msgs.WeGotIt, config.OMA_DM.Ver, config.OMA_DM.OC);
            res.json(msg);
        }
    }
};