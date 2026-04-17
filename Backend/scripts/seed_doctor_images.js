const mongoose = require('mongoose');
const Doctor = require('./models/Doctor.model');
const User = require('./models/User.model');

const DOCTOR_IMAGES = {
  "Krish": "/doctors/krish.png",
  "tanush": "/doctors/tanush.png",
  "Rao": "/doctors/rao.png",
  "Pranay": "/doctors/pranay.png",
  "Aadhya": "/doctors/aadhya.png"
};

mongoose.connect('mongodb://localhost:27017/cHospital')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const doctors = await Doctor.find().populate('user');
    
    for (const doc of doctors) {
      if (!doc.user) continue;
      
      // Match by name
      for (const [name, imageUrl] of Object.entries(DOCTOR_IMAGES)) {
        if (doc.user.name.toLowerCase().includes(name.toLowerCase())) {
          doc.image = imageUrl;
          await doc.save();
          console.log(`Updated image for ${doc.user.name}: ${imageUrl}`);
        }
      }
    }
    
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding images:', err);
    process.exit(1);
  });
