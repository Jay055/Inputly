// Make an AJAX request 

function fetchAlbums() { 
  fetch('http')
  .then(res => res.json())
  .then(json => console.log(json));
}




async function fetchAlbums() {
  const res = awiat fetch('http')
  const json = await readSync.json
}


const fetchAlbums () = async => {
  const res = awiat fetch('http')
  const json = await readSync.json
}




//<----------  CLASS BASED TO FUNCTIONAL BASED -----> 
// const App = () => {
class App extends Component {
  render() {
  return (
    <div></div>

  );
};
}

// converting from app to class based 

const App = () => { 
  return (
    <div></div>
  )
}



//<--------- REFACTOR ASYNC AWAIT ------------------>

export const fetchUser = () => {
  return function(dispatch) {
    axios
      .get('/api/current_user')
      .then(res => dispatch({ type: FETCH_USER, payload: res }));
  };
};




export const fetchUser = () => async dispatch => { 
      const res = await axios.get('/api/current_user')
           dispatch({ type: FETCH_USER, payload: res})}