const service = require("./posts.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function postExists(req, res, next) {
  const { postId } = req.params;

  const post = await service.read(postId);
  if (post) {
    res.locals.post = post;
    return next();
  }
  return next({ status: 404, message: `Post cannot be found.` });
}

async function create(req, res) {
  // your solution here
  // Fetch the information for the new post
  const newPost = ({
    post_title,
    post_body
  } = req.body.data);
  // Call the create method from posts.service
  const createdPost = await service.create(newPost);
  // Return with the result along with status 201
  res.status(201).json({ data: createdPost });
}

async function update(req, res) {
  // your solution here
  const postUpdate = ({
    post_title,
    post_id,
    post_body
  } = req.body.data);
  const updatedPost = await service.update(postUpdate);
  res.json({ data: updatedPost });
}

async function destroy(req, res, next) {
  // your solution here
  const postId = res.locals.post.post_id;
  service
    .delete(postId)
    .then( () => res.sendStatus(204) )
    .catch(next);
}

module.exports = {
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(postExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(postExists), asyncErrorBoundary(destroy)],
};
