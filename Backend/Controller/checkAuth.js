exports.checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ loggedIn: false });
    }

    return res.status(200).json({
      loggedIn: true,
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
