const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the path module
const app = express();
const port = 3000;

app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app's origin
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const atlasConnectionUri = 'mongodb+srv://prathappoojari607:3WrebKuwJ1OIS5KU@cluster0.qhn2yup.mongodb.net/spk?retryWrites=true&w=majority';
mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Prathu DB connected. Be happy!!');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

const formInputSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'password', 'number', 'date'], // Add more types as needed
  },
  title: String,
  placeholder: String,
});

const formSchema = new mongoose.Schema({
  title: String,
  inputs: [formInputSchema],
});

const Form = mongoose.model('Form', formSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));


app.get("/form/create", async (req, res) => {
  try {
    console.log("Inside get function");
    const data = await Form.find(); // Use the Form model instead of UserModel
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// POST route to handle form creation
app.post('/form', async (req, res) => {
  try {
    console.log('Received POST request for form creation');

    const newForm = new Form({
      title: req.body.title,
      inputs: Array.isArray(req.body.inputs)
        ? req.body.inputs.map(input => ({
            type: input.type,
            title: input.title,
            placeholder: input.placeholder,
          }))
        : [], // Provide a default value (an empty array) if req.body.inputs is not an array
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

app.get('/form/:id/edit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.render('create', { form });
  } catch (error) {
    console.error('Error fetching form for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/form/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Error fetching form for view:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
