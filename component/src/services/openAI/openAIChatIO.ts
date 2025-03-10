import {OpenAIConverseBodyInternal, SystemMessageInternal} from '../../types/openAIInternal';
import {OpenAIConverseBaseBody} from './utils/openAIConverseBaseBody';
import {OpenAIConverseResult} from '../../types/openAIResult';
import {MessageLimitUtils} from '../utils/messageLimitUtils';
import {Messages} from '../../views/chat/messages/messages';
import {DirectServiceIO} from '../utils/directServiceIO';
import {HTTPRequest} from '../../utils/HTTP/HTTPRequest';
import {MessageContent} from '../../types/messages';
import {OpenAIUtils} from './utils/openAIUtils';
import {Stream} from '../../utils/HTTP/stream';
import {OpenAIChat} from '../../types/openAI';
import {Response} from '../../types/response';
import {DeepChat} from '../../deepChat';

// chat is a form of completions
export class OpenAIChatIO extends DirectServiceIO {
  override insertKeyPlaceholderText = 'OpenAI API Key';
  override getKeyLink = 'https://platform.openai.com/account/api-keys';
  url = 'https://api.openai.com/v1/chat/completions';
  permittedErrorPrefixes = ['Incorrect'];
  private readonly _systemMessage: SystemMessageInternal =
    OpenAIChatIO.generateSystemMessage('You are a helpful assistant.');

  constructor(deepChat: DeepChat) {
    const directConnectionCopy = JSON.parse(JSON.stringify(deepChat.directConnection));
    const apiKey = directConnectionCopy.openAI;
    super(deepChat, OpenAIUtils.buildKeyVerificationDetails(), OpenAIUtils.buildHeaders, apiKey);
    const config = directConnectionCopy.openAI?.chat; // can be undefined as this is the default service
    if (typeof config === 'object') {
      if (config.system_prompt) this._systemMessage = OpenAIChatIO.generateSystemMessage(config.system_prompt);
      this.cleanConfig(config);
      Object.assign(this.rawBody, config);
    }
    if (this.maxMessages === undefined) this.maxMessages = -1;
    this.rawBody.model ??= OpenAIConverseBaseBody.GPT_CHAT_TURBO_MODEL;
  }

  public static generateSystemMessage(system_prompt: string): SystemMessageInternal {
    return {role: 'system', content: system_prompt};
  }

  private cleanConfig(config: OpenAIChat) {
    delete config.system_prompt;
  }

  // prettier-ignore
  private preprocessBody(body: OpenAIConverseBodyInternal, pMessages: MessageContent[]) {
    const bodyCopy = JSON.parse(JSON.stringify(body));
    const totalMessagesMaxCharLength = this.totalMessagesMaxCharLength || OpenAIUtils.CONVERSE_MAX_CHAR_LENGTH;
    const processedMessages = MessageLimitUtils.getCharacterLimitMessages(pMessages,
        totalMessagesMaxCharLength - this._systemMessage.content.length)
      .map((message) => ({content: message.text, role: message.role === 'ai' ? 'assistant' : 'user'}));
    bodyCopy.messages = [this._systemMessage, ...processedMessages];
    return bodyCopy;
  }

  override async callServiceAPI(messages: Messages, pMessages: MessageContent[]) {
    if (!this.requestSettings) throw new Error('Request settings have not been set up');
    const body = this.preprocessBody(this.rawBody, pMessages);
    if (this.deepChat.stream || body.stream) {
      body.stream = true;
      Stream.request(this, body, messages);
    } else {
      HTTPRequest.request(this, body, messages);
    }
  }

  override async extractResultData(result: OpenAIConverseResult): Promise<Response> {
    if (result.error) throw result.error.message;
    if (result.choices[0].delta) {
      return {text: result.choices[0].delta.content || ''};
    }
    if (result.choices[0].message) {
      return {text: result.choices[0].message.content};
    }
    return {text: ''};
  }
}
