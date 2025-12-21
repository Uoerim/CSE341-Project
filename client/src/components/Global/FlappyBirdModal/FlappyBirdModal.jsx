import React, { useState, useEffect, useRef, useCallback } from "react";
import "./flappyBirdModal.css";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 24;
const GRAVITY = 0.45;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 52;
const PIPE_GAP = 160;
const PIPE_SPEED = 2.5;

export default function FlappyBirdModal({ onClose }) {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState("start"); // start, playing, gameOver
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        return parseInt(localStorage.getItem("loopifyFlappyHighScore") || "0");
    });

    const gameRef = useRef({
        bird: { x: 80, y: CANVAS_HEIGHT / 2, velocity: 0, rotation: 0 },
        pipes: [],
        frameId: null,
        score: 0,
        groundOffset: 0,
    });

    const resetGame = useCallback(() => {
        gameRef.current = {
            bird: { x: 80, y: CANVAS_HEIGHT / 2, velocity: 0, rotation: 0 },
            pipes: [],
            frameId: null,
            score: 0,
            groundOffset: 0,
        };
        setScore(0);
    }, []);

    const jump = useCallback(() => {
        if (gameState === "start") {
            resetGame();
            setGameState("playing");
        } else if (gameState === "playing") {
            gameRef.current.bird.velocity = JUMP_STRENGTH;
        } else if (gameState === "gameOver") {
            resetGame();
            setGameState("playing");
        }
    }, [gameState, resetGame]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                jump();
            }
            if (e.code === "Escape") {
                onClose();
            }
        },
        [jump, onClose]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (gameState !== "playing") return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const game = gameRef.current;

        const spawnPipe = () => {
            const minHeight = 80;
            const maxHeight = CANVAS_HEIGHT - PIPE_GAP - minHeight - 80;
            const topHeight = Math.random() * maxHeight + minHeight;
            game.pipes.push({
                x: CANVAS_WIDTH,
                topHeight,
                bottomY: topHeight + PIPE_GAP,
                passed: false,
            });
        };

        let pipeTimer = 0;
        const PIPE_INTERVAL = 100;

        const drawBackground = () => {
            // Sky gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            gradient.addColorStop(0, "#1a1a2e");
            gradient.addColorStop(0.5, "#16213e");
            gradient.addColorStop(1, "#0f3460");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Stars
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            for (let i = 0; i < 50; i++) {
                const x = (i * 73) % CANVAS_WIDTH;
                const y = (i * 37) % (CANVAS_HEIGHT - 100);
                const size = (i % 3) + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const drawGround = () => {
            // Ground
            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);
            
            // Ground pattern
            ctx.fillStyle = "#ff6b35";
            const groundY = CANVAS_HEIGHT - 60;
            game.groundOffset = (game.groundOffset + PIPE_SPEED) % 40;
            
            for (let x = -game.groundOffset; x < CANVAS_WIDTH; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, groundY);
                ctx.lineTo(x + 20, groundY + 15);
                ctx.lineTo(x + 40, groundY);
                ctx.fillStyle = "#ff6b35";
                ctx.fill();
            }
            
            ctx.fillStyle = "#0E1113";
            ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);
        };

        const drawBird = () => {
            const { x, y, velocity } = game.bird;
            
            ctx.save();
            ctx.translate(x, y);
            
            // Rotation based on velocity
            const rotation = Math.min(Math.max(velocity * 3, -25), 70) * (Math.PI / 180);
            ctx.rotate(rotation);
            
            // Bird body (orange gradient)
            const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE);
            birdGradient.addColorStop(0, "#ff8c42");
            birdGradient.addColorStop(1, "#ff6b35");
            ctx.fillStyle = birdGradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, BIRD_SIZE, BIRD_SIZE * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Bird eye white
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(8, -4, 8, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Bird pupil
            ctx.fillStyle = "#1a1a2e";
            ctx.beginPath();
            ctx.ellipse(10, -4, 4, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupil highlight
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(11, -5, 1.5, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak
            ctx.fillStyle = "#ffc857";
            ctx.beginPath();
            ctx.moveTo(14, 0);
            ctx.lineTo(24, 2);
            ctx.lineTo(14, 6);
            ctx.closePath();
            ctx.fill();
            
            // Wing
            ctx.fillStyle = "#e85d04";
            ctx.beginPath();
            const wingY = Math.sin(Date.now() / 50) * 3;
            ctx.ellipse(-4, wingY + 4, 10, 6, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        };

        const drawPipe = (pipe) => {
            const pipeCapHeight = 30;
            const pipeCapOverhang = 6;
            
            // Top pipe
            const topPipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
            topPipeGradient.addColorStop(0, "#2d6a4f");
            topPipeGradient.addColorStop(0.5, "#40916c");
            topPipeGradient.addColorStop(1, "#2d6a4f");
            
            ctx.fillStyle = topPipeGradient;
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - pipeCapHeight);
            
            // Top pipe cap
            ctx.fillStyle = "#1b4332";
            ctx.fillRect(
                pipe.x - pipeCapOverhang,
                pipe.topHeight - pipeCapHeight,
                PIPE_WIDTH + pipeCapOverhang * 2,
                pipeCapHeight
            );
            
            // Top pipe cap highlight
            ctx.fillStyle = "#52b788";
            ctx.fillRect(
                pipe.x - pipeCapOverhang + 4,
                pipe.topHeight - pipeCapHeight + 4,
                6,
                pipeCapHeight - 8
            );
            
            // Bottom pipe
            ctx.fillStyle = topPipeGradient;
            ctx.fillRect(pipe.x, pipe.bottomY + pipeCapHeight, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY - pipeCapHeight - 60);
            
            // Bottom pipe cap
            ctx.fillStyle = "#1b4332";
            ctx.fillRect(
                pipe.x - pipeCapOverhang,
                pipe.bottomY,
                PIPE_WIDTH + pipeCapOverhang * 2,
                pipeCapHeight
            );
            
            // Bottom pipe cap highlight
            ctx.fillStyle = "#52b788";
            ctx.fillRect(
                pipe.x - pipeCapOverhang + 4,
                pipe.bottomY + 4,
                6,
                pipeCapHeight - 8
            );
        };

        const drawScore = () => {
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 48px 'Segoe UI', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 10;
            ctx.fillText(game.score, CANVAS_WIDTH / 2, 70);
            ctx.shadowBlur = 0;
        };

        const checkCollision = () => {
            const { x, y } = game.bird;
            const birdRadius = BIRD_SIZE * 0.7;

            // Ground collision
            if (y + birdRadius > CANVAS_HEIGHT - 60 || y - birdRadius < 0) {
                return true;
            }

            // Pipe collision
            for (const pipe of game.pipes) {
                if (
                    x + birdRadius > pipe.x &&
                    x - birdRadius < pipe.x + PIPE_WIDTH
                ) {
                    if (y - birdRadius < pipe.topHeight || y + birdRadius > pipe.bottomY) {
                        return true;
                    }
                }
            }

            return false;
        };

        const gameLoop = () => {
            // Update bird
            game.bird.velocity += GRAVITY;
            game.bird.y += game.bird.velocity;

            // Update pipes
            pipeTimer++;
            if (pipeTimer >= PIPE_INTERVAL) {
                spawnPipe();
                pipeTimer = 0;
            }

            game.pipes = game.pipes.filter((pipe) => pipe.x > -PIPE_WIDTH);
            game.pipes.forEach((pipe) => {
                pipe.x -= PIPE_SPEED;

                // Score
                if (!pipe.passed && pipe.x + PIPE_WIDTH < game.bird.x) {
                    pipe.passed = true;
                    game.score++;
                    setScore(game.score);
                }
            });

            // Check collision
            if (checkCollision()) {
                if (game.score > highScore) {
                    setHighScore(game.score);
                    localStorage.setItem("loopifyFlappyHighScore", game.score.toString());
                }
                setGameState("gameOver");
                return;
            }

            // Draw
            drawBackground();
            game.pipes.forEach(drawPipe);
            drawGround();
            drawBird();
            drawScore();

            game.frameId = requestAnimationFrame(gameLoop);
        };

        game.frameId = requestAnimationFrame(gameLoop);

        return () => {
            if (game.frameId) {
                cancelAnimationFrame(game.frameId);
            }
        };
    }, [gameState, highScore]);

    // Draw initial state
    useEffect(() => {
        if (gameState !== "playing") {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const game = gameRef.current;

            // Sky gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            gradient.addColorStop(0, "#1a1a2e");
            gradient.addColorStop(0.5, "#16213e");
            gradient.addColorStop(1, "#0f3460");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Stars
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            for (let i = 0; i < 50; i++) {
                const x = (i * 73) % CANVAS_WIDTH;
                const y = (i * 37) % (CANVAS_HEIGHT - 100);
                const size = (i % 3) + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Ground
            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 60);
            ctx.fillStyle = "#ff6b35";
            const groundY = CANVAS_HEIGHT - 60;
            for (let x = 0; x < CANVAS_WIDTH; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, groundY);
                ctx.lineTo(x + 20, groundY + 15);
                ctx.lineTo(x + 40, groundY);
                ctx.fill();
            }
            ctx.fillStyle = "#0E1113";
            ctx.fillRect(0, CANVAS_HEIGHT - 45, CANVAS_WIDTH, 45);

            // Draw bird at rest
            const birdX = 80;
            const birdY = CANVAS_HEIGHT / 2;
            
            ctx.save();
            ctx.translate(birdX, birdY);
            
            const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE);
            birdGradient.addColorStop(0, "#ff8c42");
            birdGradient.addColorStop(1, "#ff6b35");
            ctx.fillStyle = birdGradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, BIRD_SIZE, BIRD_SIZE * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(8, -4, 8, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "#1a1a2e";
            ctx.beginPath();
            ctx.ellipse(10, -4, 4, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.ellipse(11, -5, 1.5, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "#ffc857";
            ctx.beginPath();
            ctx.moveTo(14, 0);
            ctx.lineTo(24, 2);
            ctx.lineTo(14, 6);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = "#e85d04";
            ctx.beginPath();
            ctx.ellipse(-4, 4, 10, 6, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }, [gameState]);

    return (
        <div className="flappy-modal-overlay" onClick={onClose}>
            <div className="flappy-modal" onClick={(e) => e.stopPropagation()}>
                <button className="flappy-close-btn" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15.898 4.102a.9.9 0 00-1.272 0L10 8.728 5.374 4.102a.9.9 0 10-1.272 1.272L8.728 10l-4.626 4.626a.9.9 0 101.272 1.272L10 11.272l4.626 4.626a.9.9 0 101.272-1.272L11.272 10l4.626-4.626a.9.9 0 000-1.272z"/>
                    </svg>
                </button>
                
                <div className="flappy-header">
                    <h2>Loopify Bird</h2>
                    <div className="flappy-scores">
                        <div className="flappy-score-item">
                            <span className="flappy-score-label">Score</span>
                            <span className="flappy-score-value">{score}</span>
                        </div>
                        <div className="flappy-score-item best">
                            <span className="flappy-score-label">Best</span>
                            <span className="flappy-score-value">{highScore}</span>
                        </div>
                    </div>
                </div>

                <div className="flappy-game-container">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onClick={jump}
                        className="flappy-canvas"
                    />
                    
                    {gameState === "start" && (
                        <div className="flappy-overlay">
                            <div className="flappy-start-content">
                                <div className="flappy-bird-icon">🐦</div>
                                <h3>Ready to Fly?</h3>
                                <p>Click or press Space to start</p>
                                <button className="flappy-start-btn" onClick={jump}>
                                    Play Game
                                </button>
                            </div>
                        </div>
                    )}

                    {gameState === "gameOver" && (
                        <div className="flappy-overlay game-over">
                            <div className="flappy-gameover-content">
                                <h3>Game Over!</h3>
                                <div className="flappy-final-scores">
                                    <div className="flappy-final-score">
                                        <span>Score</span>
                                        <strong>{score}</strong>
                                    </div>
                                    <div className="flappy-final-score">
                                        <span>Best</span>
                                        <strong>{highScore}</strong>
                                    </div>
                                </div>
                                {score === highScore && score > 0 && (
                                    <div className="flappy-new-record">🏆 New Record!</div>
                                )}
                                <button className="flappy-restart-btn" onClick={jump}>
                                    Play Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flappy-instructions">
                    <span>Press <kbd>Space</kbd> or click to jump</span>
                    <span>Press <kbd>Esc</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}
