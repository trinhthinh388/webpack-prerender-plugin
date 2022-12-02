/* eslint-disable @typescript-eslint/ban-ts-comment */
import csstree, { CssNode } from 'css-tree';

export function getAllUsedKeyframes(ast: CssNode): Set<string> {
  return new Set(
    // @ts-ignore
    csstree.lexer.findAllFragments(ast, 'Type', 'keyframes-name').map(entry => {
      const keyframeName = csstree.generate(entry.nodes.first);
      return keyframeName;
    })
  );
}

export function removeAllUnusedKeyframes(ast: CssNode) {
  const usedKeyframes = getAllUsedKeyframes(ast);
  csstree.walk(ast, {
    visit: 'Atrule',
    enter(atrule, item, list) {
      const keyword = csstree.keyword(atrule.name);

      if (keyword.basename === 'keyframes') {
        const name = csstree.generate(atrule.prelude as CssNode);
        if (!usedKeyframes.has(name)) {
          list.remove(item);
        }
      }
    },
  });
}
