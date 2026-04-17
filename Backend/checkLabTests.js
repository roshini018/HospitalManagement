const mongoose = require('mongoose');
require('dotenv').config();
const LabTest = require('./models/LabTest.model');

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chospital").then(async () => {
    const tests = await LabTest.find().lean();
    for (const test of tests) {
        if (typeof test.testName === 'object' || typeof test.status === 'object' || typeof test.date === 'object') {
            console.log("FOUND WEIRD TEST:", test);
        }
    }
    console.log("TESTS CHECKED:", tests.length);
    process.exit(0);
});
