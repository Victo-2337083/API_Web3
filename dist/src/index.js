"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jet_logger_1 = __importDefault(require("jet-logger"));
const ENV_1 = __importDefault(require("@src/common/constants/ENV"));
const server_1 = __importDefault(require("./server"));
const mongoose_1 = require("mongoose");
/******************************************************************************
                                Constants
******************************************************************************/
const SERVER_START_MSG = 'Express server started on port: ' + ENV_1.default.Port.toString();
/******************************************************************************
                                  Run
******************************************************************************/
(0, mongoose_1.connect)(ENV_1.default.Mongodb).then(() => server_1.default.listen(ENV_1.default.Port, () => jet_logger_1.default.info(SERVER_START_MSG)));
