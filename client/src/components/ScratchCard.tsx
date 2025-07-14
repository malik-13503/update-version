import { useRef, useEffect, useState } from "react";

interface ScratchCardProps {
  width: number;
  height: number;
  scratchPercent?: number;
  onScratchComplete?: () => void;
  onInitialTouch?: () => void;
  children: React.ReactNode;
  isScratched?: boolean;
}

export default function ScratchCard({
  width,
  height,
  scratchPercent = 40,
  onScratchComplete,
  onInitialTouch,
  children,
  isScratched = false,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(isScratched);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [fingerPosition, setFingerPosition] = useState({ x: 0, y: 0, visible: false });
  const [scratchIntensity, setScratchIntensity] = useState(1);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);

  useEffect(() => {
    if (isScratched) {
      setIsCompleted(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw scratch overlay with textured background
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(0, 0, width, height);

    // Add texture pattern for more realistic scratch surface
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    for (let i = 0; i < width; i += 6) {
      for (let j = 0; j < height; j += 6) {
        if (Math.random() > 0.8) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }

    // Add subtle highlight lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 10, height);
      ctx.stroke();
    }

    // Set up for scratching
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [width, height, isScratched]);

  const getEventPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startScratch = (e: any) => {
    if (isCompleted) return;
    
    // Always trigger callback if provided - this handles blocking logic
    if (onInitialTouch) {
      onInitialTouch();
      return; // Don't start scratching when callback is provided
    }
    
    setIsDrawing(true);
    const pos = getEventPos(e);
    setLastPoint(pos);
    setFingerPosition({ x: pos.x, y: pos.y, visible: true });
    
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Create multiple scratch marks for more realistic initial touch
      const scratchSize = 20;
      
      // Main scratch mark
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, scratchSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add irregular scratch patterns around the main touch
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.random() * 0.5;
        const distance = 8 + Math.random() * 12;
        const scratchX = pos.x + Math.cos(angle) * distance;
        const scratchY = pos.y + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(scratchX, scratchY, 6 + Math.random() * 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const scratch = (e: any) => {
    if (!isDrawing || isCompleted) return;

    const pos = getEventPos(e);
    const currentTime = Date.now();
    
    // Calculate velocity and adjust scratching based on speed
    const distance = Math.sqrt(
      Math.pow(pos.x - lastPoint.x, 2) + Math.pow(pos.y - lastPoint.y, 2)
    );
    const timeDelta = currentTime - lastTimeRef.current;
    const velocity = timeDelta > 0 ? distance / timeDelta : 0;
    
    // Update finger position
    setFingerPosition({ x: pos.x, y: pos.y, visible: true });
    
    // Only scratch if there's significant movement
    if (distance < 3) return;
    
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Dynamic brush size based on velocity (faster = smaller, slower = larger)
      const baseSize = 18;
      const velocityFactor = Math.min(velocity * 50, 2);
      const brushSize = Math.max(baseSize - velocityFactor * 4, 8);
      
      // Create realistic scratching with multiple strokes
      const steps = Math.max(Math.ceil(distance / 4), 1);
      
      for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const x = lastPoint.x + (pos.x - lastPoint.x) * ratio;
        const y = lastPoint.y + (pos.y - lastPoint.y) * ratio;
        
        // Main scratch stroke
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add random scratch variations for texture
        if (velocity > 0.1) {
          for (let j = 0; j < 2; j++) {
            const offsetX = x + (Math.random() - 0.5) * 15;
            const offsetY = y + (Math.random() - 0.5) * 15;
            const smallBrush = brushSize * (0.3 + Math.random() * 0.4);
            
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, smallBrush, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
      
      // Connect points with natural curves
      ctx.beginPath();
      ctx.lineWidth = brushSize * 0.8;
      ctx.moveTo(lastPoint.x, lastPoint.y);
      
      const controlX = (lastPoint.x + pos.x) / 2 + (Math.random() - 0.5) * 10;
      const controlY = (lastPoint.y + pos.y) / 2 + (Math.random() - 0.5) * 10;
      
      ctx.quadraticCurveTo(controlX, controlY, pos.x, pos.y);
      ctx.stroke();
      
      setLastPoint(pos);
    }
    
    lastTimeRef.current = currentTime;
    velocityRef.current = velocity;
  };

  const endScratch = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setFingerPosition({ x: 0, y: 0, visible: false });

    // Check if enough has been scratched
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percent = (transparent / (pixels.length / 4)) * 100;

    if (percent > scratchPercent) {
      setIsCompleted(true);
      onScratchComplete?.();
    }
  };

  const handleMouseMove = (e: any) => {
    const pos = getEventPos(e);
    if (!isDrawing) {
      setFingerPosition({ x: pos.x, y: pos.y, visible: true });
    }
  };

  const handleMouseLeave = () => {
    setFingerPosition({ x: 0, y: 0, visible: false });
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  if (isCompleted) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">{children}</div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none touch-none select-none"
        onMouseDown={startScratch}
        onMouseMove={isDrawing ? scratch : handleMouseMove}
        onMouseUp={endScratch}
        onMouseLeave={handleMouseLeave}
        onTouchStart={(e) => {
          e.preventDefault();
          startScratch(e);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          scratch(e);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          endScratch();
        }}
        style={{ 
          width: "100%", 
          height: "100%",
          WebkitUserSelect: "none",
          userSelect: "none"
        }}
      />
      {/* Finger cursor */}
      {fingerPosition.visible && (
        <div
          className="absolute pointer-events-none z-10 transition-all duration-100 ease-out"
          style={{
            left: fingerPosition.x,
            top: fingerPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className={`text-3xl ${isDrawing ? 'scale-110' : 'scale-100'} transition-transform duration-150`}>
            👆
          </div>
          {isDrawing && (
            <div className="absolute inset-0 -z-10 bg-yellow-400 rounded-full opacity-30 animate-pulse" 
                 style={{ width: '40px', height: '40px', left: '-20px', top: '-20px' }} />
          )}
        </div>
      )}
    </div>
  );
}
