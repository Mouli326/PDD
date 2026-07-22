const express = require('express');
const router = express.Router();
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');

// Helper to generate SHA-256 hash
function calculateHash(index, timestamp, userId, skills, previousHash) {
  const content = `${index}-${timestamp}-${userId}-${JSON.stringify(skills)}-${previousHash}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

// @route   GET api/blockchain
// @desc    Get current user's minted credential
// @access  Private
router.get('/', authMiddleware, (req, res) => {
  db.get(
    'SELECT * FROM blockchain_ledger WHERE user_id = ? ORDER BY block_index DESC LIMIT 1',
    [req.user.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(row || null);
    }
  );
});

// @route   GET api/blockchain/ledger
// @desc    Get the global verified ledger chain
// @access  Public
router.get('/ledger', (req, res) => {
  db.all(
    `SELECT b.*, u.name as userName, u.email as userEmail, u.role as userRole 
     FROM blockchain_ledger b
     JOIN users u ON b.user_id = u.id
     ORDER BY b.block_index ASC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json(rows);
    }
  );
});

// @route   POST api/blockchain/mint
// @desc    Mint current user credentials to the blockchain ledger
// @access  Private
router.post('/mint', authMiddleware, (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Valid skills array required for minting' });
  }

  // 1. Get the last block in the ledger to chain properly
  db.get('SELECT * FROM blockchain_ledger ORDER BY block_index DESC LIMIT 1', [], (err, lastBlock) => {
    if (err) {
      return res.status(500).json({ message: 'Ledger retrieval failed', error: err.message });
    }

    const nextIndex = lastBlock ? lastBlock.block_index + 1 : 1;
    const prevHash = lastBlock ? lastBlock.block_hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const blockHash = calculateHash(nextIndex, timestamp, req.user.id, skills, prevHash);
    const qrCodeHash = crypto.createHash('md5').update(`${req.user.id}-${blockHash}`).digest('hex');

    // 2. Check if user already minted a block (delete old if exists to maintain 1 block per user in this demo ledger)
    db.run('DELETE FROM blockchain_ledger WHERE user_id = ?', [req.user.id], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Ledger clearing error', error: err.message });
      }

      // 3. Insert new block
      db.run(
        `INSERT INTO blockchain_ledger (user_id, block_index, timestamp, skills, previous_hash, block_hash, qr_code_hash)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, nextIndex, timestamp, JSON.stringify(skills), prevHash, blockHash, qrCodeHash],
        function (err) {
          if (err) {
            return res.status(500).json({ message: 'Failed to mint block to ledger', error: err.message });
          }

          res.json({
            id: this.lastID,
            userId: req.user.id,
            blockIndex: nextIndex,
            timestamp,
            skills,
            previousHash: prevHash,
            blockHash,
            qrCodeHash,
            status: 'Minted & Verified'
          });
        }
      );
    });
  });
});

module.exports = router;
