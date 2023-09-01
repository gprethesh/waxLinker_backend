exports.home = async (req, res) => {
  res.status(200).json({
    suceess: true,
    greeting: `Hello Greetings`,
  });
};
