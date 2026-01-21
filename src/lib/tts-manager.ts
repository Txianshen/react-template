// TTS 管理器类，整合队列和语音合成功能
function splitChineseText(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/[。！？；，、]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
export class TTSManager {
  private queue: string[] = [];
  private isSpeaking: boolean = false;
  private currentPlayingText: string = ""; // 当前正在播放的文本
  private onTextChangeCallback: ((text: string) => void) | null = null; // 文本变更回调

  // 添加文本到队列并自动播放
  public addText(text: string) {
    if (text.trim()) {
      // this.queue.push(text);
      const chunks = splitChineseText(text);
      this.queue.push(...chunks);
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
    this.currentPlayingText = text; // 更新当前播放文本
    if (this.onTextChangeCallback) {
      this.onTextChangeCallback(text); // 触发文本变更回调
    }
    this.isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语音参数
    utterance.rate = 1.6;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentPlayingText = ""; // 播放结束后清空当前文本
      if (this.onTextChangeCallback) {
        this.onTextChangeCallback(""); // 播放结束后清空显示
      }
      // 检查是否有更多文本要播放
      if (this.queue.length > 0) {
        this.speakNext();
      }
    };

    utterance.onerror = (event) => {
      console.error("TTS error:", event);
      this.isSpeaking = false;
      this.currentPlayingText = ""; // 错误时清空当前文本
      if (this.onTextChangeCallback) {
        this.onTextChangeCallback(""); // 错误时清空显示
      }
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
    this.currentPlayingText = ""; // 取消时清空当前文本
  }

  // 设置文本变更回调
  public setOnTextChange(callback: ((text: string) => void) | null) {
    this.onTextChangeCallback = callback;
  }

  // 获取当前正在播放的文本
  public getCurrentPlayingText(): string {
    return this.currentPlayingText;
  }
}
