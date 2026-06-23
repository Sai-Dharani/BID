import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '@spartacus/core';
import { finalize, take } from 'rxjs/operators';
import { ChatbotApiService } from './chatbot-api.service';

@Component({
  selector: 'app-bia-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: false,
})
export class ChatbotComponent implements OnDestroy {
  isOpen = false;
  isBotLoading = false;
  tooltipClosed = false;
  isListening = false;
  isSpeechSupported = false;
  speechError = '';
  userMessage = '';
  messages: { text: string; type: string }[] = [];

  conversationId: string | null = null;
  @ViewChild('chatInput') chatInputRef?: ElementRef<HTMLInputElement>;
  private readonly recognition: any;
  private readonly loginRequiredMessage =
    'To serve you better, please log in.';

  constructor(
    private chatbotApi: ChatbotApiService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    const SpeechRecognitionCtor =
      (globalThis as any).SpeechRecognition ||
      (globalThis as any).webkitSpeechRecognition;

    this.isSpeechSupported = !!SpeechRecognitionCtor;

    if (this.isSpeechSupported) {
      this.recognition = new SpeechRecognitionCtor();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const lastResult = event.results?.[event.results.length - 1];
        const transcript = (lastResult?.[0]?.transcript || '').trim();

        if (transcript) {
          this.userMessage = this.userMessage
            ? `${this.userMessage} ${transcript}`
            : transcript;
        }

        this.isListening = false;
        this.cdr.detectChanges();
        this.focusChatInput();
      };

      this.recognition.onerror = () => {
        this.isListening = false;
        this.speechError =
          'Voice input is unavailable right now. Please try again.';
        this.cdr.detectChanges();
        this.focusChatInput();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.cdr.detectChanges();
        this.focusChatInput();
      };
    }
  }

  closeTooltip() {
    this.tooltipClosed = true;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.messages.length === 0) {
      this.messages.push({
        text: 'Welcome to ICX Chat Assistant. How can I help you today?',
        type: 'bot',
      });
    }
  }

  toggleVoiceTyping(): void {
    if (!this.isSpeechSupported || !this.recognition) {
      this.speechError =
        'Speech recognition is not supported in this browser.';
      return;
    }

    this.speechError = '';

    if (this.isListening) {
      this.stopVoiceTyping();
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch {
      this.isListening = false;
      this.speechError = 'Unable to start voice typing.';
    }
  }

  private stopVoiceTyping(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  ngOnDestroy(): void {
    this.stopVoiceTyping();
  }

  sendMessage() {
    const query = this.userMessage.trim();
    if (!query || this.isBotLoading) {
      return;
    }

    this.appendMessage(query, 'user');
    this.userMessage = '';

    this.authService
      .isUserLoggedIn()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          this.appendMessage(this.loginRequiredMessage, 'bot');
          return;
        }

        this.callChatbotApi(query);
      });
  }

  private callChatbotApi(query: string): void {
    this.isBotLoading = true;

    this.chatbotApi
      .sendMessage(
        query,
        this.conversationId
      )
      .pipe(finalize(() => (this.isBotLoading = false)))
      .subscribe({
        next: (response) => {
          this.updateConversationId(response.headers.get('x-conversation-id'));
          this.appendMessage(response.body || 'No response', 'bot');
        },
        error: () => {
          this.appendMessage('Please try again in a few minutes...', 'bot');
        },
      });
  }

  private appendMessage(text: string, type: 'user' | 'bot'): void {
    this.messages.push({ text, type });
  }

  private updateConversationId(newConversationId: string | null): void {
    if (newConversationId) {
      this.conversationId = newConversationId;
    }
  }

  private focusChatInput(): void {
    setTimeout(() => {
      this.chatInputRef?.nativeElement.focus();
    });
  }
}
