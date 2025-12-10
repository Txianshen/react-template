import { useEffect, useRef, useState } from "react";

export function useAudioVisualization() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let animationId: number;
    let audioCtx: AudioContext | null = null;
    let stream: MediaStream | null = null;

    async function init() {
      const canvas = canvasRef.current;

      // 如果 canvas 不存在，直接返回
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      // 如果 context 不存在，直接返回
      if (!ctx) return;

      // 绘制默认状态（未激活时显示一条静态细线）
      function drawDefault() {
        // 不需要动画循环，只需要绘制一次静态线条
        // 清空画布
        ctx!.fillStyle = "#050d24";
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

        // 绘制一条静态细线
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = "#4ade80";
        ctx!.beginPath();

        // 计算中心线位置
        const centerY = canvas!.height / 2;

        // 绘制一条水平线，没有动态效果
        ctx!.moveTo(0, centerY);
        ctx!.lineTo(canvas!.width, centerY);

        ctx!.stroke();
      }

      // 如果未激活，绘制默认状态
      //   if (!isActive) {
      //     drawDefault();
      //     return;
      //   }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
          animationId = requestAnimationFrame(draw);

          if (!canvas) return;

          analyser.getByteTimeDomainData(dataArray);

          ctx!.fillStyle = "#050d24";
          ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

          ctx!.lineWidth = 2;
          ctx!.strokeStyle = "#4ade80";
          ctx!.beginPath();

          const sliceWidth = canvas!.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128;
            const y = (v * canvas!.height) / 2;

            if (i === 0) ctx!.moveTo(x, y);
            else ctx!.lineTo(x, y);

            x += sliceWidth;
          }

          ctx!.stroke();
        }

        draw();
      } catch (error) {
        console.error("获取麦克风权限失败:", error);
        // 出错时也绘制默认状态
        drawDefault();
      }
    }

    init();

    return () => {
      cancelAnimationFrame(animationId);
      audioCtx?.close();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isActive]);

  return { canvasRef, isActive, setIsActive };
}
