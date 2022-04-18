import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:5000'})

// This happens before everything else to check if user is logged in
API.interceptors.request.use((req) =>{
	if(localStorage.getItem('profile')){
		req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
	}
	return req;
})

export const fetchPosts = () => API.get('/posts');
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=test${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`)
export const likePost = (id) => API.patch(`/posts/${id}/likePost`)

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);