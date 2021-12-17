"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schemaNames_1 = require("../Services/schemaNames");
const workingHoursSchema = new mongoose_1.Schema({
    monday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    tuesday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    wednesday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    thursday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    friday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    saturday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
    sunday: {
        type: {
            working: {
                type: Boolean,
            },
            from: {
                time: {
                    type: Number,
                    // Time of day, like 1AM, 12PM, 10PM
                    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                division: {
                    type: Number,
                    // 0 = AM, 1 = PM
                    enum: [0, 1],
                },
            },
            till: {
                type: {
                    time: {
                        type: Number,
                        // Time of day, like 1AM, 12PM, 10PM
                        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                    division: {
                        type: Number,
                        // 0 = AM, 1 = PM
                        enum: [0, 1],
                    },
                },
            },
        },
        required: true,
    },
});
const workingHourModel = (0, mongoose_1.model)(schemaNames_1.workingHour, workingHoursSchema);
exports.default = workingHourModel;
