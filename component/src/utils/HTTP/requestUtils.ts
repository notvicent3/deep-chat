import {Messages} from '../../views/chat/messages/messages';
import {RequestDetails} from '../../types/interceptors';
import {Request} from '../../types/request';
import {DeepChat} from '../../deepChat';

type InterceptorResult = Promise<RequestDetails & {error?: string}>;

export class RequestUtils {
  public static readonly CONTENT_TYPE = 'Content-Type';

  // need to pass stringifyBody boolean separately as binding is throwing an error for some reason
  // prettier-ignore
  public static async temporarilyRemoveHeader(requestSettings: Request | undefined,
      request: (stringifyBody?: boolean) => Promise<void>, stringifyBody: boolean) {
    if (!requestSettings?.headers) throw new Error('Request settings have not been set up');
    const previousHeader = requestSettings.headers[RequestUtils.CONTENT_TYPE];
    delete requestSettings.headers[RequestUtils.CONTENT_TYPE];
    await request(stringifyBody);
    requestSettings.headers[RequestUtils.CONTENT_TYPE] = previousHeader;
  }

  public static displayError(messages: Messages, err: object, defMessage = 'Service error, please try again.') {
    console.error(err);
    if (typeof err === 'object') {
      if (Object.keys(err).length === 0) {
        return messages.addNewErrorMessage('service', defMessage);
      }
      return messages.addNewErrorMessage('service', JSON.stringify(err));
    }
    messages.addNewErrorMessage('service', err);
  }

  public static processResponseByType(response: Response) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    // when no contentType - the response is returned primarily for azure summarization to allow examination of headers
    if (contentType?.includes('text/plain') || !contentType) {
      return response;
    }
    return response.blob();
  }

  public static async processRequestInterceptor(deepChat: DeepChat, requestDetails: RequestDetails): InterceptorResult {
    const result = (await deepChat.requestInterceptor?.(requestDetails)) || requestDetails;
    const resReqDetails = result as RequestDetails;
    const resErrDetails = result as {error?: string};
    return {body: resReqDetails.body, headers: resReqDetails.headers, error: resErrDetails.error};
  }
}
