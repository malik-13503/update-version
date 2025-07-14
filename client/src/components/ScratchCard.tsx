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
  const [scratchPoints, setScratchPoints] = useState<Array<{ x: number; y: number; size: number }>>([]);

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

    // Draw realistic scratch overlay with metallic gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#c0c0c0");
    gradient.addColorStop(0.2, "#e8e8e8");
    gradient.addColorStop(0.4, "#a0a0a0");
    gradient.addColorStop(0.6, "#d0d0d0");
    gradient.addColorStop(0.8, "#b0b0b0");
    gradient.addColorStop(1, "#989898");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle texture pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < width; i += 4) {
      for (let j = 0; j < height; j += 4) {
        if (Math.random() > 0.7) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
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
    
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Start with a larger brush size for initial touch
      ctx.lineWidth = 25;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      
      // Create a circular scratch at the starting point
      ctx.arc(pos.x, pos.y, 12, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const scratch = (e: any) => {
    if (!isDrawing || isCompleted) return;

    const pos = getEventPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Calculate distance from last point for speed-based brush size
      const distance = Math.sqrt(
        Math.pow(pos.x - lastPoint.x, 2) + Math.pow(pos.y - lastPoint.y, 2)
      );
      
      // Adjust brush size based on movement speed (slower = larger brush)
      const baseSize = 20;
      const speedFactor = Math.min(distance / 10, 3);
      const brushSize = Math.max(baseSize - speedFactor * 5, 12);
      
      ctx.lineWidth = brushSize;
      
      // Use quadratic curves for smoother lines
      const midX = (lastPoint.x + pos.x) / 2;
      const midY = (lastPoint.y + pos.y) / 2;
      
      ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, midX, midY);
      ctx.stroke();
      
      // Add small circles along the path for better coverage
      const steps = Math.ceil(distance / 8);
      for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const x = lastPoint.x + (pos.x - lastPoint.x) * ratio;
        const y = lastPoint.y + (pos.y - lastPoint.y) * ratio;
        
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      setLastPoint(pos);
    }
  };

  const endScratch = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

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

  if (isCompleted) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">{children}</div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none select-none"
        onMouseDown={startScratch}
        onMouseMove={scratch}
        onMouseUp={endScratch}
        onMouseLeave={endScratch}
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
    </div>
  );
}
