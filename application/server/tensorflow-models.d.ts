declare module '@tensorflow-models/universal-sentence-encoder' {
  import * as tf from '@tensorflow/tfjs';

  export class UniversalSentenceEncoder {
    load(): Promise<UniversalSentenceEncoder>;
    embed(input: string | string[]): Promise<tf.Tensor2D>;
  }

  export function load(): Promise<UniversalSentenceEncoder>;
}
