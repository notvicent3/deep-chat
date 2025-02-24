import {MessageStyles, MessageRoleStyles} from '../../../types/messages';
import {MessageFile} from '../../../types/messageFile';
import {MessageElements, Messages} from './messages';

export class FileMessageUtils {
  public static readonly DEFAULT_FILE_NAME = 'file';

  // prettier-ignore
  public static updateMessages(messages: Messages, elements: MessageElements, data: MessageFile,
      styles: keyof MessageStyles, isAI: boolean, isInitial = false) {
    messages.applyCustomStyles(elements, isAI, true, messages.messageStyles?.[styles] as MessageRoleStyles);
    messages.elementRef.scrollTop = messages.elementRef.scrollHeight;
    const messageContent = Messages.createMessageContent(isAI, {file: data});
    messages.messages.push(messageContent);
    messages.sendClientUpdate(messageContent, isInitial);
  }

  private static wrapInLink(element: HTMLElement, url: string) {
    const linkWrapperElement = document.createElement('a');
    linkWrapperElement.href = url;
    linkWrapperElement.target = '_blank';
    linkWrapperElement.appendChild(element);
    return linkWrapperElement;
  }

  public static processContent(contentEl: HTMLElement, url?: string) {
    if (!url || url.startsWith('data')) return contentEl;
    return FileMessageUtils.wrapInLink(contentEl, url);
  }

  private static waitToLoadThenScroll(messagesContainerEl: HTMLElement) {
    setTimeout(() => {
      messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
    }, 60); // this timeout is used to allow the new image element dimensions to be rendered
  }
  public static scrollDownOnImageLoad(url: string, messagesContainerEl: HTMLElement) {
    if (url.startsWith('data')) {
      FileMessageUtils.waitToLoadThenScroll(messagesContainerEl);
    } else {
      // this is used to prevent an issue where we immediately scroll down before the image meta data has been
      // downloaded which is used to create the image element dimensions (before the image data is loaded)
      // we cannot use the .onload event handler as it is only triggered when the image is fully rendered on
      // the screen and not when it first appears - hence not appropriate for slow images
      try {
        // no-cors is an attempt to prevent a typical 'No 'Access-Control-Allow-Origin' header' error
        // being logged in the console
        fetch(url, {mode: 'no-cors'})
          .catch(() => {})
          .finally(() => {
            FileMessageUtils.waitToLoadThenScroll(messagesContainerEl);
          });
      } catch (err) {
        messagesContainerEl.scrollTop = messagesContainerEl.scrollHeight;
      }
    }
  }
}
