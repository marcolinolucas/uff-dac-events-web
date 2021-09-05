import axios from "axios";
import globals from "../globals";

const eventApi = axios.create({ baseURL: globals().apiUrl });

async function getVolumes() {
  return eventApi.get('/volumes');
}

async function getVolume({ volumeId }) {
  return eventApi.get(`/volumes/${volumeId}`);
}

async function deleteVolume({ volume }) {
  return eventApi.delete(`/volumes/${volume.id}`);
}

async function createVolume({ volume }) {
  return eventApi.post('/volumes', volume);
}

async function updateVolume({ volume }) {
	return eventApi.put(`/volumes/${volume.id}`, volume)
}

async function getArticlesFromVolume({ volumeId }) {
  return eventApi.get(`/volumes/${volumeId}/articles`);
}

async function getArticle({ volumeId, articleId }) {
	return eventApi.get(`/volumes/${volumeId}/articles/${articleId}`)
}

async function deleteArticleFromVolume({ volumeId, article }) {
	return eventApi.delete(`/volumes/${volumeId}/articles/${article.id}`)
}

async function createArticle({ volumeId, article }) {
  return eventApi.post(`/volumes/${volumeId}/articles`, article);
}

async function updateArticle({ volumeId, article }) {
  return eventApi.put(`/volumes/${volumeId}/articles/${article.id}`, article);
}

async function getAuthorsFromArticle({ article }) {
  return eventApi.get(`/articles/${article.id}/authors`);
}

async function deleteAuthorFromArticle({ articleId, author }) {
	return eventApi.delete(`/articles/${articleId}/authors/${author.id}`)
}

async function createAuthor({ articleId, author }) {
  return eventApi.post(`/articles/${articleId}/authors`, author);
}

async function getAuthor({ articleId, authorId }) {
  return eventApi.get(`/articles/${articleId}/authors/${authorId}`);
}

async function updateAuthor({ articleId, author }) {
  return eventApi.put(`/articles/${articleId}/authors/${author.id}`, author);
}

export default {
  getVolumes,
	getVolume,
  deleteVolume,
	createVolume,
	updateVolume,
	getArticlesFromVolume,
	deleteArticleFromVolume,
	createArticle,
	getArticle,
	updateArticle,
	getAuthorsFromArticle,
	deleteAuthorFromArticle,
	createAuthor,
	getAuthor,
	updateAuthor,
};
