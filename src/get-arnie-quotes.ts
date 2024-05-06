import { httpGet } from './mock-http-interface';

type TResultSuccess = {
  'Arnie Quote': string;
};

type TResultFailure = {
  FAILURE: string
};

type TResult = TResultSuccess | TResultFailure;

const toTResult = (p:  PromiseSettledResult<{status: number; body: string;}>): TResult => {
  if(p.status === 'fulfilled') {
    const { body: bodyJson, status } = p.value;
    const body: { message: string } = JSON.parse(bodyJson);
    if(status === 200) {
      return { 'Arnie Quote': body.message };
    }
    return { FAILURE: body.message };
  }
  // I am not sure what we expect in this case since httpGet never rejects, so will be a bit defensive. :)
  return { FAILURE: `Unexpected promise rejection: ${p.reason}` };
};

// Since most of the logic is just the conversion betwen settled results and TResults, I found it reasonable to keep this function as a one-liner.
// It seems readable enough for me and I would extend it if anyone would complain in a PR comment.
export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> =>
  (await Promise.allSettled(urls.map(httpGet))).map(toTResult);