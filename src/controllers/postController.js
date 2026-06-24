
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
            .populate('user', 'nickName')
            .populate('tags', 'name')
            .populate('comments.user', 'nickName');

        const filteredPosts = posts.map(post => {
            const postObj = post.toObject();

            postObj.comments = postObj.comments.filter(comment => {
                return (
                    comment.visible === true &&
                    new Date(comment.createdAt) >= cutoffDate
                );
            });

            return postObj;
        });

        return res.status(200).json(filteredPosts);

    } catch (error) {
        console.error('Error en getAllPosts:', error);

        return res.status(500).json({
            message: 'Error al obtener los posts',
            error: error.message
        });
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
    const { postId } = req.params;
    const { text, nickName } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }

    const user = await User.findOne({ nickName });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    const comment = {
      text,
      user: user._id
    };

    post.comments.push(comment);

    await post.save();

    res.status(201).json(
      post.comments[post.comments.length - 1]
    );

  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar comentario',
      error: error.message
    });
  }
};

// --- addImageToPost ---
const addImageToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { imageUrl } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post no encontrado.'
            });
        }

        post.images.push({
            url: imageUrl
        });

        await post.save();

        res.status(201).json(
            post.images[post.images.length - 1]
        );

    } catch (error) {

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'El postId no es válido.'
            });
        }

        res.status(500).json({
            message: 'Error al agregar la imagen',
            error: error.message
        });
    }
};

// --- removeImageFromPost ---
const removeImageFromPost = async (req, res) => {
  try {
    const { postId, imageId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post no encontrado'
      });
    }
    post.images.pull(imageId);
    await post.save();
    res.status(200).json({
      message: 'Imagen eliminada'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('comments.user', 'nickName');
        if (!post) {
            return res.status(404).json({
                message: 'Post no encontrado'
            });
        }
        res.status(200).json(post.comments);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'El postId no es válido.'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};

// --- getImagesByPostId ---
const getImagesByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post no encontrado'
            });
        }

        res.status(200).json(post.images);

    } catch (error) {

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'El postId no es válido.'
            });
        }

        res.status(500).json({
            message: error.message
        });
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
