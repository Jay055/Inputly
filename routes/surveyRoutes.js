// Create and send mail 

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

// Mailer for mailing 
const Mailer = require('../services/Mailer');
// Get Survey Template 
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => { 
  app.post('/api/surveys', requireLogin, requireCredits, (req, res) => { 
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey ({
      title, 
      subject, 
      body, 
      recipients: recipients.split(',').map(email => ({email })),
            //  automatically avaliable through mongo
      _user: req.user.id,
      dateSent: Date.now()
    })

      //  Send Email 
      //Create new Mailer Class wit the survey and email template(body of the email, surveyTemplate.js)
      
      const mailer = new Mailer(survey, surveyTemplate(survey)); 


   });
};

