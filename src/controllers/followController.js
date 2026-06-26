const User = require('../models/User');
const Follow = require('../models/Follow');



const followUser = async (req, res) => {
  try {
    let { follower_nickname, followed_nickname } = req.body;

    follower_nickname = follower_nickname.trim().toLowerCase();
    followed_nickname = followed_nickname.trim().toLowerCase();

    if (follower_nickname === followed_nickname) {
      return res.status(400).json({
        message: "No puedes seguirte a ti mismo."
      });
    }

    const follower = await User.findOne({ nickName: follower_nickname });
    const followed = await User.findOne({ nickName: followed_nickname });

    if (!follower) {
      return res.status(404).json({ message: "El usuario seguidor no existe." });
    }

    if (!followed) {
      return res.status(404).json({ message: "El usuario a seguir no existe." });
    }

    const existingFollow = await Follow.findOne({
      follower_nickname,
      followed_nickname,
    });

    if (existingFollow) {
      return res.status(409).json({ message: "Ya sigues a este usuario." });
    }

    await Follow.create({
      follower_nickname,
      followed_nickname
    });

    return res.status(201).json({
      message: "Usuario seguido exitosamente."
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error al seguir al usuario",
      error: error.message
    });
  }
};


const getFollowing = async (req, res) => {
  try {
    const { nickname } = req.params;

    const user = await User.findOne({ nickName: nickname });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar a quiénes sigue
    const following = await Follow.find({ follower_nickname: nickname });

    const followingNicknames = following.map(f => f.followed_nickname);
    const followingUsers = await User.find(
      { nickName: { $in: followingNicknames } },
      { nickName: 1, _id: 0 }
    );

    res.status(200).json(followingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los seguidos." });
  }
};


const getFollowers = async (req, res) => {
  try {
    const { nickname } = req.params;

    const user = await User.findOne({ nickName: nickname });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar quiénes lo siguen
    const followers = await Follow.find({ followed_nickname: nickname });

    // Obtener datos completos de esos seguidores
    const followerNicknames = followers.map(f => f.follower_nickname);
    const followerUsers = await User.find(
      { nickName: { $in: followerNicknames } },
      { nickName: 1, _id: 0 }
    );

    res.status(200).json(followerUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los seguidores." });
  }
};


const unfollowUser = async (req, res) => {
  try {
    let { follower_nickname, followed_nickname } = req.body;
    follower_nickname = follower_nickname.trim().toLowerCase();
    followed_nickname = followed_nickname.trim().toLowerCase();
    const follow = await Follow.findOne({
      follower_nickname,
      followed_nickname,
    });
    if (!follow) {
      return res.status(404).json({
        message: "No sigues a este usuario."
      });
    }
    await follow.deleteOne();
    return res.status(200).json({
      message: "Dejaste de seguir al usuario."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al dejar de seguir al usuario.",
      error: error.message
    });
  }
};


module.exports = {
    followUser,
    getFollowing,
    getFollowers,
    unfollowUser
};