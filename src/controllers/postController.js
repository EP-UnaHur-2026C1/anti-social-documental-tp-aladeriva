// src/controllers/postController.js

const { Post } = require('../db/schema/postSchema');
const { User } = require('../db/schema/userSchema');
const { Tag } = require('../db/schema/tagSchema');
const { Comment } = require('../db/schema/commentSchema');
const { PostImage } = require('../db/schema/postImageSchema');


// --- getAllPosts con filtro de comentarios ---
const getAllPosts = async (req, res) => {
    try {
        const monthsEnv = process.env.COMMENT_AGE_MONTHS;
        let monthsToSubtract = 6;

        if (monthsEnv !== undefined && !isNaN(parseInt(monthsEnv, 10))) {
            monthsToSubtract = parseInt(monthsEnv, 10);
        }

        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - monthsToSubtract);

        const posts = await Post.find()
            .populate('author', 'nickName') // El autor es string ahora
            .populate('tags', 'name')
            .populate({
                path: 'comments',
                match: { createdAt: { $gte: cutoffDate } },
                populate: { path: 'author', select: 'nickName' }
            })
            .populate('images', 'imageUrl');

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error en getAllPosts:", error);
        res.status(500).json({ message: 'Error al obtener los posts', error: error.message });
    }
};

// --- createPost ---
const createPost = async (req, res) => {
    try {
        const { description, nickName } = req.body;
        const author = await User.findOne({nickName});
        if (!author) return res.status(404).json({ message: 'Usuario autor no encontrado.' });

        const newPost = await Post.create({
            description,
            author: nickName // ahora es nickName
        });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el post', error: error.message });
    }
};

// --- addTagToPost ---
const addTagToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { name } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado.' });

        let tag = await Tag.findOne({ name: name.toLowerCase() });
        if (!tag) tag = await Tag.create({ name: name.toLowerCase() });

        await Post.findByIdAndUpdate(postId, { $addToSet: { tags: tag._id } });

        res.status(200).json(tag);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(400).json({ message: 'El postId no es válido.' });
        res.status(500).json({ message: 'Error al agregar el tag', error: error.message });
    }
};


const addComment = async (req, res) => {
  try {
    const { text, nickName } = req.body;
    const { postId } = req.params;

    if (!nickName) {
      return res.status(400).json({ message: 'El nickName del autor es obligatorio.' });
    }

    // Verificamos que el post exista
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado.'});
    }

    // Verificamos que el usuario exista 
    const user = await User.findOne({nickName: nickName});
    if (!user) {
      return res.status(404).json({ message: 'Usuario autor noo encontrado.'});
    }

    // Creamos el comentario con el _id del usuario (que es su nickName)
    const comment = new Comment({
      text,
      author: nickName, 
      post: postId
    });

    await comment.save();

    // Agregamos el comentario al post
    post.comments.push(comment._id);
    await post.save({ validateModifiedOnly: true });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error en addComment:', error);
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

// --- addImageToPost ---
const addImageToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { imageUrl } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post no encontrado.' });

        const newImage = await PostImage.create({ imageUrl, post: postId });
        await Post.findByIdAndUpdate(postId, { $push: { images: newImage._id } });

        res.status(201).json(newImage);
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(400).json({ message: 'El postId no es válido.' });
        res.status(500).json({ message: 'Error al agregar la imagen', error: error.message });
    }
};

// --- removeImageFromPost ---
const removeImageFromPost = async (req, res) => {
    try {
        const { postId, imageId } = req.params;

        const imageDeleted = await PostImage.findByIdAndDelete(imageId);
        if (!imageDeleted) return res.status(404).json({ message: 'Imagen no encontrada.' });

        await Post.findByIdAndUpdate(postId, { $pull: { images: imageId } });

        res.status(200).json({ message: 'Imagen eliminada correctamente.' });
    } catch (error) {
        if (error.kind === 'ObjectId') return res.status(400).json({ message: 'El ID del post o de la imagen no es válido.' });
        res.status(500).json({ message: 'Error al eliminar la imagen', error: error.message });
    }
};


// --- deletePost ---
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Post.deleteOne({ _id: id });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Post no encontrado" });
        res.status(200).json({ message: "Post eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el post", error: error.message });
    }
};

// --- updatePost ---
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        if (!description) return res.status(400).json({ message: "La descripción es obligatoria." });

        const updatedPost = await Post.findByIdAndUpdate(id, { description }, { new: true });
        if (!updatedPost) return res.status(404).json({ message: "Post no encontrado" });

        res.status(200).json({ message: "Descripción actualizada correctamente", post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el post", error: error.message });
    }
};

// --- getCommentsByPostId ---
const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate: { path: 'author', select: 'nickName' }
        });
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- getImagesByPostId ---
const getImagesByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate('images');
        if (!post) return res.status(404).json({ message: 'Post no encontrado' });
        res.json(post.images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPosts,
    createPost,
    addComment,
    deletePost,
    updatePost,
    addTagToPost,
    addImageToPost,
    removeImageFromPost,
    getImagesByPostId,
    getCommentsByPostId
};
