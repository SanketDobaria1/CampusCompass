import {Router} from 'express';
import {feedbackData} from '../data/index.js';
import validation from '../validate.js';
import eventdata from '../../data/events.js'
import locationsdata from '../../data/locations.js'
import departmentsdata from '../../data/departments.js'
const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {

      if(req.session.userRole=='admin'){
        res.render("pages/feedback", {admin : true});
      }
      else{
        res.render("pages/feedback", {id : req.session.userID});
      }
    } catch (e) {
      res.status(404).send(e);
    }
})
  .post(async (req, res) => {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try{
      data.reported_object = validation.checkId(data.reported_object, 'event_id')
      data.desc = validation.checkString(data.desc, 'Description')
    } catch (e){
      return res.status(400).json({error: e})
    }

    try {
        const {reported_object, desc} = data;
        const newFeedback = await feedbackData.create(reported_object, desc);
        res.json(newFeedback);
      } catch (e) {
        res.status(404).json({error: e});
      }
  })

export default router;
