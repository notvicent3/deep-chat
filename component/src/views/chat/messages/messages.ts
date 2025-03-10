import {ProcessedTextToSpeechConfig, TextToSpeech} from './textToSpeech/textToSpeech';
import {MessageFile, MessageFileType} from '../../../types/messageFile';
import {CustomErrors, ServiceIO} from '../../../services/serviceIO';
import {LoadingMessageDotsStyle} from './loadingMessageDotsStyle';
import {ElementUtils} from '../../../utils/element/elementUtils';
import {RemarkableConfig} from './remarkable/remarkableConfig';
import {FireEvents} from '../../../utils/events/fireEvents';
import {InterfacesUnion} from '../../../types/utilityTypes';
import {HTMLClassUtilities} from '../../../types/html';
import {Demo, DemoResponse} from '../../../types/demo';
import {MessageStyleUtils} from './messageStyleUtils';
import {IntroPanel} from '../introPanel/introPanel';
import {FileMessageUtils} from './fileMessageUtils';
import {HTMLMessageUtils} from './htmlMessageUtils';
import {CustomStyle} from '../../../types/styles';
import {Response} from '../../../types/response';
import {Avatars} from '../../../types/avatars';
import {SetupMessages} from './setupMessages';
import {FileMessages} from './fileMessages';
import {DeepChat} from '../../../deepChat';
import {Names} from '../../../types/names';
import {Remarkable} from 'remarkable';
import {AvatarEl} from './avatar';
import {Name} from './name';
import {
  ErrorMessageOverrides,
  MessageElementsStyles,
  MessageRoleStyles,
  MessageContent,
  MessageStyles,
  IntroMessage,
} from '../../../types/messages';

export interface MessageElements {
  outerContainer: HTMLElement;
  innerContainer: HTMLElement;
  bubbleElement: HTMLElement;
}

type AcceptedContent = InterfacesUnion<{text: string} | {file: MessageFile} | {html: string}>;

export class Messages {
  elementRef: HTMLElement;
  readonly messageStyles?: MessageStyles;
  private _messageElementRefs: MessageElements[] = [];
  private readonly _avatars?: Avatars;
  private readonly _names?: Names;
  private readonly _errorMessageOverrides?: ErrorMessageOverrides;
  private readonly _onNewMessage?: (message: MessageContent, isInitial: boolean) => void;
  private readonly _onClearMessages?: () => void;
  private readonly _displayLoadingMessage?: boolean;
  private readonly _permittedErrorPrefixes?: CustomErrors;
  private readonly displayServiceErrorMessages?: boolean;
  private _remarkable: Remarkable;
  private _textToSpeech?: ProcessedTextToSpeechConfig;
  private _introPanel?: IntroPanel;
  private _introMessage?: IntroMessage;
  private _streamedText = '';
  readonly _htmlClassUtilities: HTMLClassUtilities = {};
  messages: MessageContent[] = [];
  customDemoResponse?: DemoResponse;

  constructor(deepChat: DeepChat, serviceIO: ServiceIO, panel?: HTMLElement) {
    const {permittedErrorPrefixes, introPanelMarkUp, demo} = serviceIO;
    this._remarkable = RemarkableConfig.createNew();
    this.elementRef = Messages.createContainerElement();
    this.messageStyles = deepChat.messageStyles;
    this._avatars = deepChat.avatars;
    this._names = deepChat.names;
    this._errorMessageOverrides = deepChat.errorMessages?.overrides;
    if (deepChat.htmlClassUtilities) this._htmlClassUtilities = deepChat.htmlClassUtilities;
    this._onNewMessage = FireEvents.onNewMessage.bind(this, deepChat);
    this._onClearMessages = FireEvents.onClearMessages.bind(this, deepChat);
    this._displayLoadingMessage = Messages.getDisplayLoadingMessage(deepChat, serviceIO);
    this._permittedErrorPrefixes = permittedErrorPrefixes;
    this.addSetupMessageIfNeeded(deepChat, serviceIO);
    this.populateIntroPanel(panel, introPanelMarkUp, deepChat.introPanelStyle);
    if (deepChat.introMessage) this.addIntroductoryMessage(deepChat.introMessage);
    if (deepChat.initialMessages) this.populateInitialMessages(deepChat.initialMessages);
    this.displayServiceErrorMessages = deepChat.errorMessages?.displayServiceErrorMessages;
    deepChat.getMessages = () => JSON.parse(JSON.stringify(this.messages));
    deepChat.clearMessages = this.clearMessages.bind(this);
    deepChat.refreshMessages = this.refreshTextMessages.bind(this);
    if (demo) this.prepareDemo(demo);
    if (deepChat.textToSpeech) {
      TextToSpeech.processConfig(deepChat.textToSpeech, (processedConfig) => {
        this._textToSpeech = processedConfig;
      });
    }
  }

  private static getDisplayLoadingMessage(deepChat: DeepChat, serviceIO: ServiceIO) {
    if (serviceIO.websocket) return false;
    return deepChat.displayLoadingBubble ?? true;
  }

  private prepareDemo(demo: Demo) {
    if (typeof demo === 'object') {
      if (demo.response) this.customDemoResponse = demo.response;
      if (demo.displayErrors) {
        if (demo.displayErrors.default) this.addNewErrorMessage('' as 'service', '');
        if (demo.displayErrors.service) this.addNewErrorMessage('service', '');
        if (demo.displayErrors.speechToText) this.addNewErrorMessage('speechToText', '');
      }
      if (demo.displayLoadingBubble) {
        this.addLoadingMessage();
      }
    }
  }

  private static createContainerElement() {
    const container = document.createElement('div');
    container.id = 'messages';
    return container;
  }

  private addSetupMessageIfNeeded(deepChat: DeepChat, serviceIO: ServiceIO) {
    const text = SetupMessages.getText(deepChat, serviceIO);
    if (text) {
      const elements = this.createAndAppendNewMessageElement(text, true);
      this.applyCustomStyles(elements, true, false);
    }
  }

  private addIntroductoryMessage(introMessage?: IntroMessage) {
    if (introMessage) this._introMessage = introMessage;
    if (this._introMessage?.text) {
      const elements = this.createAndAppendNewMessageElement(this._introMessage.text, true);
      this.applyCustomStyles(elements, true, false, this.messageStyles?.intro);
    } else if (this._introMessage?.html) {
      HTMLMessageUtils.addNewHTMLMessage(this, this._introMessage.html, true, false, true);
    }
  }

  private populateInitialMessages(initialMessages: MessageContent[]) {
    initialMessages.forEach((message) => {
      this.addNewMessage(message, message.role === 'ai', true, true);
    });
    setTimeout(() => (this.elementRef.scrollTop = this.elementRef.scrollHeight));
  }

  // prettier-ignore
  public applyCustomStyles(elements: MessageElements, isAI: boolean, media: boolean,
      otherStyles?: MessageRoleStyles | MessageElementsStyles) {
    if (this.messageStyles) {
      MessageStyleUtils.applyCustomStyles(this.messageStyles, elements, isAI, media, otherStyles);
    }
  }

  private addInnerContainerElements(bubbleElement: HTMLElement, text: string, isAI: boolean) {
    bubbleElement.classList.add('message-bubble', isAI ? 'ai-message-text' : 'user-message-text');
    bubbleElement.innerHTML = this._remarkable.render(text);
    // there is a bug in remarkable where text with only numbers and full stop after them causes the creation
    // of a list which has no innert text and is instead prepended as a prefix in the start attribute (12.)
    if (bubbleElement.innerText.trim().length === 0) bubbleElement.innerText = text;
    if (this._avatars) AvatarEl.add(bubbleElement, isAI, this._avatars);
    if (this._names) Name.add(bubbleElement, isAI, this._names);
    return {bubbleElement};
  }

  public static createMessageContent(isAI: boolean, content: AcceptedContent): MessageContent {
    const role = isAI ? 'ai' : 'user';
    const {text, file, html} = content;
    if (file) return {role, file};
    if (html) return {role, html};
    return {role, text: text || ''};
  }

  private static createBaseElements(): MessageElements {
    const outerContainer = document.createElement('div');
    const innerContainer = document.createElement('div');
    innerContainer.classList.add('inner-message-container');
    outerContainer.appendChild(innerContainer);
    outerContainer.classList.add('outer-message-container');
    const bubbleElement = document.createElement('div');
    bubbleElement.classList.add('message-bubble');
    innerContainer.appendChild(bubbleElement);
    return {outerContainer, innerContainer, bubbleElement};
  }

  private createMessageElements(text: string, isAI: boolean) {
    const messageElements = Messages.createBaseElements();
    const {outerContainer, innerContainer, bubbleElement} = messageElements;
    outerContainer.appendChild(innerContainer);
    this.addInnerContainerElements(bubbleElement, text, isAI);
    this._messageElementRefs.push(messageElements);
    return messageElements;
  }

  public createNewMessageElement(text: string, isAI: boolean) {
    this._introPanel?.hide();
    const lastMessageElements = this._messageElementRefs[this._messageElementRefs.length - 1];
    if (lastMessageElements?.bubbleElement.classList.contains('loading-message-text')) {
      lastMessageElements.outerContainer.remove();
      this._messageElementRefs.pop();
    }
    return this.createMessageElements(text, isAI);
  }

  private createAndAppendNewMessageElement(text: string, isAI: boolean) {
    const messageElements = this.createNewMessageElement(text, isAI);
    this.elementRef.appendChild(messageElements.outerContainer);
    this.elementRef.scrollTop = this.elementRef.scrollHeight;
    return messageElements;
  }

  // makes sure the bubble has dimensions when there is no text
  private static editEmptyMessageElement(bubbleElement: HTMLElement) {
    bubbleElement.textContent = '.';
    bubbleElement.style.color = '#00000000';
  }

  private addNewTextMessage(text: string, isAI: boolean, update: boolean, isInitial = false) {
    const messageElements = this.createAndAppendNewMessageElement(text, isAI);
    this.applyCustomStyles(messageElements, isAI, false);
    const messageContent = Messages.createMessageContent(isAI, {text});
    if (text.trim().length === 0) Messages.editEmptyMessageElement(messageElements.bubbleElement);
    this.messages.push(messageContent);
    if (update) this.sendClientUpdate(messageContent, isInitial);
    return messageElements;
  }

  public addNewMessage(data: Response, isAI: boolean, update: boolean, isInitial = false) {
    if (data.text !== undefined && data.text !== null) {
      this.addNewTextMessage(data.text, isAI, update, isInitial);
      if (!isInitial && this._textToSpeech && isAI) TextToSpeech.speak(data.text, this._textToSpeech);
    } else if (data.files) {
      data.files.forEach((fileData) => {
        // extra checks are used for 'any'
        if (fileData.type === 'audio' || fileData.src?.startsWith('data:audio')) {
          FileMessages.addNewAudioMessage(this, fileData, isAI, isInitial);
        } else if (fileData.type === 'image' || fileData.type === 'gif' || fileData.src?.startsWith('data:image')) {
          FileMessages.addNewImageMessage(this, fileData, isAI, isInitial);
        } else {
          FileMessages.addNewAnyFileMessage(this, fileData, isAI, isInitial);
        }
      });
    } else if (data.html) {
      HTMLMessageUtils.addNewHTMLMessage(this, data.html, isAI, update, isInitial);
    }
  }

  public sendClientUpdate(message: MessageContent, isInitial = false) {
    this._onNewMessage?.(JSON.parse(JSON.stringify(message)), isInitial);
  }

  // prettier-ignore
  private removeMessageOnError() {
    const lastMessage = this._messageElementRefs[this._messageElementRefs.length - 1];
    const lastMessageBubble = lastMessage?.bubbleElement;
    if ((lastMessageBubble?.classList.contains('streamed-message') && lastMessageBubble.textContent === '') ||
      lastMessageBubble?.classList.contains('loading-message-text')) {
      lastMessage.outerContainer.remove();
      this._messageElementRefs.pop();
    }
  }

  // prettier-ignore
  public addNewErrorMessage(type: keyof Omit<ErrorMessageOverrides, 'default'>, message?: string) {
    this.removeMessageOnError();
    const messageElements = Messages.createBaseElements();
    const {outerContainer, bubbleElement} = messageElements;
    bubbleElement.classList.add('error-message-text');
    const text = this.getPermittedMessage(message) || this._errorMessageOverrides?.[type]
      || this._errorMessageOverrides?.default || 'Error, please try again.';
    bubbleElement.innerHTML = text;
    const fontElementStyles = MessageStyleUtils.extractParticularSharedStyles(['fontSize', 'fontFamily'],
      this.messageStyles?.default);
    MessageStyleUtils.applyCustomStylesToElements(messageElements, false, fontElementStyles);
    MessageStyleUtils.applyCustomStylesToElements(messageElements, false, this.messageStyles?.error);
    this.elementRef.appendChild(outerContainer);
    this.elementRef.scrollTop = this.elementRef.scrollHeight;
    if (this._textToSpeech) TextToSpeech.speak(text, this._textToSpeech);
    this._streamedText = '';
  }

  private static checkPermittedErrorPrefixes(errorPrefixes: string[], message: string): string | undefined {
    for (let i = 0; i < errorPrefixes.length; i += 1) {
      if (message.startsWith(errorPrefixes[i])) return message;
    }
    return undefined;
  }

  private getPermittedMessage(message?: string) {
    if (message) {
      if (this.displayServiceErrorMessages) return message;
      if (typeof message === 'string' && this._permittedErrorPrefixes) {
        const result = Messages.checkPermittedErrorPrefixes(this._permittedErrorPrefixes, message);
        if (result) return result;
      } else if (Array.isArray(message) && this._permittedErrorPrefixes) {
        for (let i = 0; i < message.length; i += 1) {
          const result = Messages.checkPermittedErrorPrefixes(this._permittedErrorPrefixes, message[i]);
          if (result) return result;
        }
      }
    }
    return undefined;
  }

  private getLastMessageElement() {
    return this.elementRef.children[this.elementRef.children.length - 1];
  }

  private getLastMessageBubbleElement() {
    return Array.from(this.getLastMessageElement()?.children?.[0].children || []).find((element) => {
      return element.classList.contains('message-bubble');
    });
  }

  public isLastMessageError() {
    return this.getLastMessageBubbleElement()?.classList.contains('error-message-text');
  }

  public removeError() {
    if (this.isLastMessageError()) this.getLastMessageElement().remove();
  }

  public addLoadingMessage() {
    if (!this._displayLoadingMessage) return;
    const messageElements = this.createMessageElements('', true);
    const {outerContainer, bubbleElement} = messageElements;
    bubbleElement.classList.add('loading-message-text');
    const dotsElement = document.createElement('div');
    dotsElement.classList.add('dots-flashing');
    bubbleElement.appendChild(dotsElement);
    this.applyCustomStyles(messageElements, true, false, this.messageStyles?.loading);
    LoadingMessageDotsStyle.set(bubbleElement, this.messageStyles);
    this.elementRef.appendChild(outerContainer);
    this.elementRef.scrollTop = this.elementRef.scrollHeight;
  }

  public addNewStreamedMessage() {
    const {bubbleElement} = this.addNewTextMessage('', true, false);
    bubbleElement.classList.add('streamed-message');
    this.elementRef.scrollTop = this.elementRef.scrollHeight;
    return bubbleElement;
  }

  public updateStreamedMessage(text: string, bubbleElement: HTMLElement) {
    const isScrollbarAtBottomOfElement = ElementUtils.isScrollbarAtBottomOfElement(this.elementRef);
    if (text.trim().length !== 0) {
      const defaultColor = this.messageStyles?.default;
      bubbleElement.style.color = defaultColor?.ai?.bubble?.color || defaultColor?.shared?.bubble?.color || '';
    }
    this._streamedText += text;
    bubbleElement.innerHTML = this._remarkable.render(this._streamedText);
    if (isScrollbarAtBottomOfElement) this.elementRef.scrollTop = this.elementRef.scrollHeight;
  }

  public finaliseStreamedMessage() {
    if (!this.getLastMessageBubbleElement()?.classList.contains('streamed-message')) return;
    this.messages[this.messages.length - 1].text = this._streamedText;
    this.sendClientUpdate(Messages.createMessageContent(true, {text: this._streamedText}), false);
    if (this._textToSpeech) TextToSpeech.speak(this._streamedText, this._textToSpeech);
    this._streamedText = '';
  }

  private populateIntroPanel(childElement?: HTMLElement, introPanelMarkUp?: string, introPanelStyle?: CustomStyle) {
    if (childElement || introPanelMarkUp) {
      this._introPanel = new IntroPanel(childElement, introPanelMarkUp, introPanelStyle);
      if (this._introPanel._elementRef) this.elementRef.appendChild(this._introPanel._elementRef);
    }
  }

  async addMultipleFiles(filesData: {file: File; type: MessageFileType}[]) {
    return Promise.all(
      (filesData || []).map((fileData) => {
        return new Promise((resolve) => {
          if (!fileData.type || fileData.type === 'any') {
            const fileName = fileData.file.name || FileMessageUtils.DEFAULT_FILE_NAME;
            this.addNewMessage({files: [{name: fileName, type: 'any'}]}, false, true);
            resolve(true);
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(fileData.file);
            reader.onload = () => {
              this.addNewMessage({files: [{src: reader.result as string, type: fileData.type}]}, false, true);
              resolve(true);
            };
          }
        });
      })
    );
  }

  private clearMessages(isReset?: boolean) {
    const retainedElements: MessageElements[] = [];
    this._messageElementRefs.forEach((message) => {
      const bubbleClasslist = message.bubbleElement.classList;
      if (bubbleClasslist.contains('loading-message-text') || bubbleClasslist.contains('streamed-message')) {
        retainedElements.push(message);
      } else {
        message.outerContainer.remove();
      }
    });
    // this is a form of cleanup as this._messageElementRefs does not contain error messages
    // and can only be deleted by direct search
    Array.from(this.elementRef.children).forEach((messageElement) => {
      const bubbleClasslist = messageElement.children[0]?.children[0];
      if (bubbleClasslist?.classList.contains('error-message-text')) {
        messageElement.remove();
      }
    });
    this._messageElementRefs = retainedElements;
    if (isReset !== false) {
      if (this._introPanel?._elementRef) this._introPanel.display();
      this.addIntroductoryMessage();
    }
    this.messages.splice(0, this.messages.length);
    this._onClearMessages?.();
  }

  // this is mostly used for enabling highlight.js to highlight code if it is downloads later
  private refreshTextMessages() {
    this._remarkable = RemarkableConfig.createNew();
    this.messages.forEach((message, index) => {
      if (message.text) this._messageElementRefs[index].bubbleElement.innerHTML = this._remarkable.render(message.text);
    });
  }
}
