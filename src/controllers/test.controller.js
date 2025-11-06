export const testHandler = async (req, res) => {
  try {
    res.status(200).json({ message: "Hello from AI Code Reviewer test route!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
