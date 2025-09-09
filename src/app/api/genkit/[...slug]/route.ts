import {genkit} from '@/ai/genkit';
import {toNextResponse} from '@genkit-ai/next';

export const {GET, POST} = genkit.getAPIHandler({
  cors: {
    origin: '*',
  },
  
  auth: async (auth, input) => {
    // You can implement custom authentication logic here.
    // By default, it will allow all requests on dev.
    if (process.env.NODE_ENV === 'development') {
      return;
    }
  },
});
