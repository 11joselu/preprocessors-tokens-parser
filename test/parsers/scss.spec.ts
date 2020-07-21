import { scssParser, getOnlyDeclarationNodes } from '../../src/parsers/scss';
import { Node, NodeType } from '../../src/parseContent';

describe('scssParser', () => {
  describe('styles parser', () => {
    it('given empty string return an empty object ', () => {
      const parsedContent = scssParser('');

      expect(parsedContent.length).toBe(0);
    });

    it('given inline styles create a tokens results correctly', () => {
      const [parsedContent] = scssParser('$myVar: red');

      expect(parsedContent.value).toBe('red');
      expect(parsedContent.declaration).toBe('myVar');
    });

    it('given multiline styles create a tokens results correctly', () => {
      const [parsedContent] = scssParser(`
    $myVar: red
    `);

      expect(parsedContent.value).toBe('red');
      expect(parsedContent.declaration).toBe('myVar');
    });

    it('given multiline styles with multiple variables declarations create a tokens results correctly', () => {
      const styles = `
        $myVar: red;
        $mySecondVar: blue;
    `;

      const parsedContent = scssParser(styles);
      const [myVar, mySecondVar] = parsedContent;

      expect(parsedContent.length).toBe(2);
      expect(myVar.declaration).toBe('myVar');
      expect(myVar.value).toBe('red');
      expect(mySecondVar.declaration).toBe('mySecondVar');
      expect(mySecondVar.value).toBe('blue');
    });
  });

  describe('getOnlyDeclarationNodes', () => {
    it('filter correctly array of nodes by his type', () => {
      const nodes = [
        createNode('declaration'),
        createNode('ident'),
        createNode('declaration'),
      ];

      const filteredNodes = getOnlyDeclarationNodes(nodes);

      expect(filteredNodes.length).toBe(2);
    });
  });
});

function createNode(type: NodeType): Node {
  return {
    type,
    content: '',
    start: -1,
    end: -1,
    first: (type?: NodeType) => createNode(type),
    is: function (validationType) {
      return this.type === validationType;
    },
  };
}
