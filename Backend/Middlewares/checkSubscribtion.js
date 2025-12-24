const checkSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const now = new Date();

  const trialValid = user.trialEndsAt && now < user.trialEndsAt;

  if (user.isSubscribed || trialValid) {
    return next();
  }

  return res.status(403).json({
    message: "Subscription required",
  });
};
