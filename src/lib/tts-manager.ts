// TTS 管理器类，整合队列和语音合成功能
export class TTSManager {
  private queue: string[] = [];
  private isSpeaking: boolean = false;

  // 添加文本到队列并自动播放
  public addText(text: string) {
    if (text.trim()) {
      this.queue.push(text);
      // 如果没有正在播放，则立即开始
      if (!this.isSpeaking) {
        this.speakNext();
      }
    }
  }

  // 播放下一个文本
  public speakNext() {
    if (this.isSpeaking || this.queue.length === 0) return;

    const text = this.queue.shift()!;
    this.isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语音参数
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onend = () => {
      this.isSpeaking = false;
      // 检查是否有更多文本要播放
      if (this.queue.length > 0) {
        this.speakNext();
      }
    };

    utterance.onerror = (event) => {
      console.error("TTS error:", event);
      this.isSpeaking = false;
      // 尝试下一个文本
      if (this.queue.length > 0) {
        this.speakNext();
      }
    };

    speechSynthesis.speak(utterance);
  }

  // 获取队列长度
  public getQueueLength(): number {
    return this.queue.length;
  }

  // 清空队列
  public clearQueue() {
    this.queue = [];
  }

  // 取消当前播放
  public cancel() {
    speechSynthesis.cancel();
    this.isSpeaking = false;
  }
}
