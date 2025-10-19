import express from 'express';
const router = express.Router();

router.post('/signin', async (req, res) => {
  const data = req.body;

  console.log(data);

  res.send('Login endpoint');
});

router.post('/signup', (req, res) => {
  const data = req.body;
  // Handle signup logic here
  
  console.log(data);
  
  
  res.send('Signup endpoint');
});

export default router;