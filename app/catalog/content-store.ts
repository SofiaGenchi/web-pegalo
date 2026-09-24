import { readContent } from '#pegalo-repository';
import { defaultContent } from './content-policy';
export async function loadContent() {
  return (await readContent()) ?? { content: defaultContent, revision: 0 };
}
