import { HttpError } from '~/src/errors/http/HttpError';


/**
 * HTTP 404
 */
export class Http404 extends HttpError {
  public static statusCode = 404;
}
