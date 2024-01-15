// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path'); // Import the path module
// const app = express();
// const port = 3000;
// app.use(express.json());

// app.use(cors());
// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with your React app's origin
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// const atlasConnectionUri = 'mongodb+srv://prathappoojari607:3WrebKuwJ1OIS5KU@cluster0.qhn2yup.mongodb.net/spk?retryWrites=true&w=majority';
// mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Prathu DB connected. Be happy!!');
//   })
//   .catch(error => {
//     console.error('Error connecting to MongoDB Atlas:', error);
//   });

// const formInputSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     required: true,
//     enum: ['text', 'email', 'phone'], // Add more types as needed
//   },
//   title: String,
//   placeholder: String,
// });

// const formSchema = new mongoose.Schema({
//   title: String,
//   inputs: [formInputSchema],
// });

// const Form = mongoose.model('Form', formSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// // Set EJS as the view engine
// app.set('view engine', 'ejs');

// // Set the views directory
// app.set('views', path.join(__dirname, 'views'));


// app.get("/form/create", async (req, res) => {
//   try {
//     console.log("Inside get function");
//     const data = await Form.find(); // Use the Form model instead of UserModel
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// // POST route to handle form creation
// app.post('/forms', async (req, res) => {
//   try {
//     console.log('Received POST request for form creation');
//     console.log('Request body:', req.body);

//     const newForm = new Form({
//       title: req.body.title,
//       inputs: Array.isArray(req.body.inputs)
//         ? req.body.inputs.map(input => ({
//             type: input.type,
//             title: input.title,
//             placeholder: input.placeholder,
//           }))
//         : [],
//     });

//     console.log('New form data:', newForm);

//     await newForm.save();

//     console.log('Form saved successfully');

//     res.status(201).json({ message: 'Form created successfully' });
//   } catch (error) {
//     console.error('Error creating form:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.get('/form/:id', async (req, res) => {
//   try {
//     const id = req.params.id;

//     console.log('Received id:', id);
//     console.log('Full request URL:', req.originalUrl);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       console.error('Invalid id format');
//       return res.status(400).json({ error: 'Invalid id' });
//     }

//     const form = await Form.findById(id);

//     if (!form) {
//       console.error('Form not found');
//       return res.status(404).json({ error: 'Form not found' });
//     }

//     res.json(form);
//   } catch (error) {
//     console.error('Error fetching form for view:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// // GET route to fetch all forms
// app.get('/forms', async (req, res) => {
//   try {
//     const forms = await Form.find();
//     res.json(forms);
//   } catch (error) {
//     console.error('Error fetching all forms:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.get('/form/:id/edit', async (req, res) => {
//   try {
//     const form = await Form.findById(req.params.id);
//     res.render('create', { form });
//   } catch (error) {
//     console.error('Error fetching form for edit:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Import necessary modules and packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Create an Express app
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Connect to MongoDB Atlas
const atlasConnectionUri = 'mongodb+srv://prathappoojari607:3WrebKuwJ1OIS5KU@cluster0.qhn2yup.mongodb.net/spk?retryWrites=true&w=majority';;
mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Define Mongoose schema for form input
const formInputSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'phone'], // Add more types as needed
  },
  title: String,
  placeholder: String,
});

// Define Mongoose schema for the form
const formSchema = new mongoose.Schema({
  title: String,
  inputs: [formInputSchema],
});

// Create a Mongoose model based on the form schema
const Form = mongoose.model('Form', formSchema);

// Middleware to parse JSON in the request body
app.use(express.json());

// POST route to handle form creation
app.post('/forms', async (req, res) => {
  try {
    console.log('Received POST request for form creation');
    console.log('Request body:', req.body);

    const newForm = new Form({
      title: req.body.title,
      inputs: Array.isArray(req.body.inputs)
        ? req.body.inputs.map(input => ({
            type: input.type,
            title: input.title,
            placeholder: input.placeholder,
          }))
        : [],
    });

    console.log('New form data:', newForm);

    await newForm.save();

    console.log('Form saved successfully');

    res.status(201).json({ message: 'Form created successfully' });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to fetch all forms
app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error('Error fetching all forms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

