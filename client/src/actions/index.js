import axios from 'axios';
import { FETCH_DATA } from './types'

export const fetchData = (id, data, image) => async dispatch => {
  let formData = new FormData();
  let files = [];
  image.map((item, index) => {
    files.push(item.file);
    delete item.file;
    delete item.preview;
    item.index = index;
  })

  files.map(file => formData.append('file', file))

  formData.append('title', data.title)
  formData.append('content', data.content)
  formData.append('image', JSON.stringify(image))

  const res = await axios.post('/api/project/'+id, formData);
  dispatch({ type: FETCH_DATA, payload: res.data});
}
