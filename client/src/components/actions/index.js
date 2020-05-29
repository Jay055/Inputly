import axios from 'axios';
import { FETCH_USER } from './types'



export const fetchUser = () => async dispatch => { 
  const res = await axios.get('/api/current_user')
       dispatch({ 
         type: FETCH_USER,
         payload: res.data 
        })}



// Get and post our token from Stripe 
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data });

}