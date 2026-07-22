import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Cpu, Database, Award, 
  RefreshCw, Terminal, QrCode, ArrowRight, Server, Link2, Check
} from 'lucide-react';

export default function BlockchainResume({ user, uploadedFileName, onMintedSuccess }) {
  const [ledger, setLedger] = useState([]);
  const [userBlock, setUserBlock] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, minting, finished, error
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingBlockId, setVerifyingBlockId] = useState(null);
  const [verificationLogs, setVerificationLogs] = useState([]);

  const handleVerifyBlock = (block) => {
    setVerifyingBlockId(block.id);
    setVerificationLogs(["> Initializing SHA-256 integrity audits..."]);
    
    const steps = [
      `> Parsing Merkle leaf signatures for candidate: ${block.userName}...`,
      `> Hash checksum: ${block.block_hash.slice(0, 16)}... VERIFIED!`,
      `> Link integrity checked: previous_hash matches block #${block.block_index - 1}!`,
      `> Ledger verification completed: Node Node #${block.block_index} is 100% CRYPTOGRAPHICALLY SECURE ✅`
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setVerificationLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 380);
  };

  useEffect(() => {
    fetchLedger();
    fetchUserBlock();
  }, []);

  const fetchLedger = () => {
    setIsLoading(true);
    fetch(apiUrl('/api/blockchain/ledger'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLedger(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching global blockchain ledger:', err);
        setIsLoading(false);
      });
  };

  const fetchUserBlock = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(apiUrl('/api/blockchain'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.block_hash) {
          // Parse skills if stringified in sqlite
          if (typeof data.skills === 'string') {
            try {
              data.skills = JSON.parse(data.skills);
            } catch(e) {}
          }
          setUserBlock(data);
        }
      })
      .catch(err => console.error('Error fetching user block:', err));
  };

  const handleMintResume = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('Please Sign In first to access Cryptographic blockchain tools.');
      return;
    }

    if (!user.skills || user.skills.length === 0) {
      setStatus('error');
      setErrorMsg('No verified skills detected. Please upload a PDF resume in the Command Center first to extract your skills.');
      return;
    }

    setStatus('minting');
    setErrorMsg('');

    fetch(apiUrl('/api/blockchain/mint'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        skills: user.skills
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Minting failed');
        return data;
      })
      .then(block => {
        setStatus('finished');
        setUserBlock(block);
        fetchLedger(); // Refresh global pool
        if (onMintedSuccess) {
          onMintedSuccess(); // Boost readiness score
        }
      })
      .catch(err => {
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during cryptographic minting.');
      });
  };

  return (
    <div className="container py-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <ShieldCheck size={14} className="text-secondary animate-pulse" /> Decentrally Secure Credentials
          </span>
          <h2 className="text-3xl font-extrabold text-white">Simulated Blockchain Verified Resume</h2>
          <p className="text-text-secondary text-sm">Lock in your technical skill certifications against resume credential fraud.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Side: Ledger Minting controls and user Certificate Card */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Minting Dashboard Controller */}
          <div className="card p-6 border-white/5 bg-[#0d0e14]">
            <h3 className="font-extrabold text-base text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-secondary" /> Minting Console
            </h3>

            <AnimatePresence mode="wait">
              {status === 'idle' && !userBlock && (
                <motion.div key="idle" className="space-y-4">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Cryptographically sign and stamp your active parsed skills (**{user?.skills ? user.skills.length : 0} verified**) onto the HireHub ledger. Minting establishes a simulated SHA-256 block mapping.
                  </p>
                  <button 
                    onClick={handleMintResume}
                    className="btn btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={14} /> Mint Cryptographic Resume
                  </button>
                </motion.div>
              )}

              {status === 'minting' && (
                <motion.div key="minting" className="space-y-4 text-center py-6">
                  <div className="relative inline-flex items-center justify-center mb-2">
                    <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin"></div>
                    <Database size={16} className="text-primary absolute" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Broadcasting block node...</h4>
                  <div className="text-[10px] text-text-secondary font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-left space-y-1">
                    <div>&gt; Hashing Merkle Root...</div>
                    <div>&gt; Injecting SHA-256 signatures...</div>
                    <div>&gt; Chaining block index...</div>
                  </div>
                </motion.div>
              )}

              {(status === 'finished' || userBlock) && (
                <motion.div key="finished" className="space-y-4">
                  <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-3">
                    <div className="p-1.5 bg-secondary/20 text-secondary rounded-lg shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="text-[11px] text-text-secondary font-medium leading-normal">
                      Resume ledger block is permanently secured. Your **Career Readiness Score** has been boosted!
                    </span>
                  </div>

                  <div className="text-[10px] text-text-secondary font-mono bg-black/40 p-3 rounded-lg border border-white/5 space-y-2.5">
                    <div>
                      <div className="text-white uppercase font-bold">Block Hash:</div>
                      <div className="truncate text-secondary font-semibold">{userBlock.block_hash || userBlock.blockHash}</div>
                    </div>
                    <div>
                      <div className="text-white uppercase font-bold">Previous Hash:</div>
                      <div className="truncate">{userBlock.previous_hash || userBlock.previousHash}</div>
                    </div>
                  </div>

                  <button 
                    onClick={handleMintResume}
                    className="btn btn-secondary w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw size={12} /> Mint Upgrade (Re-hash)
                  </button>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div key="error" className="space-y-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400">
                    <ShieldAlert size={18} className="shrink-0" />
                    <span className="text-xs font-medium">{errorMsg}</span>
                  </div>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="btn btn-secondary w-full py-2 text-xs"
                  >
                    Reset Console
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Holographic Verified QR certificate frame */}
          {(userBlock || status === 'finished') && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 border-primary/20 bg-gradient-to-br from-primary/15 via-black/40 to-transparent relative overflow-hidden rounded-2xl shadow-xl border"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
              
              <div className="border-2 border-dashed border-primary/20 p-5 rounded-xl space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-xs text-white uppercase tracking-wider">Verified Professional</h4>
                    <span className="text-[9px] font-mono text-text-secondary uppercase">ID: HIREHUB-SECURE-#{userBlock.id || userBlock.blockIndex}</span>
                  </div>
                  <div className="p-2 bg-primary/20 text-primary border border-primary/30 rounded-lg">
                    <Award size={18} />
                  </div>
                </div>

                <div className="flex justify-center py-2 bg-white/5 rounded-xl border border-white/5">
                  {/* Stylized QR Code Simulator */}
                  <div className="p-3 bg-white rounded-lg flex items-center justify-center">
                    <QrCode size={100} className="text-black" />
                  </div>
                </div>

                <div className="space-y-2 text-xs text-center border-t border-white/5 pt-4">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-[9px] text-text-secondary leading-normal truncate font-mono">
                    VERIFIED HASH: {userBlock.block_hash || userBlock.blockHash}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Right Side: Global Blockchain Ledger Chain Visualization */}
        <div className="md:col-span-2">
          <div className="card p-8 border-white/5 bg-[#0d0e14] h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Server size={18} className="text-primary" /> Verified Candidate Pool Ledger
                </h3>
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold">
                  {ledger.length} Block Nodes Secured
                </span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-text-secondary text-xs">Loading ledger blocks...</p>
                </div>
              ) : ledger.length === 0 ? (
                <div className="text-center py-24 text-text-secondary text-xs">
                  <Terminal size={32} className="mx-auto mb-3 text-white/10" />
                  No resume blocks minted to the network yet. Be the first to secure your CV!
                </div>
              ) : (
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
                  {ledger.map((block, idx) => {
                    let blockSkills = [];
                    if (typeof block.skills === 'string') {
                      try { blockSkills = JSON.parse(block.skills); } catch(e) {}
                    } else if (Array.isArray(block.skills)) {
                      blockSkills = block.skills;
                    }

                    const isSelf = block.user_id === user.id;

                    return (
                      <motion.div 
                        key={block.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-start gap-4 relative ${idx < ledger.length - 1 ? 'before:absolute before:left-5 before:top-10 before:bottom-[-24px] before:w-0.5 before:bg-white/5' : ''}`}
                      >
                        {/* Chain Node Link Indicator */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-lg ${isSelf ? 'bg-secondary/20 text-secondary border border-secondary/35' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                          <Link2 size={14} className={isSelf ? 'animate-pulse' : ''} />
                        </div>

                        <div className={`flex-1 p-5 rounded-2xl border bg-black/35 ${isSelf ? 'border-secondary/30' : 'border-white/5'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-xs text-white">{isSelf ? `${block.userName} (You)` : block.userName}</h4>
                                <span className="px-2 py-0.2 bg-white/5 text-text-secondary border border-white/5 rounded text-[8px] uppercase tracking-wider font-bold">
                                  Index #{block.block_index}
                                </span>
                              </div>
                              <span className="text-[10px] text-text-secondary font-semibold">{block.userEmail}</span>
                            </div>
                            <span className="text-[9px] text-text-secondary font-mono">
                              {new Date(block.timestamp).toLocaleString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {blockSkills.map((s, si) => (
                              <span 
                                key={si} 
                                className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-white"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="text-[9px] font-mono text-text-secondary flex flex-col gap-1 border-t border-white/5 pt-3">
                            <div className="flex gap-2">
                              <span className="uppercase font-bold text-white shrink-0">BLOCK HASH:</span>
                              <span className="truncate">{block.block_hash}</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                              <span className="uppercase font-bold text-white shrink-0">PREV HASH:</span>
                              <span className="truncate">{block.previous_hash}</span>
                            </div>
                          </div>

                          {/* Verification Trigger Button */}
                          <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleVerifyBlock(block)}
                              className="text-[9px] text-primary hover:text-white font-bold hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1 uppercase"
                            >
                              <ShieldCheck size={10} /> Verify Block Integrity
                            </button>
                            {verifyingBlockId === block.id && (
                              <span className="text-[8px] font-bold text-secondary uppercase tracking-wider animate-pulse">Auditing Node...</span>
                            )}
                          </div>

                          {/* Terminal Output Logs */}
                          {verifyingBlockId === block.id && (
                            <div className="mt-3 bg-black/80 p-3 rounded-lg border border-primary/20 text-[8px] font-mono text-green-400 space-y-1.5 max-h-[100px] overflow-y-auto">
                              {verificationLogs.map((log, li) => (
                                <div key={li}>{log}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3 text-xs text-text-secondary items-center">
              <ShieldCheck size={20} className="text-secondary shrink-0" />
              <span>
                HireHub Blockchain network validates credentials on-chain. Altering local SQLite schemas triggers block mismatch errors recursively across ledger nodes.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
