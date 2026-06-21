const Tag = require('../models/Tag');
const { validateTag } = require('../middlewares/validation');

const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().select('-__v');
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { error } = validateTag(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'La etiqueta ya existe' });
    }
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag no encontrado' });
    }
    res.json({ message: 'Tag eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTags, createTag, deleteTag };