const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const data = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(data)
  return response.json(data)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params
  const data = { id, title, url, techs }

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id
  })

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'ID not found!' })
  }
  data.likes = repositories[repositoryIndex].likes
  repositories[repositoryIndex] = { ...data }
  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id
  })

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'ID not found!' })
  }

  repositories.splice(repositoryIndex, 1)

  return res.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => {
    return repository.id === id
  })

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'ID not found!' })
  }

  const newLikes = repositories[repositoryIndex].likes + 1

  repositories[repositoryIndex].likes = newLikes
  
  return response.json(repositories[repositoryIndex])
});

module.exports = app;