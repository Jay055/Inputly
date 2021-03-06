// Create and send mail 
// import lodash helper 
const _ = require('lodash');

const {Path} = require('path-parser');
  // integrated with node 
const { URL } = require('url');

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');


// Mailer for mailing 
const Mailer = require('../services/Mailer');
// Get Survey Template 
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => { 
//Get surveys from a particular user 
app.get('/api/surveys', requireLogin, async (req, res)=> {
  const surveys = await Survey.find({ _user: req.user.id})
    .select({ recipients: false }) // Do not load entire recipents to avoid lots of memory fetching
  res.send(surveys);
})

    // After voting thanks 
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('We appreciate your feedback. Thank you.');
  });



    // Webhooks, extract data from URL 
  app.post('/api/surveys/webhooks', (req, res)=>{
    const p = new Path('/api/surveys/:surveyId/:choice');
    const events = req.body.map(event => {
 
    const pathname =  new URL(event.url).pathname; 
   
    const match = p.test(pathname);
    if(match) {
      return { email: event.email, surveyId: match.surveyId, choice: match.choice}; 
    }
    });
    // Remove undefined elements with Lodash 
    const compactEvents = _.compact(events);
      //Save unique records with lodash 
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
    uniqueEvents.forEach(({ surveyId, email, choice }) => {
          // update database with mongoDB queries   
      Survey.updateOne(
              {
                _id: surveyId,
                recipients: {
                  $elemMatch: { email: email, responded: false }
                }
              },
              {
                $inc: { [choice]: 1 },
                $set: { 'recipients.$.responded': true },
                lastResponded: new Date()
              }
            ).exec();
          })
          
          console.log(events)
        res.send({});
      });

  // //

  // // 

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => { 
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
        // Deduct credit after sending
    try{
     await mailer.send(); 
     await survey.save(); 
     req.user.credits -= .5;
     const user = await req.user.save();

     res.send(user);
      } catch(err) {
        res.status(422).send(err)
      }


   });
};

