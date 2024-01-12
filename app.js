const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 3000;

// MongoDB connection
const atlasConnectionUri = 'mongodb+srv://prathappoojari607:3WrebKuwJ1OIS5KU@cluster0.qhn2yup.mongodb.net/Spp?retryWrites=true&w=majority';

mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Prathu DB connected. Be happy!!');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });


const formSchema = new mongoose.Schema({
  title: String,
  inputs: [
    {
      type: String,
      title: String,
      placeholder: String,
    },
  ],
});

const Form = mongoose.model('Form', formSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const forms = await Form.find();
  res.render('index', { forms });
});

app.get('/form/create', (req, res) => {
  res.render('create');
});

app.post('/form/create', async (req, res) => {
  const newForm = new Form({
    title: req.body.title,
    inputs: req.body.inputs,
  });

  await newForm.save();
  res.redirect('/');
});

app.get('/form/:id/edit', async (req, res) => {
  const form = await Form.findById(req.params.id);
  res.render('create', { form });
});

app.get('/form/:id', async (req, res) => {
  const form = await Form.findById(req.params.id);
  res.render('view', { form });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});