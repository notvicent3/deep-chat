import {Messages} from '../../views/chat/messages/messages';
import {HTTPRequest} from '../../utils/HTTP/HTTPRequest';
import {HuggingFaceModel} from '../../types/huggingFace';
import {MessageContent} from '../../types/messages';
import {ServiceFileTypes} from '../serviceIO';
import {HuggingFaceIO} from './huggingFaceIO';
import {APIKey} from '../../types/APIKey';
import {DeepChat} from '../../deepChat';

export class HuggingFaceFileIO extends HuggingFaceIO {
  isTextInputDisabled = true;

  // prettier-ignore
  constructor(deepChat: DeepChat, placeholderText: string, defaultModel: string,
      config: true | (HuggingFaceModel), apiKey?: APIKey, existingFileTypes?: ServiceFileTypes) {
    super(deepChat, placeholderText, defaultModel, config, apiKey, existingFileTypes);
    this.canSendMessage = HuggingFaceFileIO.canSendFile;
  }

  private static canSendFile(_?: string, files?: File[]) {
    return !!files?.[0];
  }

  override preprocessBody(_: {}, __: MessageContent[], files: File[]) {
    return files[0] as unknown as {inputs: string};
  }

  // prettier-ignore
  override async callServiceAPI(messages: Messages, _: MessageContent[], files?: File[]) {
    if (!this.requestSettings) throw new Error('Request settings have not been set up');
    if (!files?.[0]) throw new Error('No file was added');
    HTTPRequest.poll(this, files[0], messages, false);
  }
}
